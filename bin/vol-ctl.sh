prgm="Volume Control"
icon="/usr/share/icons/Vimix-Doder/symbolic/status/audio-volume-high-symbolic.svg"

die() {
    echo "USAGE: ./vol-ctl.sh <inc/dec/mut/x>"
    exit 1
}

if [[ $# != 1 ]]; then
    die
fi

cmd="volume"

if [[ "$1" == "inc" ]]; then
    delta="+5%"
    string="Increased"
elif [[ "$1" == "dec" ]]; then
    delta="-5%"
    string="Decreased"
elif [[ "$1" == "mut" ]]; then
    delta="toggle"
    temp=$(amixer get Master | sed 7q | grep -c '\[on\]')
    if [[ $temp == 0 ]]; then
        string="Muted"
    else
        string="Unmuted"
    fi  
    cmd="mute"
else
    if [[ $(($1)) == $1 ]]; then
        delta="$1%"
        string="Volume set"
    else
        die
    fi
fi

pactl set-sink-"$cmd" @DEFAULT_SINK@ $delta

curr="$(pamixer --get-volume)%"

dunstify -i $icon -h string:x-dunst-stack-tag:vol -a "$prgm" "$string ($curr)"
