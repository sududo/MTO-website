#!/bin/bash
SCRIPT_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")")
cd $SCRIPT_DIR
python3 ./server/app.py
