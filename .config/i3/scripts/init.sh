#!/bin/bash

"$HOME"/.config/i3/scripts/rldUI.sh

xkbset bouncekeys 20

launch=( 
    "dunst" 
    "unclutter"
)

for t in ${launch[@]}; do
    killall -q $t
    while pgrep -u $UID -x $t >/dev/null; do sleep 1; done
    if type $t; then
        $t &
    fi
done
