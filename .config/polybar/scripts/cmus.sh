#!/bin/bash

prepend_zero () {
    seq -f "%02g" $1 $1
}

threshold=22

#artist=$(echo -n $(cmus-remote -C status | grep artist -m 1| cut -c 12-))
song=$(echo -n $(cmus-remote -C status | grep title | cut -c 10-))

if [[ $song == "" ]]; then
    song=$(cmus-remote -C status | grep file | rev | cut -d '/' -f 1 | rev) 
fi

#aLen=$(echo -n "$artist" | wc -m)
sLen=$(echo -n "$song" | wc -m)

#if [[ aLen -ge threshold ]]; then
#    artist=$(echo -n  "$artist" | cut -c 1-$threshold)...
#fi

if [[ $sLen -ge  $threshold ]]; then
    song=$(echo -n "$song" | cut -c 1-$threshold)...
fi

position=$(cmus-remote -C status | grep position | cut -c 10-)
duration=$(cmus-remote -C status | grep duration | cut -c 10-)
diff=$(($duration - $position))
min=$(prepend_zero $(($diff / 60)))
sec=$(prepend_zero $(($diff % 60)))

echo -n "$song [-$min:$sec]"
