xinput | while read -r m; do
    id=$(echo "$m" | cut -d"=" -f2 | cut -d"[" -f1)
    isM=$(xinput list-props $id | grep "Accel" -c)
    if [ $isM == 0 ]; then
        continue
    fi
    xinput set-prop $id 'libinput Accel Profile Enabled' 0, 1
    xinput set-prop $id 'libinput Accel Speed' 0.2
done