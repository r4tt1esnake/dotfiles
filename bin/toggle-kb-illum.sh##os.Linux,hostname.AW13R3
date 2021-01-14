file=("$HOME"/stor/KB_ILLUM_STATE)
KB_ILLUM_STATE=$(cat "$file")
icon="/usr/share/icons/Vimix-Doder/symbolic/status/keyboard-brightness-symbolic.svg"

if [[ ($KB_ILLUM_STATE == "TRUE" && $1 != "on") || $1 == "off" ]]; then
    truncate -s 0 "$file"
    echo FALSE > "$file"
    alienfx -t lights-off
    notify-send -c "sys-alert" -i "$icon" "Keyboard Control" "off"
else
    truncate -s 0 "$file"
    echo TRUE > "$file"
    alienfx -t base16-ocean
    notify-send -c "sys-alert" -i "$icon" "Keyboard Control" "on"
fi