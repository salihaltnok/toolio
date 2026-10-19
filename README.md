# Toolio

[toolio.com.tr](https://toolio.com.tr) — PDF, görsel, metin, geliştirici, hesaplama ve verimlilik
kategorilerinde ücretsiz, tarayıcıda çalışan online araçlar.

- **React 19 + Vite 7 + Tailwind CSS 4**
- Araçların hepsi tarayıcıda çalışır; dosyalar sunucuya yüklenmez.
- Türkçe (varsayılan) ve İngilizce arayüz.
- `npm run build` her sayfa için **hazır HTML** üretir (prerender). Google ve AdSense incelemesi
  sayfaları boş bir JavaScript kabuğu olarak değil, gerçek içerikle görür.

---

## Günlük kullanım: değişiklik yap → `deploy.bat`

1. Kodda değişikliğini yap.
2. Proje klasöründeki **`deploy.bat`** dosyasına çift tıkla.
3. Bitti. Betik şunları sırayla yapar:
   1. Değişiklikleri GitHub'a commit + push eder (yedek olarak),
   2. `npm install` ve `npm run build` çalıştırır (hata varsa **hiçbir şey yüklemeden** durur),
   3. Siteyi paketler ve SSH ile sunucuya gönderir,
   4. Sunucuda eski sürümü yedekleyip yeni sürüme geçer (geçiş milisaniyeler sürer),
   5. Sitenin açıldığını kontrol eder.

| Komut | Ne yapar? |
| --- | --- |
| `deploy.bat` | Derler ve yayınlar |
| `deploy.bat geri-al` | Siteyi bir önceki sürüme döndürür |
| `deploy.bat durum` | Sunucudaki sürümü ve yedekleri listeler |
| `deploy.bat onizle` | Derleyip siteyi bilgisayarında açar (`http://localhost:4173`), yüklemez |
| `deploy.bat kurulum` | Sunucu bilgilerini ve SSH anahtarını yeniden ayarlar |
| `deploy.bat teshis` | Sunucuyu yalnızca okuyarak sitenin nereden sunulduğunu raporlar |
| `deploy.bat sunucu-kur` | (Bir kerelik) Sitenin yayın klasöründen sunulmasını sağlar |

PowerShell kullanıyorsan komutların başına `.\` ekle: `.\deploy.bat`, `.\deploy.bat geri-al` gibi.

### İlk çalıştırma

İlk seferde betik şunları sorar ve `deploy.config.bat` dosyasına kaydeder (bu dosya GitHub'a gönderilmez):

- Sunucu IP adresi
- SSH kullanıcı adı (ör. `root`)
- SSH portu (genelde `22`)
- Sunucudaki site klasörü (varsayılan `/var/www/toolio-site/html`)
- Site adresi (varsayılan `https://toolio.com.tr`)

Ardından **SSH anahtarı** kurmayı önerir. "E" dersen sunucu şifren son bir kez sorulur ve sonraki
yayınlarda bir daha sorulmaz.

### Gerekenler (Windows bilgisayar)

- **Node.js 20.19 veya üstü** — <https://nodejs.org> (LTS sürümü)
- Windows 10/11 — `ssh`, `scp`, `tar` ve `curl` Windows ile birlikte gelir.
  `ssh` yoksa: *Ayarlar → Uygulamalar → İsteğe bağlı özellikler → OpenSSH İstemcisi*.
- İsteğe bağlı: **Git** (GitHub'a otomatik yedek için). İstemezsen `deploy.config.bat`
  içinde `GIT_PUSH=0` yap.

### Sunucuda neler oluyor?

```
ziyaretçi ─► Nginx Proxy Manager (Docker, 80/443, SSL)
                └─► react-website-container (nginx:alpine)
                       └─ /var/www/toolio-site/html      ← deploy.bat buraya yayınlar
/var/www/toolio-site/html_yedekler/    son 5 sürüm (KEEP_BACKUPS)
/var/www/toolio-site/html_geri_alinan/ "geri-al" sonrası çıkarılan sürüm
/opt/toolio/                           konteyner ayarları (docker-compose.yml, nginx.conf)
```

Sunucuda Node.js, Git veya GitHub Actions runner'ı **gerekmez**. Konteyner site dosyalarını
klasörden okuduğu için yeni sürüm yayınlandığı anda görünür; konteyneri yeniden başlatmaya gerek yoktur.
Sunucuda çalışan kısım `deploy/remote-deploy.sh` dosyasıdır.

### Bir kerelik sunucu kurulumu: `deploy.bat sunucu-kur`

Eski kurulumda `react-website-container` konteyneri dosyaları kendi içinde taşıyordu, bu yüzden
yayınlar siteye yansımıyordu. `deploy.bat sunucu-kur` bunu bir kez düzeltir:

1. Nginx Proxy Manager'ın `toolio.com.tr`'yi `react-website-container:80`'e yönlendirdiğini doğrular
   (değilse hiçbir şeyi değiştirmeden durur ve ne yapılacağını söyler),
2. Site dosyalarını `/var/www/toolio` → `/var/www/toolio-site/html` taşır,
3. `/opt/toolio/` altına yeni konteyner ayarlarını yazar,
4. Eski konteyneri **silmeden** `react-website-container-eski` adıyla durdurur,
5. Aynı ad ve ağla (`proxy_net`) yeni konteyneri başlatır ve siteyi kontrol eder.
   Kontrol başarısız olursa eski konteyneri otomatik geri getirir.

Proxy Manager'a ve sunucudaki diğer konteynerlere dokunulmaz. Birkaç gün sorun olmazsa eski
konteyneri silebilirsin: `docker rm react-website-container-eski`.

`deploy.bat teshis` sunucuyu yalnızca okuyarak sitenin nereden sunulduğunu raporlar
(`teshis-raporu.txt`).

---

## Eski CI/CD'yi kapatma (isteğe bağlı)

`.github/workflows/deploy.yml` kaldırıldı; artık GitHub'a push yapmak siteyi değiştirmez.
Sunucuda kurulu GitHub Actions runner'ı hâlâ çalışıyorsa kaynak tüketmemesi için kapatabilirsin:

```bash
cd /home/githubuser/actions-runner
sudo ./svc.sh stop
sudo ./svc.sh uninstall
```

GitHub'da da *Repo → Settings → Actions → Runners* bölümünden runner'ı silebilirsin.

---

## Geliştirme

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/ klasörüne prerender'lı çıktı
npm run preview    # dist/ klasörünü yerelde sunar
```

### Yeni araç eklemek

1. `src/tools/yeni-arac/YeniArac.jsx` dosyasını oluştur (bir `<h1>` başlığı olsun).
2. `src/data/tools.js` içindeki listeye bir satır ekle (`slug`, `key`, `category`, ikon, `load`).
3. Çevirileri ekle:
   - `src/locales/tr/translation.json` ve `en/translation.json` → `tools.<key>` (name, desc, arayüz metinleri)
   - `src/locales/tr/guide.json` ve `en/guide.json` → `<key>` (seo_title, meta, intro, steps, uses, tips, faq)
4. `npm run build` — sitemap, menü, ana sayfa ve prerender otomatik güncellenir.

Build, her sayfada başlık, `<h1>` ve en az 150 kelime metin olup olmadığını kontrol eder;
eksik varsa hata verir ve yayın yapılmaz.

### Bir aracı gizlemek / tekrar açmak

`src/data/tools.js` içinde araca `hidden: true` ekle. Gizli araç menüde, ana sayfada ve
sitemap'te görünmez, adresi 404 verir; kodu silinmez.

Şu an gizli olanlar (AdSense incelemesi süresince):

- `tweet-generator` — sahte tweet/Instagram gönderisi görüntüsü üretiyor ("Enabling dishonest behavior" riski).
- `youtube-thumbnail` — YouTube içeriği indirme aracı (telif riski).

Onay geldikten sonra açmak istersen `hidden: true` satırını kaldırman yeterli; ancak bu iki aracın
politika riski onaydan sonra da devam eder.

---

## AdSense başvurusu öncesi kontrol listesi

Kod tarafında yapılanlar:

- [x] Her sayfa build sırasında hazır HTML olarak üretiliyor (başlık, açıklama, canonical, içerik).
- [x] 28 aracın her birinde TR/EN rehber: nedir, nasıl kullanılır, kullanım alanları, ipuçları, SSS.
- [x] Hakkında, İletişim, Gizlilik Politikası (AdSense/Google çerez açıklamaları, KVKK) ve Kullanım Şartları.
- [x] Gerçek 404 sayfası (`noindex`), otomatik `sitemap.xml`, `robots.txt`, `ads.txt`.
- [x] Politika riski taşıyan iki araç gizlendi; yanlış bilgi içeren metinler düzeltildi.
- [x] `<meta name="google-adsense-account">` ve AdSense kodu `<head>` içinde.

Senin yapman gerekenler:

1. `deploy.bat` ile yayınla ve <https://toolio.com.tr/privacy/> gibi sayfaları tarayıcıda kontrol et.
2. **Google Search Console**'da `https://toolio.com.tr/sitemap.xml` adresini gönder; birkaç gün
   sayfaların dizine eklenmesini bekle.
3. <https://toolio.com.tr/ads.txt> adresinin açıldığını doğrula.
4. AdSense panelinde **Gizlilik ve mesajlar → Avrupa düzenlemeleri** mesajını etkinleştir
   (AB/İngiltere ziyaretçileri için Google'ın onaylı izin mesajı).
5. AdSense panelinde siteyi "İncelemeyi iste" ile yeniden incelemeye gönder.
   Onay geldikten sonra **Otomatik reklamlar**'ı açman yeterli; ek kod gerekmez.
6. `info@toolio.com.tr` adresine gelen e-postaları alabildiğinden emin ol.

---

## Proje yapısı

```
deploy.bat                  Windows'tan tek tıkla yayın
deploy/remote-deploy.sh     Sunucu tarafı yayın/geri alma betiği (deploy.bat kullanır)
deploy/nginx-toolio.conf    Önerilen Nginx ayarı
scripts/prerender.mjs       Build sonrası her sayfanın HTML'ini ve sitemap.xml'i üretir
src/data/tools.js           Araç listesi (tek kaynak)
src/entry-server.jsx        Prerender için sunucu tarafı render
src/i18n/                   Dil ayarları (çeviriler JS paketine gömülü)
src/locales/{tr,en}/        translation.json (arayüz) + guide.json (rehberler)
src/components/ToolGuide.jsx  Araç sayfalarının altındaki rehber bölümü
src/tools/*                 Araçlar (her biri ayrı JS parçası olarak yüklenir)
```
