if type xkbset; then
    xkbset bouncekeys 20
fi

xinput | while read -r m; do
    id=$(echo "$m" | cut -d"=" -f2 | cut -d"[" -f1)
    isM=$(xinput list-props $id | grep "Accel" -c)
    if [ $isM == 0 ]; then
        continue
    fi
    xinput set-prop $id 'libinput Accel Profile Enabled' 0, 1
    xinput set-prop $id 'libinput Accel Speed' 1
    if [ $(echo "$m" | grep -e "Mouse" -e "mouse" -c) == 0 ]; then 
        xinput set-prop $id 'libinput Natural Scrolling Enabled' 1
    else
        xinput set-prop $id 'libinput Natural Scrolling Enabled' 0
    fi
    xinput set-prop $id 'libinput Tapping Enabled' 1
done
