#!/usr/bin/env bash

dir="$HOME/.config/rofi/hud"

uptime=$(uptime -p | sed -e 's/up //g')

rofi_command="rofi -theme $dir/hud.rasi"


echo -e "asdf\tnasdf\nasdf" | $rofi_command -p "Uptime: $uptime" -dmenu
