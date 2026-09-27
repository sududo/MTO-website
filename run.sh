#!/bin/bash
SCRIPT_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")")
cd $SCRIPT_DIR

if [[ -z "$VIRTUAL_ENV" ]]; then
    source "./aenv"
fi   

export FLASK_RUN_PORT=26676

python3 ./server/app.py
