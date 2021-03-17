#!/usr/bin/env bash

# Add this script to your wm startup file.

getResX () {
    echo "$1" | cut -d":" -f2 | cut -d"x" -f1
}

DIR="/home/alexycn/.config/polybar/"

# Terminate already running bar instances
killall -q polybar

# Wait until the processes have been shut down
while pgrep -u $UID -x polybar >/dev/null; do sleep 1; done

# Launch the bar

if type "polybar"; then
    mNum=$(polybar -m | grep -e':' -c)
    if [[ $mNum -gt 1 ]]; then
        polybar -m | while read -r l; do
            resX=$(getResX "$l")
            m=$(echo "$l" | cut -d":" -f1)
            if [[ "$resX" -lt 1100 ]]; then
                MONITOR=$m polybar --reload -q ext-mini -c "$DIR"/config.ini &
            else 
                MONITOR=$m polybar --reload -q ext -c "$DIR"/config.ini &
            fi
        done
    else
        resX=$(getResX "$(polybar -m)")
        if [[ "$resX" -lt 1100 ]]; then
            polybar --reload -q main-mini -c "$DIR"/config.ini &
        else 
            polybar --reload -q main -c "$DIR"/config.ini &
        fi
    fi
fi
