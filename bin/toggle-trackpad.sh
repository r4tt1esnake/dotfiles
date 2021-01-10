#!/bin/sh
# Toggle touchpad status
# Using libinput and xinput

prgmNm="Touchpad Control"

id=$(echo $(echo $(xinput list | grep "SynPS/2 Synaptics TouchPad") | cut -d ' ' -f6) | cut -d '=' -f2)

if [[ "$(xinput list-props $id | grep -P ".*Device Enabled.*\K.(?=$)" -o)" == "1" ]]; then
    xinput disable $id
    notify-send -c "sys-alert" -i "/usr/share/icons/Vimix-Doder/symbolic/status/touchpad-disabled-symbolic.svg" "$prgmNm" "disabled" 
else
    xinput enable $id
    notify-send -c "sys-alert" -i "/usr/share/icons/Vimix-Doder/symbolic/status/touchpad-enabled-symbolic.svg" "$prgmNm" "enabled"
fi