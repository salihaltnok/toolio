#!/usr/bin/env bash
# =============================================================================
#  Toolio - sunucu tarafi yayin betigi
#  deploy.bat bu dosyayi sunucuya /tmp altina kopyalar ve calistirir.
#  Elle calistirmaniz gerekmez.
#
#  Kullanim:
#    bash remote-deploy.sh deploy   <web_klasoru> <arsiv.tar.gz> [saklanacak_yedek]
#    bash remote-deploy.sh rollback <web_klasoru>
#    bash remote-deploy.sh status   <web_klasoru>
#    bash remote-deploy.sh diagnose <web_klasoru>   (sadece okur)
#    bash remote-deploy.sh setup    <eski_klasor> <yeni_klasor>   (bir kerelik sunucu kurulumu)
#
#  Yaptiklari (deploy):
#    1. Arsivi /var/www altinda gecici bir klasore acar ve icerigini kontrol eder.
#    2. Eski surumun JS/CSS dosyalarini (son 14 gun) yeni surume tasir; acik
#       sekmesi olan ziyaretciler "sayfa yuklenemedi" hatasi almaz.
#    3. Mevcut siteyi <web_klasoru>_yedekler/<tarih> altina tasir,
#       yeni surumu yerine koyar (gecis milisaniyeler surer).
#    4. En yeni N yedegi saklar, eskileri siler.
# =============================================================================
set -euo pipefail

ACTION="${1:-}"
WEB_ROOT="${2:-/var/www/toolio}"
ARCHIVE="${3:-/tmp/toolio-dist.tar.gz}"
KEEP="${4:-5}"

WEB_ROOT="${WEB_ROOT%/}"
BASE_DIR="$(dirname "$WEB_ROOT")"
NAME="$(basename "$WEB_ROOT")"
BACKUP_DIR="${BASE_DIR}/${NAME}_yedekler"
ROLLED_BACK_DIR="${BASE_DIR}/${NAME}_geri_alinan"
TS="$(date +%Y%m%d-%H%M%S)"

info() { printf '  [sunucu] %s\n' "$*"; }
fail() { printf '\n  [sunucu] HATA: %s\n\n' "$*" >&2; exit 1; }

# Yazma izni yoksa komutlari sudo ile calistir (sifre isteyebilir).
SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  if [ ! -w "$BASE_DIR" ] || { [ -e "$WEB_ROOT" ] && [ ! -w "$WEB_ROOT" ]; }; then
    command -v sudo >/dev/null 2>&1 || fail "$BASE_DIR klasorune yazma izni yok ve sudo bulunamadi."
    SUDO="sudo"
    info "$BASE_DIR icin yonetici izni gerekiyor; sudo sifresi istenebilir."
  fi
fi

NEW_DIR=""
cleanup() {
  # Yarim kalan bir yayin varsa gecici klasoru sil (site degismemis olur)
  if [ -n "$NEW_DIR" ] && [ -d "$NEW_DIR" ]; then $SUDO rm -rf "$NEW_DIR"; fi
}
trap cleanup EXIT

list_backups() {
  # En yeni once
  ls -1dt "$BACKUP_DIR"/*/ 2>/dev/null || true
}

fix_selinux() {
  if command -v restorecon >/dev/null 2>&1; then
    $SUDO restorecon -R "$1" >/dev/null 2>&1 || true
  fi
}

do_deploy() {
  [ -f "$ARCHIVE" ] || fail "Arsiv bulunamadi: $ARCHIVE"

  local NEW="${BASE_DIR}/.${NAME}_yeni_${TS}"
  NEW_DIR="$NEW"
  $SUDO mkdir -p "$NEW" "$BACKUP_DIR"

  info "Arsiv aciliyor..."
  $SUDO tar -xzf "$ARCHIVE" -C "$NEW" --no-same-owner

  # Icerik kontrolu: index.html var mi ve prerender edilmis mi?
  [ -f "$NEW/index.html" ] || fail "Arsivde index.html yok. Yayin iptal edildi, site degismedi."
  grep -qE '<div id="root"><[^/]' "$NEW/index.html" \
    || fail "index.html bos gorunuyor (prerender calismamis). Yayin iptal edildi, site degismedi."

  # Eski surumun hash'li JS/CSS dosyalarini koru (acik sekmeler icin)
  if [ -d "$WEB_ROOT/assets" ]; then
    $SUDO mkdir -p "$NEW/assets"
    $SUDO find "$WEB_ROOT/assets" -maxdepth 1 -type f -mtime -14 \
      -exec cp -an {} "$NEW/assets/" \; 2>/dev/null || true
  fi

  # Sahiplik ve izinler: eski klasorle ayni sahip, herkes okuyabilsin
  if [ -e "$WEB_ROOT" ]; then
    local OWNER
    OWNER="$(stat -c '%U:%G' "$WEB_ROOT" 2>/dev/null || true)"
    if [ -n "$OWNER" ]; then $SUDO chown -R "$OWNER" "$NEW" 2>/dev/null || true; fi
  fi
  $SUDO chmod -R u+rwX,go+rX,go-w "$NEW"
  $SUDO chmod 755 "$NEW"

  # Gecis
  local BACKUP_TARGET="$BACKUP_DIR/$TS"
  if [ -e "$BACKUP_TARGET" ]; then BACKUP_TARGET="${BACKUP_TARGET}-$$"; fi
  if [ -e "$WEB_ROOT" ]; then
    $SUDO mv "$WEB_ROOT" "$BACKUP_TARGET"
    info "Onceki surum yedeklendi: $BACKUP_TARGET"
  fi
  if ! $SUDO mv "$NEW" "$WEB_ROOT"; then
    if [ -d "$BACKUP_TARGET" ] && [ ! -e "$WEB_ROOT" ]; then
      $SUDO mv "$BACKUP_TARGET" "$WEB_ROOT"
    fi
    fail "Yeni surum yerine konamadi; onceki surum geri yuklendi."
  fi
  NEW_DIR=""
  fix_selinux "$WEB_ROOT"

  # Eski yedekleri temizle
  local count=0
  while IFS= read -r dir; do
    count=$((count + 1))
    if [ "$count" -gt "$KEEP" ]; then $SUDO rm -rf "$dir"; fi
  done < <(list_backups)

  rm -f "$ARCHIVE" 2>/dev/null || $SUDO rm -f "$ARCHIVE" 2>/dev/null || true

  if [ -f "$WEB_ROOT/surum.txt" ]; then
    info "Yayindaki surum: $(head -n 1 "$WEB_ROOT/surum.txt")"
  fi
  info "Yayin tamamlandi: $WEB_ROOT"
}

do_rollback() {
  local LATEST
  LATEST="$(list_backups | head -n 1)"
  [ -n "$LATEST" ] || fail "Geri alinacak yedek bulunamadi ($BACKUP_DIR)."
  LATEST="${LATEST%/}"

  $SUDO rm -rf "$ROLLED_BACK_DIR"
  if [ -e "$WEB_ROOT" ]; then
    $SUDO mv "$WEB_ROOT" "$ROLLED_BACK_DIR"
  fi
  $SUDO mv "$LATEST" "$WEB_ROOT"
  fix_selinux "$WEB_ROOT"

  info "Site bir onceki surume geri alindi: $(basename "$LATEST")"
  info "Geri alinan (yeni) surum burada duruyor: $ROLLED_BACK_DIR"
  if [ -f "$WEB_ROOT/surum.txt" ]; then
    info "Yayindaki surum: $(head -n 1 "$WEB_ROOT/surum.txt")"
  fi
}

do_status() {
  info "Site klasoru: $WEB_ROOT"
  if [ -f "$WEB_ROOT/surum.txt" ]; then
    info "Yayindaki surum: $(head -n 1 "$WEB_ROOT/surum.txt")"
  else
    info "Yayindaki surum bilgisi yok (surum.txt bulunamadi)."
  fi
  info "Yedekler (en yeni once):"
  local any=0
  while IFS= read -r dir; do
    any=1
    printf '      - %s\n' "$(basename "$dir")"
  done < <(list_backups)
  [ "$any" -eq 1 ] || printf '      (yok)\n'
  if command -v df >/dev/null 2>&1; then
    info "Disk: $(df -h "$BASE_DIR" | awk 'NR==2 {print $4 " bos / " $2 " toplam"}')"
  fi
}

do_diagnose() {
  # Sadece okur, hicbir seyi degistirmez. Bir komut hata verse de devam eder.
  set +e +u +o pipefail
  local HOST="${SITE_HOST:-toolio.com.tr}"
  local S=""; [ "$(id -u)" -ne 0 ] && command -v sudo >/dev/null 2>&1 && S="sudo"
  echo "=================== TOOLIO SUNUCU TESHISI ==================="
  echo "## Kullanici / sistem"; id; uname -srm
  echo; echo "## Yayin klasoru: $WEB_ROOT"
  ls -la "$WEB_ROOT" 2>&1 | head -12
  [ -f "$WEB_ROOT/surum.txt" ] && echo "surum.txt: $(cat "$WEB_ROOT/surum.txt")"
  echo; echo "## 80/443 portlarini dinleyen programlar"
  ($S ss -ltnp 2>/dev/null || $S netstat -ltnp 2>/dev/null) | grep -E ':(80|443|8080|8443)[[:space:]]' || echo "(bulunamadi)"
  echo; echo "## Sunucunun kendisinden siteye istek (surum.txt)"
  curl --noproxy "*" -sk -m 8 --resolve "$HOST:443:127.0.0.1" "https://$HOST/surum.txt" | head -c 200; echo
  curl --noproxy "*" -sk -m 8 -o /dev/null -w "HTTPS / -> %{http_code}\n" --resolve "$HOST:443:127.0.0.1" "https://$HOST/"
  echo "HTTP (port 80) surum.txt: $(curl --noproxy "*" -s -m 8 -H "Host: $HOST" http://127.0.0.1/surum.txt | head -c 120 | tr '\n' ' ')"
  echo; echo "## Docker"
  if command -v docker >/dev/null 2>&1; then
    $S docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}' 2>&1
    for c in $($S docker ps --format '{{.Names}}' 2>/dev/null); do
      echo "---- konteyner: $c"
      $S docker inspect -f '{{range .Mounts}}  mount: {{.Source}} -> {{.Destination}}{{println}}{{end}}{{range $k, $v := .Config.Labels}}{{if or (eq $k "com.docker.compose.project.working_dir") (eq $k "com.docker.compose.project.config_files")}}  {{$k}}={{$v}}{{println}}{{end}}{{end}}' "$c" 2>/dev/null
      $S docker exec "$c" sh -c 'for f in /usr/share/nginx/html/surum.txt /usr/share/nginx/html/index.html; do [ -f "$f" ] && echo "  $f: $(head -c 120 "$f" | tr "\n" " ")"; done; ls /etc/nginx/conf.d 2>/dev/null | sed "s/^/  conf.d: /"' 2>/dev/null
    done
  else
    echo "(docker yok)"
  fi
  echo; echo "## Host Nginx ayarlari (server_name / root / proxy_pass)"
  if command -v nginx >/dev/null 2>&1; then
    $S nginx -T 2>/dev/null | grep -nE '^# configuration file|server_name|^\s*root |proxy_pass|^\s*listen' | grep -vE '^\s*[0-9]+:\s*#[^ ]' | head -80
  else
    echo "(host'ta nginx yok)"
  fi
  echo; echo "## 'toolio' gecen ayar dosyalari"
  $S find /etc/nginx /etc/caddy /etc/apache2 /etc/httpd /etc/traefik /opt /srv /root /home -maxdepth 4 -type f \
      \( -name '*.conf' -o -name '*.yml' -o -name '*.yaml' -o -name 'Caddyfile' -o -name '*.toml' -o -name 'docker-compose*' \) \
      -size -200k 2>/dev/null | grep -v node_modules | head -400 | xargs -r $S grep -lis toolio 2>/dev/null | head -30
  echo; echo "## GitHub Actions runner"
  ls -d /root/actions-runner* /home/*/actions-runner* 2>/dev/null || echo "(bulunamadi)"
  systemctl list-units --type=service --no-pager 2>/dev/null | grep -i 'actions.runner' || true
  echo "=================== TESHIS SONU ==================="
}

# -----------------------------------------------------------------------------
#  SETUP (bir kerelik): toolio.com.tr'yi sunan Docker konteynerini, site
#  dosyalarini sunucudaki klasorden okuyacak sekilde yeniden olusturur.
#  - Nginx Proxy Manager'a ve diger konteynerlere DOKUNMAZ.
#  - Yeni konteyner ayni adla (react-website-container) ve ayni agda
#    (proxy_net) calisir; Proxy Manager ayari degismeden calismaya devam eder.
#  - Eski konteyner silinmez, "react-website-container-eski" adiyla durdurulur.
#  - Kontrol basarisiz olursa eski konteyner otomatik geri getirilir.
# -----------------------------------------------------------------------------
CONTAINER="react-website-container"
OLD_CONTAINER="react-website-container-eski"
DOCKER_NET="proxy_net"
APP_DIR="/opt/toolio"
COMPOSE_PROJECT="toolio-site"
NPM_PROXY_DIR="/root/npm/data/nginx/proxy_host"
SITE_DOMAIN="toolio.com.tr"

site_check_via_proxy() {
  curl --noproxy "*" -sk -m 8 --resolve "$SITE_DOMAIN:443:127.0.0.1" "https://$SITE_DOMAIN/surum.txt" 2>/dev/null \
    | head -c 100 | grep -qE '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
}

restore_old_container() {
  info "Eski konteyner geri getiriliyor..."
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
  if docker inspect "$OLD_CONTAINER" >/dev/null 2>&1; then
    docker rename "$OLD_CONTAINER" "$CONTAINER"
    docker update --restart=always "$CONTAINER" >/dev/null 2>&1 || true
    docker start "$CONTAINER" >/dev/null
    info "Eski konteyner tekrar calisiyor; site eski haline dondu."
  fi
}

do_setup() {
  local OLD_ROOT="$WEB_ROOT"
  local NEW_ROOT="${ARCHIVE%/}"
  case "$NEW_ROOT" in /*) ;; *) fail "Yeni site klasoru mutlak yol olmali: $NEW_ROOT" ;; esac
  local SITE_BASE NEW_NAME DC
  SITE_BASE="$(dirname "$NEW_ROOT")"
  NEW_NAME="$(basename "$NEW_ROOT")"

  [ "$(id -u)" -eq 0 ] || fail "Sunucu kurulumu root kullanicisiyla yapilmali."
  command -v docker >/dev/null 2>&1 || fail "docker bulunamadi."
  if docker compose version >/dev/null 2>&1; then DC="docker compose"
  elif command -v docker-compose >/dev/null 2>&1; then DC="docker-compose"
  else fail "docker compose bulunamadi."; fi

  info "1/6 Kontroller yapiliyor (henuz hicbir sey degismedi)..."
  docker network inspect "$DOCKER_NET" >/dev/null 2>&1 || fail "'$DOCKER_NET' Docker agi bulunamadi."
  local NPM_CONF="" FWD_HOST="" FWD_PORT=""
  if [ -d "$NPM_PROXY_DIR" ]; then
    NPM_CONF="$(grep -lE "server_name[^;]*[[:space:]](www\.)?toolio\.com\.tr([[:space:]]|;)" "$NPM_PROXY_DIR"/*.conf 2>/dev/null | head -n 1 || true)"
  fi
  [ -n "$NPM_CONF" ] || fail "Nginx Proxy Manager'da $SITE_DOMAIN ayari bulunamadi ($NPM_PROXY_DIR). Hicbir sey degistirilmedi."
  FWD_HOST="$(sed -nE 's/^[[:space:]]*set[[:space:]]+\$server[[:space:]]+"?([^";[:space:]]+)"?;.*/\1/p' "$NPM_CONF" | head -n 1)"
  FWD_PORT="$(sed -nE 's/^[[:space:]]*set[[:space:]]+\$port[[:space:]]+([0-9]+);.*/\1/p' "$NPM_CONF" | head -n 1)"
  info "    Proxy Manager: $SITE_DOMAIN -> ${FWD_HOST:-?}:${FWD_PORT:-?}  ($(basename "$NPM_CONF"))"
  if [ "$FWD_HOST" != "$CONTAINER" ] || [ "${FWD_PORT:-80}" != "80" ]; then
    fail "Proxy Manager $SITE_DOMAIN adresini '$FWD_HOST:$FWD_PORT' hedefine yonlendiriyor, '$CONTAINER:80' bekleniyordu.
           Proxy Manager panelinde (http://SUNUCU_IP:81) $SITE_DOMAIN kaydini acip
           Forward Hostname = $CONTAINER, Forward Port = 80 yapin ve bu komutu tekrar calistirin.
           Hicbir sey degistirilmedi."
  fi

  local SRC=""
  if [ -f "$NEW_ROOT/index.html" ]; then SRC="$NEW_ROOT"
  elif [ -f "$OLD_ROOT/index.html" ]; then SRC="$OLD_ROOT"
  else fail "Site dosyalari bulunamadi ($OLD_ROOT veya $NEW_ROOT). Once deploy.bat ile yayin yapin."; fi
  grep -qE '<div id="root"><[^/]' "$SRC/index.html" \
    || fail "$SRC/index.html yeni surum degil. Once deploy.bat ile yayin yapin. Hicbir sey degistirilmedi."
  info "    Site dosyalari: $SRC ($(head -n 1 "$SRC/surum.txt" 2>/dev/null || echo 'surum bilgisi yok'))"

  info "2/6 Site klasoru hazirlaniyor: $NEW_ROOT"
  mkdir -p "$SITE_BASE"
  if [ "$SRC" = "$OLD_ROOT" ] && [ "$OLD_ROOT" != "$NEW_ROOT" ]; then
    [ ! -e "$NEW_ROOT" ] || fail "$NEW_ROOT zaten var; uzerine yazilmadi."
    mv "$OLD_ROOT" "$NEW_ROOT"
    if [ -d "${OLD_ROOT}_yedekler" ] && [ ! -e "$SITE_BASE/${NEW_NAME}_yedekler" ]; then
      mv "${OLD_ROOT}_yedekler" "$SITE_BASE/${NEW_NAME}_yedekler"
    fi
    if [ -d "${OLD_ROOT}_geri_alinan" ] && [ ! -e "$SITE_BASE/${NEW_NAME}_geri_alinan" ]; then
      mv "${OLD_ROOT}_geri_alinan" "$SITE_BASE/${NEW_NAME}_geri_alinan"
    fi
    info "    $OLD_ROOT -> $NEW_ROOT tasindi."
  fi
  chmod 755 "$SITE_BASE"
  chmod -R u+rwX,go+rX,go-w "$NEW_ROOT"

  info "3/6 Konteyner ayarlari yaziliyor: $APP_DIR"
  mkdir -p "$APP_DIR"
  cat > "$APP_DIR/nginx.conf" <<NGINX
# Toolio statik site - konteyner icindeki Nginx ayari.
# deploy.bat sunucu-kur tarafindan olusturuldu. Site dosyalari: $NEW_ROOT
server {
    listen 80;
    server_name _;
    root /srv/site/$NEW_NAME;
    index index.html;
    charset utf-8;
    absolute_redirect off;
    port_in_redirect off;

    location ~ /\\. {
        deny all;
    }

    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files \$uri =404;
    }

    location ~* \\.(?:png|jpe?g|webp|gif|svg|ico)\$ {
        add_header Cache-Control "public, max-age=2592000";
        try_files \$uri =404;
    }

    location ~* ^/(ads\\.txt|robots\\.txt|sitemap\\.xml|surum\\.txt)\$ {
        add_header Cache-Control "no-cache";
        try_files \$uri =404;
    }

    location / {
        add_header Cache-Control "no-cache";
        try_files \$uri \$uri/ =404;
    }

    error_page 404 /404.html;
    location = /404.html {
        add_header Cache-Control "no-cache";
        internal;
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml application/javascript application/json application/xml image/svg+xml;
}
NGINX
  cat > "$APP_DIR/docker-compose.yml" <<YAML
# Toolio statik site konteyneri - deploy.bat sunucu-kur tarafindan olusturuldu.
# deploy.bat yeni surumu $NEW_ROOT klasorune yayinlar; bu konteyner oradan sunar.
# Yeniden baslatmak icin:  cd $APP_DIR && $DC -p $COMPOSE_PROJECT up -d
services:
  web:
    image: nginx:alpine
    container_name: $CONTAINER
    restart: always
    volumes:
      - $SITE_BASE:/srv/site:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    networks:
      - $DOCKER_NET

networks:
  $DOCKER_NET:
    external: true
YAML

  info "4/6 Eski konteyner durduruluyor (silinmiyor)..."
  local CURRENT_PROJECT=""
  CURRENT_PROJECT="$(docker inspect -f '{{index .Config.Labels "com.docker.compose.project"}}' "$CONTAINER" 2>/dev/null || true)"
  if docker inspect "$CONTAINER" >/dev/null 2>&1 && [ "$CURRENT_PROJECT" != "$COMPOSE_PROJECT" ]; then
    docker inspect "$CONTAINER" > "$APP_DIR/eski-konteyner-$TS.json" 2>/dev/null || true
    if docker inspect "$OLD_CONTAINER" >/dev/null 2>&1; then
      docker rm -f "$OLD_CONTAINER" >/dev/null
    fi
    docker update --restart=no "$CONTAINER" >/dev/null
    docker rename "$CONTAINER" "$OLD_CONTAINER"
    docker stop "$OLD_CONTAINER" >/dev/null
    info "    Eski konteyner '$OLD_CONTAINER' adiyla durduruldu."
  else
    info "    Konteyner zaten yeni yapida; ayarlar yenilenecek."
  fi

  info "5/6 Yeni konteyner baslatiliyor..."
  if ! (cd "$APP_DIR" && $DC -p "$COMPOSE_PROJECT" up -d --force-recreate); then
    restore_old_container
    fail "Yeni konteyner baslatilamadi."
  fi

  info "6/6 Site kontrol ediliyor..."
  local i ok=0
  for i in 1 2 3 4 5; do
    sleep 2
    if docker exec "$CONTAINER" wget -qO- http://127.0.0.1/surum.txt 2>/dev/null | grep -qE '^[0-9]{4}-'; then ok=1; break; fi
  done
  if [ "$ok" -ne 1 ]; then
    docker logs --tail 20 "$CONTAINER" 2>&1 | sed 's/^/      /' || true
    restore_old_container
    fail "Yeni konteyner site dosyalarini sunamadi."
  fi
  ok=0
  for i in $(seq 1 15); do
    if site_check_via_proxy; then ok=1; break; fi
    sleep 2
  done
  if [ "$ok" -ne 1 ]; then
    info "    Proxy Manager henuz yeni konteyneri gormedi; Proxy Manager ayarlari yeniden yukleniyor..."
    docker exec npm-app-1 nginx -s reload >/dev/null 2>&1 || true
    for i in $(seq 1 10); do
      if site_check_via_proxy; then ok=1; break; fi
      sleep 2
    done
  fi
  if [ "$ok" -ne 1 ]; then
    restore_old_container
    fail "https://$SITE_DOMAIN yeni konteynere ulasamadi. Degisiklikler geri alindi."
  fi

  info "TAMAM: https://$SITE_DOMAIN artik $NEW_ROOT klasorunden sunuluyor."
  info "Eski konteyner '$OLD_CONTAINER' durdurulmus halde duruyor; birkac gun sorun yoksa silebilirsiniz:"
  info "    docker rm $OLD_CONTAINER"
}

case "$ACTION" in
  deploy) do_deploy ;;
  rollback) do_rollback ;;
  status) do_status ;;
  diagnose) do_diagnose ;;
  setup) do_setup ;;
  *) fail "Gecersiz islem: '$ACTION' (deploy | rollback | status | diagnose | setup)" ;;
esac
