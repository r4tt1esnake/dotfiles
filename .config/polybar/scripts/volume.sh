vol=$(pamixer --get-volume)
mute=$(pamixer --get-mute)
postfix=""

if [[ $vol -le 33 ]]; then
    prefix=""
elif [[ $vol -le 66 ]]; then
    prefix=""
else
    prefix=""
fi

if [[ $mute == "true" ]]; then
    prefix=""
    postfix="(MUT)"
fi

echo -n "$prefix $vol% $postfix"