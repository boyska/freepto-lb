#!/bin/sh
V="$(mount | grep truecrypt_aux_mnt)"
[ "$V" ] && echo Error: All volumes must be dismounted first. && exit 1

rm -f /usr/bin/truecrypt
rm -f /usr/share/truecrypt/doc/License.txt
rm -f '/usr/share/truecrypt/doc/TrueCrypt User Guide.pdf'
rm -f /usr/share/applications/truecrypt.desktop
rm -f /usr/share/pixmaps/truecrypt.xpm
rmdir /usr/share/truecrypt/doc /usr/share/truecrypt

echo TrueCrypt uninstalled.
rm -f /usr/bin/truecrypt-uninstall.sh
