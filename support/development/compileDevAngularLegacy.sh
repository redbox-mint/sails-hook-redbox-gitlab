#! /bin/bash
set -e
SCRIPT_DIR="$(dirname "$0")"
"$SCRIPT_DIR/../build/compileAngularLegacy.sh" "$1" "dev"
