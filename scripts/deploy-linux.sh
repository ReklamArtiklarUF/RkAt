#!/usr/bin/env bash
# Bygger Vite-appen och publicerar till en Linux-maskin via SSH/SCP.
# Node på målet serverar både dist/ och POST /api/contact.
#
# Exempel:
#   ./scripts/deploy-linux.sh
#   ./scripts/deploy-linux.sh --host server.exempel.se --user deploy
#   ./scripts/deploy-linux.sh --skip-install --dry-run

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

TARGET_HOST="${DEPLOY_HOST:-}"
USER_NAME="${DEPLOY_USER:-}"
REMOTE_PATH="${DEPLOY_REMOTE_PATH:-/opt/reklamartiklar}"
IDENTITY_FILE="${DEPLOY_IDENTITY_FILE:-}"
SSH_PORT="${DEPLOY_PORT:-22}"
SKIP_BUILD=0
SKIP_INSTALL=0
DRY_RUN=0

if [[ -f "$SCRIPT_DIR/deploy.config.sh" ]]; then
  # shellcheck source=/dev/null
  source "$SCRIPT_DIR/deploy.config.sh"
  TARGET_HOST="${TARGET_HOST:-${DEPLOY_HOST:-}}"
  USER_NAME="${USER_NAME:-${DEPLOY_USER:-}}"
  REMOTE_PATH="${REMOTE_PATH:-${DEPLOY_REMOTE_PATH:-/opt/reklamartiklar}}"
  IDENTITY_FILE="${IDENTITY_FILE:-${DEPLOY_IDENTITY_FILE:-}}"
  SSH_PORT="${SSH_PORT:-${DEPLOY_PORT:-22}}"
fi

usage() {
  cat <<'EOF'
Användning: ./scripts/deploy-linux.sh [flaggor]

Flaggor:
  --host HOST           Målserver
  --user USER           SSH-användare
  --path PATH           Remotesökväg (default: /opt/reklamartiklar)
  --identity FILE       Privat SSH-nyckel
  --port PORT           SSH-port (default: 22)
  --skip-build          Hoppa över npm run build
  --skip-install        Hoppa över npm ci/install lokalt
  --dry-run             Visa kommandon utan att köra dem
  -h, --help            Visa denna hjälp

Config: kopiera scripts/deploy.config.example.sh → scripts/deploy.config.sh
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host) TARGET_HOST="$2"; shift 2 ;;
    --user) USER_NAME="$2"; shift 2 ;;
    --path) REMOTE_PATH="$2"; shift 2 ;;
    --identity) IDENTITY_FILE="$2"; shift 2 ;;
    --port) SSH_PORT="$2"; shift 2 ;;
    --skip-build) SKIP_BUILD=1; shift ;;
    --skip-install) SKIP_INSTALL=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Okänd flagga: $1" >&2; usage >&2; exit 1 ;;
  esac
done

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Kommandot '$1' saknas." >&2
    exit 1
  }
}

run() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    printf '[dry-run]'
    printf ' %q' "$@"
    printf '\n'
  else
    "$@"
  fi
}

if [[ -z "$TARGET_HOST" || -z "$USER_NAME" ]]; then
  echo "Saknar mål. Ange --host och --user, eller skapa scripts/deploy.config.sh." >&2
  usage >&2
  exit 1
fi

need_cmd ssh
need_cmd scp
need_cmd npm

SSH_OPTS=(-p "$SSH_PORT" -o StrictHostKeyChecking=accept-new)
SCP_OPTS=(-P "$SSH_PORT" -o StrictHostKeyChecking=accept-new)
if [[ -n "$IDENTITY_FILE" ]]; then
  if [[ ! -f "$IDENTITY_FILE" ]]; then
    echo "SSH-nyckel hittades inte: $IDENTITY_FILE" >&2
    exit 1
  fi
  SSH_OPTS+=(-i "$IDENTITY_FILE")
  SCP_OPTS+=(-i "$IDENTITY_FILE")
fi

REMOTE="${USER_NAME}@${TARGET_HOST}"
echo "Mål: ${REMOTE}:${REMOTE_PATH} (port ${SSH_PORT})"

if [[ "$SKIP_INSTALL" -eq 0 ]]; then
  echo "→ npm ci/install (frontend)"
  if [[ -f package-lock.json ]]; then
    run npm ci
  else
    run npm install
  fi
fi

if [[ "$SKIP_BUILD" -eq 0 ]]; then
  echo "→ npm run build"
  run npm run build
fi

if [[ "$DRY_RUN" -eq 0 && ! -d dist ]]; then
  echo "mappen dist/ saknas efter build." >&2
  exit 1
fi

echo "→ Förbereder remotemappar"
run ssh "${SSH_OPTS[@]}" "$REMOTE" \
  "mkdir -p $(printf '%q' "$REMOTE_PATH") $(printf '%q' "$REMOTE_PATH/dist") && find $(printf '%q' "$REMOTE_PATH/dist") -mindepth 1 -maxdepth 1 -exec rm -rf {} +"

echo "→ Kopierar dist/ och serverfiler"
# shellcheck disable=SC2086
run scp "${SCP_OPTS[@]}" -r dist/. "${REMOTE}:${REMOTE_PATH}/dist/"
run scp "${SCP_OPTS[@]}" server/server.mjs server/package.json "${REMOTE}:${REMOTE_PATH}/"
run ssh "${SSH_OPTS[@]}" "$REMOTE" \
  "cd $(printf '%q' "$REMOTE_PATH") && npm install --omit=dev && test -d node_modules/nodemailer"
run ssh "${SSH_OPTS[@]}" "$REMOTE" "sudo systemctl reset-failed reklamartiklar; sudo systemctl restart reklamartiklar"

echo "Klart. Appen ligger på ${REMOTE}:${REMOTE_PATH}"
echo "Peka Cloudflare Tunnel på http://127.0.0.1:3010"
