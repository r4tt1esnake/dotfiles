if type xkbset; then
    xkbset bouncekeys 30
fi

xinput | while read -r m; do
    id=$(echo "$m" | cut -d"=" -f2 | cut -d"[" -f1)
    isM=$(xinput list-props $id | grep "Accel" -c)
    if [ $isM == 0 ]; then
        continue
    fi
    xinput set-prop $id 'libinput Accel Profile Enabled' 0, 1
    xinput set-prop $id 'libinput Accel Speed' 1
    xinput set-prop $id 'libinput Natural Scrolling Enabled' 1
    xinput set-prop $id 324 1
done
