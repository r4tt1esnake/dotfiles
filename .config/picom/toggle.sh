exists=$(pgrep -l picom)
icon="/usr/share/icons/Vimix-Doder-dark/symbolic/status/weather-fog-symbolic.svg"

if [[ $exists == "" ]]; then
    "$HOME"/.config/picom/launch.sh
    notify-send -c "sys-alert" -i "$icon" "Opacity Control" "enabled"
else
    killall picom
    notify-send -c "sys-alert" -i "$icon" "Opacity Control" "disabled"
fi
