prgmNm="Brightness Control"

die() {
    echo "USAGE: ./bright-ctl.sh <inc/dec>"
    exit 1
}

if [[ $# != 1 ]]; then
    die
fi

if [[ "$1" == "inc" ]]; then
    brightnessctl s +5%
    notify-send -c "sys-alert" -i "/usr/share/icons/Vimix-Doder/symbolic/status/display-brightness-high-symbolic.svg" "$prgmNm" "increased"
elif [[ "$1" == "dec" ]]; then
    brightnessctl s 5%-
    notify-send -c "sys-alert" -i "/usr/share/icons/Vimix-Doder/symbolic/status/display-brightness-low-symbolic.svg" "$prgmNm" "decreased"
else
    if [[ $(($1)) == $1 ]]; then
        brightnessctl s "$1"%
    else
        die
    fi
fi
