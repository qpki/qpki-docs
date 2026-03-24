# QPKI installer for Windows — https://qpki.io
# Usage: irm https://qpki.io/install.ps1 | iex
$ErrorActionPreference = "Stop"

$Repo = "qpki/qpki"
$Binary = "qpki"
$InstallDir = if ($env:QPKI_INSTALL_DIR) { $env:QPKI_INSTALL_DIR } else { Join-Path $env:LOCALAPPDATA "qpki" }

# ── Detect Architecture ──────────────────────────
$Arch = if ([Environment]::Is64BitOperatingSystem) { "amd64" } else { "386" }

Write-Host ""
Write-Host "QPKI Installer" -ForegroundColor White
Write-Host "Post-quantum PKI toolkit — https://qpki.io" -ForegroundColor Gray
Write-Host ""
Write-Host "  Platform: windows/$Arch" -ForegroundColor Cyan

# ── Get latest version ───────────────────────────
Write-Host "  Fetching latest version..." -ForegroundColor Cyan
try {
    $Release = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases/latest" -UseBasicParsing
    $VersionTag = $Release.tag_name
} catch {
    Write-Host "  Could not determine latest version. Check https://github.com/$Repo/releases" -ForegroundColor Red
    exit 1
}

if (-not $VersionTag) {
    Write-Host "  Could not determine latest version." -ForegroundColor Red
    exit 1
}

$VersionNum = $VersionTag -replace "^v", ""
Write-Host "  Latest version: $VersionTag" -ForegroundColor Cyan

# ── Download ─────────────────────────────────────
$FileName = "${Binary}_${VersionNum}_windows_${Arch}.zip"
$Url = "https://github.com/$Repo/releases/download/$VersionTag/$FileName"

$TempDir = Join-Path $env:TEMP "qpki-install-$(Get-Random)"
New-Item -ItemType Directory -Path $TempDir | Out-Null

try {
    Write-Host "  Downloading $FileName..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $Url -OutFile (Join-Path $TempDir $FileName) -UseBasicParsing

    # ── Verify checksum ──────────────────────────
    $ChecksumsUrl = "https://github.com/$Repo/releases/download/$VersionTag/checksums.txt"
    try {
        $Checksums = Invoke-WebRequest -Uri $ChecksumsUrl -UseBasicParsing
        $Expected = ($Checksums.Content -split "`n" | Where-Object { $_ -match $FileName } | ForEach-Object { ($_ -split "\s+")[0] })
        if ($Expected) {
            $Actual = (Get-FileHash -Path (Join-Path $TempDir $FileName) -Algorithm SHA256).Hash.ToLower()
            if ($Actual -eq $Expected.ToLower()) {
                Write-Host "  Checksum verified (SHA-256)" -ForegroundColor Green
            } else {
                Write-Host "  Checksum mismatch!" -ForegroundColor Red
                Write-Host "    Expected: $Expected" -ForegroundColor Red
                Write-Host "    Got:      $Actual" -ForegroundColor Red
                exit 1
            }
        }
    } catch {
        # No checksums file available, skip verification
    }

    # ── Extract ──────────────────────────────────
    Expand-Archive -Path (Join-Path $TempDir $FileName) -DestinationPath $TempDir -Force

    # ── Install ──────────────────────────────────
    if (-not (Test-Path $InstallDir)) {
        New-Item -ItemType Directory -Path $InstallDir | Out-Null
    }

    $ExtractedBinary = Get-ChildItem -Path $TempDir -Filter "$Binary.exe" -Recurse | Select-Object -First 1
    if (-not $ExtractedBinary) {
        Write-Host "  Binary not found in archive" -ForegroundColor Red
        exit 1
    }

    Move-Item -Path $ExtractedBinary.FullName -Destination (Join-Path $InstallDir "$Binary.exe") -Force

    # ── Add to PATH ──────────────────────────────
    $UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($UserPath -notlike "*$InstallDir*") {
        [Environment]::SetEnvironmentVariable("Path", "$UserPath;$InstallDir", "User")
        Write-Host "  Added $InstallDir to user PATH" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "  Installed $Binary $VersionTag to $InstallDir\$Binary.exe" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Restart your terminal, then run: qpki --version" -ForegroundColor Cyan
    Write-Host "  Get started: https://qpki.io/qpki/getting-started/quick-start/" -ForegroundColor Cyan
    Write-Host ""

} catch {
    Write-Host "  Download failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Check that $Url exists." -ForegroundColor Red
    exit 1
} finally {
    if (Test-Path $TempDir) {
        Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
