#!/bin/sh
# QPKI installer — https://qpki.io
# Usage: curl -sSL https://qpki.io/install.sh | sh
set -eu

REPO="qpki/qpki"
INSTALL_DIR="${QPKI_INSTALL_DIR:-/usr/local/bin}"
BINARY="qpki"

# ── Colors ──────────────────────────────────────────
if [ -t 1 ]; then
  BOLD='\033[1m'
  GREEN='\033[0;32m'
  CYAN='\033[0;36m'
  RED='\033[0;31m'
  RESET='\033[0m'
else
  BOLD='' GREEN='' CYAN='' RED='' RESET=''
fi

info()  { printf "${CYAN}▸${RESET} %s\n" "$1"; }
ok()    { printf "${GREEN}✓${RESET} %s\n" "$1"; }
err()   { printf "${RED}✗ %s${RESET}\n" "$1" >&2; exit 1; }

# ── Detect OS ───────────────────────────────────────
detect_os() {
  case "$(uname -s)" in
    Linux*)  echo "linux" ;;
    Darwin*) echo "darwin" ;;
    *)       err "Unsupported OS: $(uname -s). QPKI supports Linux and macOS." ;;
  esac
}

# ── Detect Architecture ────────────────────────────
detect_arch() {
  case "$(uname -m)" in
    x86_64|amd64)  echo "amd64" ;;
    aarch64|arm64) echo "arm64" ;;
    *)             err "Unsupported architecture: $(uname -m)" ;;
  esac
}

# ── HTTP fetch (curl or wget) ──────────────────────
fetch() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$1"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO- "$1"
  else
    err "Neither curl nor wget found. Install one of them and retry."
  fi
}

fetch_to_file() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL -o "$2" "$1"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$2" "$1"
  fi
}

# ── Get latest version ─────────────────────────────
get_latest_version() {
  fetch "https://api.github.com/repos/${REPO}/releases/latest" \
    | grep '"tag_name"' \
    | sed 's/.*"tag_name": *"//;s/".*//'
}

# ── Main ────────────────────────────────────────────
main() {
  printf "\n${BOLD}QPKI Installer${RESET}\n"
  printf "Post-quantum PKI toolkit — https://qpki.io\n\n"

  OS=$(detect_os)
  ARCH=$(detect_arch)
  info "Detected platform: ${OS}/${ARCH}"

  info "Fetching latest version..."
  VERSION=$(get_latest_version)
  [ -z "$VERSION" ] && err "Could not determine latest version. Check https://github.com/${REPO}/releases"
  info "Latest version: ${VERSION}"

  # Strip leading 'v' for filename
  VERSION_NUM=$(echo "$VERSION" | sed 's/^v//')
  FILENAME="${BINARY}_${VERSION_NUM}_${OS}_${ARCH}.tar.gz"
  URL="https://github.com/${REPO}/releases/download/${VERSION}/${FILENAME}"

  # Download
  TMPDIR=$(mktemp -d)
  trap 'rm -rf "$TMPDIR"' EXIT
  info "Downloading ${FILENAME}..."
  fetch_to_file "$URL" "${TMPDIR}/${FILENAME}" || err "Download failed. Check that ${URL} exists."

  # Verify checksum (if available)
  CHECKSUMS_URL="https://github.com/${REPO}/releases/download/${VERSION}/checksums.txt"
  if fetch "$CHECKSUMS_URL" > "${TMPDIR}/checksums.txt" 2>/dev/null; then
    EXPECTED=$(grep "$FILENAME" "${TMPDIR}/checksums.txt" | awk '{print $1}')
    if [ -n "$EXPECTED" ]; then
      if command -v sha256sum >/dev/null 2>&1; then
        ACTUAL=$(sha256sum "${TMPDIR}/${FILENAME}" | awk '{print $1}')
      elif command -v shasum >/dev/null 2>&1; then
        ACTUAL=$(shasum -a 256 "${TMPDIR}/${FILENAME}" | awk '{print $1}')
      else
        ACTUAL=""
      fi
      if [ -n "$ACTUAL" ]; then
        if [ "$ACTUAL" = "$EXPECTED" ]; then
          ok "Checksum verified (SHA-256)"
        else
          err "Checksum mismatch!\n  Expected: ${EXPECTED}\n  Got:      ${ACTUAL}"
        fi
      fi
    fi
  fi

  # Extract
  tar -xzf "${TMPDIR}/${FILENAME}" -C "${TMPDIR}"

  # Install
  if [ -w "$INSTALL_DIR" ]; then
    mv "${TMPDIR}/${BINARY}" "${INSTALL_DIR}/${BINARY}"
  else
    info "Installing to ${INSTALL_DIR} (requires sudo)..."
    sudo mv "${TMPDIR}/${BINARY}" "${INSTALL_DIR}/${BINARY}"
  fi
  chmod +x "${INSTALL_DIR}/${BINARY}"

  ok "Installed ${BINARY} ${VERSION} to ${INSTALL_DIR}/${BINARY}"
  printf "\n  Run ${CYAN}qpki --version${RESET} to verify.\n"
  printf "  Get started: ${CYAN}https://qpki.io/qpki/getting-started/quick-start/${RESET}\n\n"
}

main
