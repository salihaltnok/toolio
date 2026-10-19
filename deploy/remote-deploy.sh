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
  $SUDO chmod -R a+rX "$NEW"
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

case "$ACTION" in
  deploy) do_deploy ;;
  rollback) do_rollback ;;
  status) do_status ;;
  *) fail "Gecersiz islem: '$ACTION' (deploy | rollback | status)" ;;
esac
