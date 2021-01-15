#!/usr/bin/env bash

# Add this script to your wm startup file.

DIR="$HOME/.config/polybar/"

# Terminate already running bar instances
killall -q polybar

# Wait until the processes have been shut down
while pgrep -u $UID -x polybar >/dev/null; do sleep 1; done

# Launch the bar

if type "polybar"; then
    mNum=$(polybar -m | grep -e':' -c)
    if [[ $mNum -gt 1 ]]; then
        polybar -m | while read -r l; do
            resX=$(echo "$l" | cut -d":" -f2 | cut -d"x" -f1)
            m=$(echo "$l" | cut -d":" -f1)
            if [[ "$resX" -lt 1000 ]]; then
                MONITOR=$m polybar --reload -q ext-mini -c "$DIR"/config.ini &
            else 
                MONITOR=$m polybar --reload -q ext -c "$DIR"/config.ini &
            fi
        done
    else
        polybar --reload -q main -c "$DIR"/config.ini &
    fi
fi
