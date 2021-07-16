#!/bin/bash

prgm="Screenshot (maim)"

icon="/usr/share/icons/Vimix-Doder/symbolic/devices/camera-photo-symbolic.svg"

output="$HOME/Pictures/screenshots"

ls "$output" > /dev/null

if [[ $? != 0 ]]; then
    mkdir -p "$output"
fi

filename="$output/$(date +"%Y-%m-%d_%H.%M.%S").png"

command="maim -f png -u -m 10"

if [[ $1 == "area" ]]; then
    $command -s -b 3 -p 0 -D "$filename"
elif [[ $1 == "window" ]]; then
    $command -i $(xdotool getactivewindow) "$filename"
else
    $command "$filename"
fi

xclip -in -sel c -target image/png $filename

ls "$filename" > /dev/null

if [[ $? == 0 ]]; then
    dunstify -i "$icon" -h string:x-dunst-stack-tag:scrnsht -a "$prgm" "Screenshot saved at $filename"
fi
