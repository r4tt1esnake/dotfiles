vol=$(pamixer --get-volume)
mute=$(pamixer --get-mute)

if [[ $mute == "true" ]]; then
    symbol=""
elif [[ $vol -le 33 ]]; then
    symbol=""
elif [[ $vol -le 66 ]]; then
    symbol=""
else
    symbol=""
fi

echo -n "$symbol $vol%" 