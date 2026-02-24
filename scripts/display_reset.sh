#!/usr/bin/env bash
# display_reset.sh
# Purpose: Backup and reset macOS WindowServer/display preference files to mitigate
#          persistent partial-screen rendering artifacts (e.g., black bars) and force
#          compositor regeneration.
#
# Actions performed:
#  1. Detect macOS & Apple Silicon vs Intel (for informational output only).
#  2. Create timestamped backup folders for user & system WindowServer prefs.
#  3. Remove (not overwrite) preference plist files that can safely regenerate.
#  4. Optionally disable True Tone & auto brightness (prompt) via defaults (limited scope).
#  5. Restart WindowServer (logs you out) OR offer Safe Mode guidance instead.
#
# SAFE: plist deletions only; OS recreates them. Backups kept under ~/Desktop/DisplayResetBackup.
# DISCLAIMER: Run at your own risk. Does NOT fix physical hardware issues.

set -euo pipefail
IFS=$'\n\t'

BACKUP_ROOT="$HOME/Desktop/DisplayResetBackup"
TIMESTAMP="$(date +%Y-%m-%d_%H-%M-%S)"
USER_BACKUP_DIR="$BACKUP_ROOT/user_$TIMESTAMP"
SYSTEM_BACKUP_DIR="$BACKUP_ROOT/system_$TIMESTAMP"
LOG_FILE="$BACKUP_ROOT/reset_$TIMESTAMP.log"

mkdir -p "$USER_BACKUP_DIR" "$SYSTEM_BACKUP_DIR"
mkdir -p "$BACKUP_ROOT"

log() { echo "[$(date +%H:%M:%S)] $*" | tee -a "$LOG_FILE"; }

log "Starting display/compositor preference reset"

# 1. System info
ARCH_INFO="$(uname -m)"
MACOS_VER="$(sw_vers -productVersion 2>/dev/null || echo unknown)"
log "macOS version: $MACOS_VER"
log "Architecture: $ARCH_INFO"

# 2. Backup user WindowServer prefs
USER_PREFS=("$HOME/Library/Preferences/ByHost/com.apple.windowserver."*".plist")
USER_MATCHED=false
for f in "${USER_PREFS[@]}"; do
  if [[ -f "$f" ]]; then
    cp "$f" "$USER_BACKUP_DIR"/
    log "Backed up user pref: $f"
    USER_MATCHED=true
  fi
done
if ! $USER_MATCHED; then
  log "No user ByHost windowserver plists found to back up."
fi

# 3. Backup system WindowServer pref (requires sudo)
SYS_PREF="/Library/Preferences/com.apple.windowserver.plist"
if [[ -f "$SYS_PREF" ]]; then
  if sudo -n true 2>/dev/null; then
    sudo cp "$SYS_PREF" "$SYSTEM_BACKUP_DIR"/ && log "Backed up system pref: $SYS_PREF"
  else
    log "Skipping system pref backup (no sudo without password). You can rerun with sudo if desired."
  fi
fi

# 4. Delete prefs (regenerate on restart)
DELETE_COUNT=0
for f in "${USER_PREFS[@]}"; do
  if [[ -f "$f" ]]; then
    rm -f "$f" && log "Deleted user pref: $f" && ((DELETE_COUNT++))
  fi
done
if [[ -f "$SYS_PREF" ]]; then
  if sudo -n true 2>/dev/null; then
    sudo rm -f "$SYS_PREF" && log "Deleted system pref: $SYS_PREF" && ((DELETE_COUNT++))
  else
    log "System pref not deleted (sudo required). Run: sudo rm -f $SYS_PREF"
  fi
fi
log "Total prefs deleted: $DELETE_COUNT"

# 5. Optional toggles (informational – direct disabling True Tone globally isn't exposed via simple defaults)
log "NOTE: To manually test visual changes, disable True Tone & auto brightness in System Settings > Displays."

# 6. Prompt restart of WindowServer
cat <<'EON' | tee -a "$LOG_FILE"

Next steps:
  A) Immediate compositor restart (you will be logged out):
     pkill -HUP WindowServer
  B) Safe Mode test (Apple Silicon):
     - Shut down completely.
     - Hold power until 'Loading startup options'.
     - Select disk, hold Shift, click 'Continue in Safe Mode'.
  C) External display test: connect a monitor; if only the built-in panel shows artifact, probable hardware.
  D) If artifact absent in screenshots but visible physically → likely hardware panel/backlight.

To proceed now with logout restart automatically, type YES and press Enter.
EON

read -r -p "Type YES to restart WindowServer now (logout), anything else to skip: " ANSW
if [[ "$ANSWER" == "YES" ]]; then
  log "Restarting WindowServer..."
  sleep 1
  pkill -HUP WindowServer || log "Failed to signal WindowServer. Please log out manually."
else
  log "Skipped automatic restart. Run manually later: pkill -HUP WindowServer"
fi

log "Done. Backups located at: $BACKUP_ROOT"
