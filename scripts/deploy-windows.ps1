<#
.SYNOPSIS
  Bygger Vite-appen och publicerar till Linux: Node serverar både dist/ och /api/contact.

.EXAMPLE
  .\scripts\deploy-windows.ps1
#>

[CmdletBinding()]
param(
  [string]$TargetHost,
  [string]$User,
  [string]$RemotePath,
  [string]$IdentityFile,
  [int]$Port = 22,
  [switch]$SkipBuild,
  [switch]$SkipInstall,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Escape-BashSingle([string]$Value) {
  return "'" + ($Value -replace "'", "'\''") + "'"
}

function Assert-Command([string]$Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    Write-Error "Kommandot '$Name' saknas. Installera OpenSSH Client respektive Node.js/npm."
  }
}

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $RepoRoot

$configPath = Join-Path $PSScriptRoot "deploy.config.ps1"
if (Test-Path $configPath) {
  . $configPath
  if (-not $TargetHost -and $DeployHost) { $TargetHost = $DeployHost }
  if (-not $User -and $DeployUser) { $User = $DeployUser }
  if (-not $RemotePath -and $DeployRemotePath) { $RemotePath = $DeployRemotePath }
  if (-not $IdentityFile -and $DeployIdentityFile) { $IdentityFile = $DeployIdentityFile }
  if (-not $PSBoundParameters.ContainsKey("Port") -and $DeployPort) { $Port = [int]$DeployPort }
}

if (-not $RemotePath) {
  $RemotePath = "/opt/reklamartiklar"
}

if (-not $TargetHost -or -not $User) {
  Write-Error @"
Saknar mål. Skapa scripts/deploy.config.ps1 från deploy.config.example.ps1
eller ange -TargetHost och -User (valfritt -RemotePath, default /opt/reklamartiklar).
"@
}

Assert-Command "ssh"
Assert-Command "scp"
Assert-Command "npm"

$sshArgs = @("-p", "$Port", "-o", "StrictHostKeyChecking=accept-new")
$scpArgs = @("-P", "$Port", "-o", "StrictHostKeyChecking=accept-new")
if ($IdentityFile) {
  if (-not (Test-Path $IdentityFile)) {
    Write-Error "SSH-nyckel hittades inte: $IdentityFile"
  }
  $sshArgs += @("-i", $IdentityFile)
  $scpArgs += @("-i", $IdentityFile)
}

$remote = "${User}@${TargetHost}"
$remotePathQuoted = Escape-BashSingle $RemotePath
$distRemoteQuoted = Escape-BashSingle "$RemotePath/dist"

Write-Host "Mål: $remote:$RemotePath (port $Port)" -ForegroundColor Cyan

if (-not $SkipInstall) {
  Write-Host "→ npm ci/install (frontend)" -ForegroundColor Cyan
  if (-not $DryRun) {
    if (Test-Path (Join-Path $RepoRoot "package-lock.json")) {
      npm ci
      if ($LASTEXITCODE -ne 0) { throw "npm ci misslyckades ($LASTEXITCODE)" }
    } else {
      npm install
      if ($LASTEXITCODE -ne 0) { throw "npm install misslyckades ($LASTEXITCODE)" }
    }
  }
}

if (-not $SkipBuild) {
  Write-Host "→ npm run build" -ForegroundColor Cyan
  if (-not $DryRun) {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build misslyckades ($LASTEXITCODE)" }
  }
}

$dist = Join-Path $RepoRoot "dist"
$serverDir = Join-Path $RepoRoot "server"
if (-not $DryRun -and -not (Test-Path $dist)) {
  Write-Error "mappen dist/ saknas efter build."
}

Write-Host "→ Förbereder remotemappar" -ForegroundColor Cyan
if (-not $DryRun) {
  & ssh @sshArgs $remote "mkdir -p $remotePathQuoted $distRemoteQuoted && find $distRemoteQuoted -mindepth 1 -maxdepth 1 -exec rm -rf {} +"
  if ($LASTEXITCODE -ne 0) { throw "SSH (förberedelse) misslyckades ($LASTEXITCODE)" }
}

Write-Host "→ Kopierar dist/ och serverfiler" -ForegroundColor Cyan
if (-not $DryRun) {
  $distItems = Join-Path $dist "*"
  & scp @scpArgs -r $distItems "${remote}:$RemotePath/dist/"
  if ($LASTEXITCODE -ne 0) { throw "SCP (dist) misslyckades ($LASTEXITCODE)" }

  & scp @scpArgs (Join-Path $serverDir "server.mjs") "${remote}:$RemotePath/"
  if ($LASTEXITCODE -ne 0) { throw "SCP (server.mjs) misslyckades ($LASTEXITCODE)" }
  & scp @scpArgs (Join-Path $serverDir "package.json") "${remote}:$RemotePath/"
  if ($LASTEXITCODE -ne 0) { throw "SCP (package.json) misslyckades ($LASTEXITCODE)" }

  & ssh @sshArgs $remote "cd $remotePathQuoted && npm install --omit=dev && test -d node_modules/nodemailer"
  if ($LASTEXITCODE -ne 0) { throw "npm install (server) misslyckades ($LASTEXITCODE)" }

  & ssh @sshArgs $remote "sudo systemctl reset-failed reklamartiklar; sudo systemctl restart reklamartiklar"
}

Write-Host "Klart. Appen ligger på $remote:$RemotePath" -ForegroundColor Green
Write-Host "Peka Cloudflare Tunnel på http://127.0.0.1:3010" -ForegroundColor DarkGray
