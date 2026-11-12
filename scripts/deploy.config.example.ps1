# Kopiera till deploy.config.ps1 och fyll i dina värden.
# deploy.config.ps1 är gitignorerad — committa den inte.

$DeployHost = "din-linux-server.exempel.se"
$DeployUser = "deploy"
$DeployRemotePath = "/opt/reklamartiklar"
$DeployPort = 22

# Valfritt: sökväg till privat SSH-nyckel
# $DeployIdentityFile = "$env:USERPROFILE\.ssh\id_ed25519"
