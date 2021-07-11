prgm="Brightness Control"
icon="/usr/share/icons/Vimix-Doder/symbolic/status/brightness-display-symbolic.svg"

die() {
    echo "USAGE: ./bright-ctl.sh <inc/dec/x>"
    exit 1
}

if [[ $# != 1 ]]; then
    die
fi

if [[ "$1" == "inc" ]]; then
    delta="+5%"
    string="Increased"
elif [[ "$1" == "dec" ]]; then
    delta="5%-"
    string="Decreased"
else
    if [[ $(($1)) == $1 ]]; then
        delta="$1%"
        string="Brightness set"
    else
        die
    fi
fi

brightnessctl s $delta

curr="$(echo "$(brightnessctl g)/$(brightnessctl m)" | bc -l | cut -c 2-3)%"

dunstify -i $icon -h string:x-dunst-stack-tag:bright -a "$prgm" "$string ($curr)"
