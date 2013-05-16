freepto-lb
==========

encrypted distro for usb-key (starting from debian live build)


Chroot Debian Sid
=================

1. Make chroot:

 $ sudo debootstrap --include=debian-keyring,debian-archive-keyring,cryptsetup,live-build,git,ca-certificates --arch i386 sid ~/freepto-lb/

2. User chroot:

 $ sudo chroot ~/freepto-lb /bin/bash


Cache for APT (if you use a non-chroot debian sid):
=========================

1. Install apt-cacher-ng

 $ apt-get install apt-cacher-ng
 
 $ /etc/init.d/apt-cacher-ng start
 
2. Set http_proxy:
 
 $ export http_proxy=http://localhost:3142/


Build
=====

1. Make your build.img

 $ git clone https://github.com/vinc3nt/freepto-lb.git

 $ lb config && lb build
 

Make Freepto
============

1. Use "dmesg" to identify the usb device:

 $ dmesg

2. Run make-freepto.sh

 $ bash make-freepto.sh /dev/sdd
 
 
Read Documentation
==================

 https://we.riseup.net/avana/freepto-docs
 http://avana.forteprenestino.net/freepto
