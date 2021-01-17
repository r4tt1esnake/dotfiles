if [ -z "${DISPLAY}" ] && [ "${XDG_VTNR}" -eq 1 ]; then
<<<<<<< HEAD
	startx
=======
	exec startx
>>>>>>> 82b677034b92cc1cbb7ac83c67d02a7b22aa50a9
fi
