#!/bin/sh

# set -e

Set_Keymap() {
	local cmdline
	local kmapfile
	local keymap
	if [ -z "${cmdline}" ]; then
		cmdline=$(cat /proc/cmdline)
	fi
	for par in ${cmdline}
	do
		case "${par}" in
			live-boot.keymap=*)
				keymap="${par#*keymap=}"
				;;
		esac
	done

	kmapfile="$(find /usr/share/keymaps -name "${keymap}.kmap.gz" -type f -print | head -n1)"
	if [ -n "$kmapfile" ]; then
		rm "/etc/boottime.kmap.gz"
		ln -s "$kmapfile" "/etc/boottime.kmap.gz"
	fi
}

Set_Keymap
