@echo off
rem ===========================================================================
rem  TOOLIO - TEK TIKLA YAYINLAMA
rem
rem  Kullanim (proje klasorunde):
rem    deploy.bat            -> Siteyi derler ve sunucuya yukler (cift tikla da olur)
rem    deploy.bat kurulum    -> Sunucu bilgilerini ve SSH anahtarini (yeniden) ayarlar
rem    deploy.bat geri-al    -> Siteyi bir onceki surume dondurur
rem    deploy.bat durum      -> Sunucudaki surumu ve yedekleri gosterir
rem    deploy.bat teshis     -> Siteyi sunucuda hangi programin sundugunu raporlar
rem    deploy.bat sunucu-kur -> (Bir kerelik) Sitenin yayin klasorunden sunulmasini saglar
rem    deploy.bat onizle     -> Siteyi derleyip bilgisayarinda acar (yuklemez)
rem
rem  Gerekenler: Node.js 20.19+ (https://nodejs.org), Windows 10/11
rem  (ssh, scp, tar ve curl Windows ile birlikte gelir), istege bagli Git.
rem ===========================================================================
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
title Toolio Yayinlama

set "ROOT=%~dp0"
set "CONFIG=%ROOT%deploy.config.bat"
set "TMPDIR_LOCAL=%ROOT%.deploy-tmp"
set "REMOTE_SCRIPT_SRC=%ROOT%deploy\remote-deploy.sh"
set "ARCHIVE_NAME=toolio-dist.tar.gz"
set "REMOTE_ARCHIVE=/tmp/toolio-dist.tar.gz"
set "REMOTE_SCRIPT=/tmp/toolio-remote-deploy.sh"
set "EXIT_CODE=0"

rem --- Windows araclari (Git Bash'in tar/ssh surumleriyle karismasin) ---
set "TAR_EXE=%SystemRoot%\System32\tar.exe"
set "SSH_EXE=ssh"
set "SCP_EXE=scp"
set "KEYGEN_EXE=ssh-keygen"
if exist "%SystemRoot%\System32\OpenSSH\ssh.exe" (
  set "SSH_EXE=%SystemRoot%\System32\OpenSSH\ssh.exe"
  set "SCP_EXE=%SystemRoot%\System32\OpenSSH\scp.exe"
  set "KEYGEN_EXE=%SystemRoot%\System32\OpenSSH\ssh-keygen.exe"
)

set "ACTION=%~1"
if "%ACTION%"=="" set "ACTION=yayinla"

echo.
echo  ==================================================
echo    TOOLIO YAYINLAMA  -  islem: %ACTION%
echo  ==================================================
echo.

if /I "%ACTION%"=="kurulum" (
  call :kurulum
  goto :son
)
if /I "%ACTION%"=="onizle" (
  call :onizle
  goto :son
)

if not exist "%CONFIG%" (
  echo  Ilk calistirma: once sunucu bilgilerini ayarlayalim.
  echo.
  call :kurulum
  if errorlevel 1 goto :hata
)
call "%CONFIG%"
call :ssh_ayarla

if /I "%ACTION%"=="yayinla" goto :yayinla
if /I "%ACTION%"=="geri-al" goto :geri_al
if /I "%ACTION%"=="durum" goto :durum
if /I "%ACTION%"=="teshis" goto :teshis
if /I "%ACTION%"=="sunucu-kur" goto :sunucu_kur

echo  Bilinmeyen islem: %ACTION%
echo  Kullanim: deploy.bat [kurulum ^| geri-al ^| durum ^| teshis ^| sunucu-kur ^| onizle]
set "EXIT_CODE=1"
goto :son


rem ===========================================================================
:yayinla
rem ===========================================================================
call :araclari_kontrol_et
if errorlevel 1 goto :hata

echo  [1/6] Kod GitHub'a yedekleniyor...
call :git_yedekle

echo.
echo  [2/6] Paketler kontrol ediliyor (npm install)...
call npm install --no-audit --no-fund --legacy-peer-deps
if errorlevel 1 (
  echo  npm install basarisiz oldu.
  goto :hata
)

echo.
echo  [3/6] Site derleniyor (npm run build)...
call npm run build
if errorlevel 1 (
  echo.
  echo  Derleme basarisiz oldu. Yukaridaki hata mesajini kontrol edin.
  echo  Sunucuya HICBIR SEY yuklenmedi; site eski haliyle calismaya devam ediyor.
  goto :hata
)
if not exist "dist\index.html" (
  echo  dist\index.html olusmadi.
  goto :hata
)

call :surum_bilgisi_yaz

echo.
echo  [4/6] Paket hazirlaniyor...
if not exist "%TMPDIR_LOCAL%" mkdir "%TMPDIR_LOCAL%"
if exist "%TMPDIR_LOCAL%\%ARCHIVE_NAME%" del /q "%TMPDIR_LOCAL%\%ARCHIVE_NAME%"
"%TAR_EXE%" -czf "%TMPDIR_LOCAL%\%ARCHIVE_NAME%" -C dist .
if errorlevel 1 (
  echo  Arsiv olusturulamadi.
  goto :hata
)

echo.
echo  [5/6] Sunucuya yukleniyor: %SERVER_USER%@%SERVER_HOST%
pushd "%TMPDIR_LOCAL%"
copy /y "%REMOTE_SCRIPT_SRC%" "remote-deploy.sh" >nul
"%SCP_EXE%" %SSH_OPTS% -P %SERVER_PORT% "%ARCHIVE_NAME%" "remote-deploy.sh" %SERVER_USER%@%SERVER_HOST%:/tmp/
set "SCP_RESULT=!errorlevel!"
popd
if not "!SCP_RESULT!"=="0" (
  echo  Dosyalar sunucuya kopyalanamadi. Sunucu adresini, kullaniciyi ve sifreyi kontrol edin.
  goto :hata
)

echo.
echo  [6/6] Sunucuda yeni surume geciliyor...
"%SSH_EXE%" -t %SSH_OPTS% -p %SERVER_PORT% %SERVER_USER%@%SERVER_HOST% "tr -d '\r' < /tmp/remote-deploy.sh > %REMOTE_SCRIPT% && rm -f /tmp/remote-deploy.sh && bash %REMOTE_SCRIPT% deploy '%WEB_ROOT%' %REMOTE_ARCHIVE% %KEEP_BACKUPS%"
if errorlevel 1 (
  echo.
  echo  Sunucuda yayin tamamlanamadi. Site degismedi veya onceki surum korundu.
  goto :hata
)

call :saglik_kontrolu

echo.
echo  ==================================================
echo    YAYIN TAMAMLANDI:  %SITE_URL%
echo  ==================================================
echo   Bir sorun gorursen:  deploy.bat geri-al
goto :son


rem ===========================================================================
:geri_al
rem ===========================================================================
echo  Site bir onceki surume geri aliniyor...
call :betigi_gonder
if errorlevel 1 goto :hata
"%SSH_EXE%" -t %SSH_OPTS% -p %SERVER_PORT% %SERVER_USER%@%SERVER_HOST% "tr -d '\r' < /tmp/remote-deploy.sh > %REMOTE_SCRIPT% && rm -f /tmp/remote-deploy.sh && bash %REMOTE_SCRIPT% rollback '%WEB_ROOT%'"
if errorlevel 1 goto :hata
echo.
echo  Geri alma tamamlandi. Tekrar yeni surume gecmek icin: deploy.bat
goto :son


rem ===========================================================================
:durum
rem ===========================================================================
call :betigi_gonder
if errorlevel 1 goto :hata
"%SSH_EXE%" -t %SSH_OPTS% -p %SERVER_PORT% %SERVER_USER%@%SERVER_HOST% "tr -d '\r' < /tmp/remote-deploy.sh > %REMOTE_SCRIPT% && rm -f /tmp/remote-deploy.sh && bash %REMOTE_SCRIPT% status '%WEB_ROOT%'"
if errorlevel 1 goto :hata
goto :son


rem ===========================================================================
:teshis
rem ===========================================================================
set "REPORT=%ROOT%teshis-raporu.txt"
echo  Sunucu taraniyor (hicbir sey degistirilmez)...
call :betigi_gonder
if errorlevel 1 goto :hata
"%SSH_EXE%" %SSH_OPTS% -p %SERVER_PORT% %SERVER_USER%@%SERVER_HOST% "tr -d '\r' < /tmp/remote-deploy.sh > %REMOTE_SCRIPT% && rm -f /tmp/remote-deploy.sh && bash %REMOTE_SCRIPT% diagnose '%WEB_ROOT%'" > "%REPORT%" 2>&1
type "%REPORT%"
echo.
echo  Rapor kaydedildi: teshis-raporu.txt  (bu dosyayi Claude'a gonderebilirsin)
goto :son


rem ===========================================================================
:sunucu_kur
rem ===========================================================================
set "NEW_WEB_ROOT=/var/www/toolio-site/html"
echo  Bu islem BIR KEZ yapilir:
echo   - toolio.com.tr'yi sunan Docker konteyneri, siteyi %NEW_WEB_ROOT%
echo     klasorunden okuyacak sekilde yeniden olusturulur (ayni ad, ayni ag).
echo   - Nginx Proxy Manager'a ve diger sitelere dokunulmaz.
echo   - Eski konteyner silinmez; sorun olursa otomatik geri getirilir.
echo.
choice /C EH /N /M "  Devam edilsin mi? [E/H]: "
if errorlevel 2 goto :son
call :betigi_gonder
if errorlevel 1 goto :hata
"%SSH_EXE%" -t %SSH_OPTS% -p %SERVER_PORT% %SERVER_USER%@%SERVER_HOST% "tr -d '\r' < /tmp/remote-deploy.sh > %REMOTE_SCRIPT% && rm -f /tmp/remote-deploy.sh && bash %REMOTE_SCRIPT% setup '%WEB_ROOT%' '%NEW_WEB_ROOT%'"
if errorlevel 1 (
  echo.
  echo  Sunucu kurulumu tamamlanamadi. Yukaridaki mesaji okuyun; site eski haliyle calisiyor.
  goto :hata
)
set "WEB_ROOT=%NEW_WEB_ROOT%"
call :config_yaz
echo.
echo  deploy.config.bat guncellendi: WEB_ROOT=%NEW_WEB_ROOT%
call :saglik_kontrolu
echo.
echo  Sunucu kurulumu tamamlandi. Bundan sonra sadece deploy.bat calistirman yeterli.
goto :son


rem ===========================================================================
:config_yaz
rem ===========================================================================
if not defined GIT_PUSH set "GIT_PUSH=1"
if not defined KEEP_BACKUPS set "KEEP_BACKUPS=5"
(
  echo @echo off
  echo rem Toolio yayin ayarlari - deploy.bat tarafindan olusturuldu.
  echo rem Bu dosya GitHub'a gonderilmez ^(.gitignore^).
  echo set "SERVER_HOST=!SERVER_HOST!"
  echo set "SERVER_USER=!SERVER_USER!"
  echo set "SERVER_PORT=!SERVER_PORT!"
  echo set "WEB_ROOT=!WEB_ROOT!"
  echo set "SITE_URL=!SITE_URL!"
  echo rem Yayindan once degisiklikleri GitHub'a commit+push et: 1=evet, 0=hayir
  echo set "GIT_PUSH=!GIT_PUSH!"
  echo rem Sunucuda saklanacak eski surum sayisi
  echo set "KEEP_BACKUPS=!KEEP_BACKUPS!"
) > "%CONFIG%"
exit /b 0


rem ===========================================================================
:betigi_gonder
rem ===========================================================================
rem Goreli yol kullaniyoruz: scp "C:\..." gibi yollari sunucu adi sanabilir.
pushd "%ROOT%deploy"
"%SCP_EXE%" %SSH_OPTS% -P %SERVER_PORT% "remote-deploy.sh" %SERVER_USER%@%SERVER_HOST%:/tmp/remote-deploy.sh
set "SCP_RESULT=!errorlevel!"
popd
if not "!SCP_RESULT!"=="0" (
  echo  Sunucuya baglanilamadi. deploy.config.bat icindeki bilgileri kontrol edin.
  exit /b 1
)
exit /b 0


rem ===========================================================================
:onizle
rem ===========================================================================
call :node_kontrol
if errorlevel 1 exit /b 1
call npm install --no-audit --no-fund --legacy-peer-deps
if errorlevel 1 exit /b 1
call npm run build
if errorlevel 1 exit /b 1
echo.
echo  Site http://localhost:4173 adresinde aciliyor. Kapatmak icin Ctrl+C.
start "" "http://localhost:4173"
call npx vite preview --port 4173
exit /b 0


rem ===========================================================================
:kurulum
rem ===========================================================================
set "S_HOST="
set "S_USER="
set "S_PORT="
set "S_ROOT="
set "S_SITE="
if exist "%CONFIG%" call "%CONFIG%"
if defined SERVER_HOST set "S_HOST=%SERVER_HOST%"

echo  Sunucu bilgilerini girin (koseli parantezdeki deger varsayilandir, Enter ile gecin).
echo.
set "IN_HOST="
if defined S_HOST (
  set /p "IN_HOST=  Sunucu IP adresi [%S_HOST%]: "
) else (
  set /p "IN_HOST=  Sunucu IP adresi (ornek 185.12.34.56): "
)
if defined IN_HOST set "S_HOST=!IN_HOST!"
if not defined S_HOST (
  echo  Sunucu adresi bos olamaz.
  exit /b 1
)

set "D_USER=root"
if defined SERVER_USER set "D_USER=%SERVER_USER%"
set "IN_USER="
set /p "IN_USER=  SSH kullanici adi [!D_USER!]: "
if defined IN_USER (set "S_USER=!IN_USER!") else (set "S_USER=!D_USER!")

set "D_PORT=22"
if defined SERVER_PORT set "D_PORT=%SERVER_PORT%"
set "IN_PORT="
set /p "IN_PORT=  SSH portu [!D_PORT!]: "
if defined IN_PORT (set "S_PORT=!IN_PORT!") else (set "S_PORT=!D_PORT!")

set "D_ROOT=/var/www/toolio-site/html"
if defined WEB_ROOT set "D_ROOT=%WEB_ROOT%"
set "IN_ROOT="
set /p "IN_ROOT=  Sunucudaki site klasoru [!D_ROOT!]: "
if defined IN_ROOT (set "S_ROOT=!IN_ROOT!") else (set "S_ROOT=!D_ROOT!")

set "D_SITE=https://toolio.com.tr"
if defined SITE_URL set "D_SITE=%SITE_URL%"
set "IN_SITE="
set /p "IN_SITE=  Site adresi [!D_SITE!]: "
if defined IN_SITE (set "S_SITE=!IN_SITE!") else (set "S_SITE=!D_SITE!")

set "SERVER_HOST=!S_HOST!"
set "SERVER_USER=!S_USER!"
set "SERVER_PORT=!S_PORT!"
set "WEB_ROOT=!S_ROOT!"
set "SITE_URL=!S_SITE!"
call :config_yaz
echo.
echo  Ayarlar kaydedildi: deploy.config.bat

call "%CONFIG%"
echo.
choice /C EH /N /M "  Her yayinda sifre sormamasi icin SSH anahtari kurulsun mu? [E/H]: "
if errorlevel 2 (
  echo  Anahtar kurulmadi. Her yayinda sunucu sifresi sorulacak.
  exit /b 0
)
call :ssh_anahtari_kur
exit /b 0


rem ===========================================================================
:ssh_anahtari_kur
rem ===========================================================================
set "KEY_FILE=%USERPROFILE%\.ssh\toolio_deploy"
if not exist "%USERPROFILE%\.ssh" mkdir "%USERPROFILE%\.ssh"
if not exist "%KEY_FILE%" (
  echo  Yeni SSH anahtari olusturuluyor: %KEY_FILE%
  "%KEYGEN_EXE%" -t ed25519 -N "" -C "toolio-deploy" -f "%KEY_FILE%" -q
  if errorlevel 1 (
    echo  SSH anahtari olusturulamadi.
    exit /b 1
  )
)
echo.
echo  Anahtar sunucuya ekleniyor. Simdi SON KEZ sunucu sifreniz istenecek.
type "%KEY_FILE%.pub" | "%SSH_EXE%" -o StrictHostKeyChecking=accept-new -p %SERVER_PORT% %SERVER_USER%@%SERVER_HOST% "mkdir -p ~/.ssh && chmod 700 ~/.ssh && touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && cat >> ~/.ssh/authorized_keys"
if errorlevel 1 (
  echo  Anahtar sunucuya eklenemedi. Yayin yine de sifreyle calisir.
  exit /b 0
)
echo  SSH anahtari kuruldu. Bundan sonra sifre sorulmayacak.
exit /b 0


rem ===========================================================================
:ssh_ayarla
rem ===========================================================================
if not defined SERVER_PORT set "SERVER_PORT=22"
if not defined WEB_ROOT set "WEB_ROOT=/var/www/toolio"
if not defined SITE_URL set "SITE_URL=https://toolio.com.tr"
if not defined KEEP_BACKUPS set "KEEP_BACKUPS=5"
if not defined GIT_PUSH set "GIT_PUSH=1"
set "SSH_OPTS=-o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30"
if exist "%USERPROFILE%\.ssh\toolio_deploy" (
  set "SSH_OPTS=!SSH_OPTS! -i "%USERPROFILE%\.ssh\toolio_deploy""
)
exit /b 0


rem ===========================================================================
:node_kontrol
rem ===========================================================================
where node >nul 2>&1
if errorlevel 1 (
  echo  Node.js bulunamadi. https://nodejs.org adresinden LTS surumunu kurun ve tekrar deneyin.
  exit /b 1
)
set "NODE_MAJOR="
for /f "tokens=1 delims=." %%v in ('node -p "process.versions.node"') do set "NODE_MAJOR=%%v"
if not defined NODE_MAJOR set "NODE_MAJOR=0"
if !NODE_MAJOR! LSS 20 (
  echo  Node.js surumunuz cok eski ^(v!NODE_MAJOR!^). En az Node.js 20.19 gerekli: https://nodejs.org
  exit /b 1
)
exit /b 0


rem ===========================================================================
:araclari_kontrol_et
rem ===========================================================================
call :node_kontrol
if errorlevel 1 exit /b 1
if not exist "%TAR_EXE%" (
  echo  tar.exe bulunamadi. Windows 10 ^(1803^) veya daha yeni bir surum gerekli.
  exit /b 1
)
"%SSH_EXE%" -V >nul 2>&1
if errorlevel 1 (
  echo  SSH istemcisi bulunamadi.
  echo  Ayarlar ^> Uygulamalar ^> Istege bagli ozellikler ^> "OpenSSH Istemcisi" ozelligini ekleyin.
  exit /b 1
)
exit /b 0


rem ===========================================================================
:git_yedekle
rem ===========================================================================
if not "%GIT_PUSH%"=="1" (
  echo        GIT_PUSH=0, atlandi.
  exit /b 0
)
where git >nul 2>&1
if errorlevel 1 (
  echo        Git kurulu degil, atlandi.
  exit /b 0
)
if not exist ".git" (
  echo        Bu klasor bir Git deposu degil, atlandi.
  exit /b 0
)
set "STAMP="
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm'"`) do set "STAMP=%%i"
git add -A
git diff --cached --quiet
if errorlevel 1 (
  git commit -q -m "Site guncellemesi !STAMP!"
  if errorlevel 1 (
    echo        Commit olusturulamadi ^(git kullanici adi/e-posta ayarli mi?^). Yayina devam ediliyor.
    exit /b 0
  )
  echo        Degisiklikler commit edildi.
) else (
  echo        Yeni degisiklik yok.
)
git push -q origin HEAD
if errorlevel 1 (
  echo        UYARI: GitHub'a push yapilamadi. Yayina devam ediliyor; daha sonra "git push" deneyin.
) else (
  echo        GitHub guncel.
)
exit /b 0


rem ===========================================================================
:surum_bilgisi_yaz
rem ===========================================================================
set "BUILD_STAMP="
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set "BUILD_STAMP=%%i"
set "GIT_REV=git-yok"
where git >nul 2>&1
if not errorlevel 1 (
  for /f "usebackq delims=" %%i in (`git rev-parse --short HEAD 2^>nul`) do set "GIT_REV=%%i"
)
> "dist\surum.txt" echo !BUILD_STAMP! - !GIT_REV!
exit /b 0


rem ===========================================================================
:saglik_kontrolu
rem ===========================================================================
where curl >nul 2>&1
if errorlevel 1 exit /b 0
echo.
echo  Site kontrol ediliyor...
set "HTTP_CODE="
for /f "usebackq delims=" %%c in (`curl -s -o NUL -w "%%{http_code}" --max-time 20 "%SITE_URL%/"`) do set "HTTP_CODE=%%c"
if "!HTTP_CODE!"=="200" (
  echo        Ana sayfa: 200 OK
) else (
  echo        UYARI: Ana sayfa !HTTP_CODE! dondu. Siteyi tarayicida kontrol edin; gerekirse: deploy.bat geri-al
  exit /b 0
)
curl -s -L --max-time 20 "%SITE_URL%/privacy/" | findstr /C:"toolio.com.tr/privacy/" >nul
if errorlevel 1 (
  echo        UYARI: Site yeni surumu gostermiyor olabilir.
  echo        Sunucu kurulumu yapilmadiysa bir kez calistirin:  deploy.bat sunucu-kur
) else (
  echo        Alt sayfalar hazir HTML olarak sunuluyor.
)
exit /b 0


rem ===========================================================================
:hata
rem ===========================================================================
set "EXIT_CODE=1"
echo.
echo  *** ISLEM BASARISIZ ***
goto :son

:son
echo.
if not defined NO_PAUSE pause
endlocal & exit /b %EXIT_CODE%
