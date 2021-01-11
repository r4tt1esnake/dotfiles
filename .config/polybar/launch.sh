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
    if [[ mNum > 1 ]]; then
        #prime=$(polybar -m | grep "primary" | cut -d":" -f1)
        #MONITOR=$prime polybar --reload -q main -c "$DIR"/config.ini &
        for m in $(polybar -m | cut -d":" -f1); do
            #if [[ $m != $prime ]]; then
                MONITOR=$m polybar --reload -q ext -c "$DIR"/config.ini &
            #fi
        done
    else
        polybar --reload -q main -c "$DIR"/config.ini &
    fi
fi
