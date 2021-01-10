prgmNm="Volume Control"

die() {
    echo "USAGE: ./vol-ctl.sh <inc/dec/mut/%>"
    exit 1
}

if [[ $# != 1 ]]; then
    die
fi

if [[ "$1" == "inc" ]]; then
    pactl set-sink-volume @DEFAULT_SINK@ +5%
    notify-send -c "sys-alert" -i "/usr/share/icons/Vimix-Doder/symbolic/status/audio-volume-high-symbolic.svg" "$prgmNm" "increased"
elif [[ "$1" == "dec" ]]; then
    pactl set-sink-volume @DEFAULT_SINK@ -5%
    notify-send -c "sys-alert" -i "/usr/share/icons/Vimix-Doder/symbolic/status/audio-volume-high-symbolic.svg" "$prgmNm" "decreased"
elif [[ "$1" == "mut" ]]; then
    pactl set-sink-mute @DEFAULT_SINK@ toggle
    temp=$(amixer get Master | sed 7q | grep -c '\[on\]')
    if [[ $temp == 0 ]]; then
        notify-send -c "sys-alert" -i "/usr/share/icons/Vimix-Doder/symbolic/status/audio-volume-low-symbolic.svg" "$prgmNm" "muted"
    else
        notify-send -c "sys-alert" -i "/usr/share/icons/Vimix-Doder/symbolic/status/audio-volume-high-symbolic.svg" "$prgmNm" "unmuted"
    fi  
else
    if [[ $(($1)) == $1 ]]; then
        pactl set-sink-volume @DEFAULT_SINK@ "$1"%
    else
        die
    fi
fi