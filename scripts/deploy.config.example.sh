# Kopiera till deploy.config.sh och fyll i dina värden.
# deploy.config.sh är gitignorerad — committa den inte.

DEPLOY_HOST="din-linux-server.exempel.se"
DEPLOY_USER="deploy"
DEPLOY_REMOTE_PATH="/opt/reklamartiklar"
DEPLOY_PORT=22

# Valfritt: sökväg till privat SSH-nyckel
# DEPLOY_IDENTITY_FILE="$HOME/.ssh/id_ed25519"
