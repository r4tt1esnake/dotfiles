#!/bin/bash

prepend_zero () {
    seq -f "%02g" $1 $1
}

threshold=10

artist=$(echo -n $(cmus-remote -C status | grep artist -m 1| cut -c 12-))
song=$(echo -n $(cmus-remote -C status | grep title | cut -c 10-))

aLen=$(echo -n "$artist" | wc -m)
sLen=$(echo -n "$song" | wc -m)

if [[ aLen -ge threshold ]]; then
    artist=$(echo -n  "$artist" | cut -c 1-$threshold)...
fi

if [[ sLen -ge  threshold ]]; then
    song=$(echo -n "$song" | cut -c 1-$threshold)...
fi

position=$(cmus-remote -C status | grep position | cut -c 10-)
minutes1=$(prepend_zero $(($position / 60)))
seconds1=$(prepend_zero $(($position % 60)))

duration=$(cmus-remote -C status | grep duration | cut -c 10-)
minutes2=$(prepend_zero $(($duration / 60)))
seconds2=$(prepend_zero $(($duration % 60)))

echo -n "$artist  -  $song [$minutes1:$seconds1 / $minutes2:$seconds2]"
