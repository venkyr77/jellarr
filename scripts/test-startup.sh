#!/usr/bin/env bash
set -euo pipefail

TMPDIR=$(mktemp -d)
PORT=$((19000 + RANDOM % 1000))
BASE_URL="http://localhost:$PORT"
JF_LOG="$TMPDIR/jf.log"

cleanup() {
  echo "cleaning up..."
  kill "$JF_PID" 2>/dev/null || true
  rm -rf "$TMPDIR"
}
trap cleanup EXIT

echo "==> setting up jellyfin config (port $PORT)"
mkdir -p "$TMPDIR/config"
cat > "$TMPDIR/config/network.xml" <<EOF
<?xml version="1.0" encoding="utf-8"?>
<NetworkConfiguration>
  <InternalHttpPort>$PORT</InternalHttpPort>
  <InternalHttpsPort>$((PORT + 1))</InternalHttpsPort>
  <PublicHttpPort>$PORT</PublicHttpPort>
  <PublicHttpsPort>$((PORT + 1))</PublicHttpsPort>
  <EnableHttps>false</EnableHttps>
</NetworkConfiguration>
EOF

echo "==> starting jellyfin on port $PORT (data: $TMPDIR)"
nix shell nixpkgs#jellyfin --command jellyfin \
  --datadir "$TMPDIR/data" \
  --configdir "$TMPDIR/config" \
  --cachedir "$TMPDIR/cache" \
  --logdir "$TMPDIR/log" \
  --nowebclient \
  >"$JF_LOG" 2>&1 &
JF_PID=$!

echo "==> waiting for jellyfin startup complete..."
for i in $(seq 1 120); do
  if grep -q "Startup complete" "$JF_LOG" 2>/dev/null; then
    echo "==> jellyfin fully started after ${i}s"
    break
  fi
  if ! kill -0 "$JF_PID" 2>/dev/null; then
    echo "==> jellyfin process died, logs:"
    cat "$JF_LOG"
    exit 1
  fi
  sleep 1
done

if ! grep -q "Startup complete" "$JF_LOG" 2>/dev/null; then
  echo "==> timed out waiting for jellyfin"
  cat "$JF_LOG"
  exit 1
fi

STATUS=$(curl -sf "$BASE_URL/System/Info/Public")
echo "==> $(echo "$STATUS" | grep -o '"StartupWizardCompleted":[a-z]*')"

echo "==> writing test config"
cat > "$TMPDIR/config.yml" <<EOF
version: 1
base_url: "$BASE_URL"
system: {}
startup:
  serverName: "test-jellyfin"
  preferredMetadataLanguage: "en"
  metadataCountryCode: "US"
  uiCulture: "en-US"
  remoteAccess:
    enableRemoteAccess: true
    enableAutomaticPortMapping: false
  user:
    name: "admin"
    password: "testpass123"
  apiKeyApp: "jellarr"
  apiKeyFile: "$TMPDIR/api-key"
  completeStartupWizard: true
users:
  - name: "admin"
    password: "testpass123"
    policy:
      isAdministrator: true
EOF

echo "==> running jellarr"
npx tsx src/cli/index.ts apply --configFile "$TMPDIR/config.yml" || true

echo ""
echo "==> jellyfin logs around the error:"
grep -A3 "InvalidOperationException\|Startup/User\|500\|error" "$JF_LOG" | tail -20

echo ""
echo "==> results:"
echo "  wizard: $(curl -sf "$BASE_URL/System/Info/Public" | grep -o '"StartupWizardCompleted":[a-z]*')"
echo "  api key file: $(cat "$TMPDIR/api-key" 2>/dev/null || echo 'MISSING')"

API_KEY=$(cat "$TMPDIR/api-key")
USERS=$(curl -sf -H "X-Emby-Token: $API_KEY" "$BASE_URL/Users")
echo "  users: $(echo "$USERS" | head -c 200)"
echo ""
echo ""
echo "==> success!"
