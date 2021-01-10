floatState=$(~/.config/i3/scripts/i3get.sh -a -r f)

if [[ "$floatState" == "\"auto_off\"" || "$floatState" == "\"user_off\"" ]]; then
    i3-msg border normal
else
    i3-msg border pixel 4
fi

i3-msg floating toggle
