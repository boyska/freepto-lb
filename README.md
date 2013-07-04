**# Freepot-lb: crypto-usb for activist**

## Chroot Debian Sid

Make chroot:
> $ sudo debootstrap --include=debian-keyring,debian-archive-keyring,cryptsetup,live-build,git,ca-certificates --arch i386 sid ~/freepto-lb/

User chroot:
> $ sudo chroot ~/freepto-lb /bin/bash

Cache for APT (optional):
> $ apt-get install apt-cacher-ng

> $ /etc/init.d/apt-cacher-ng start

> $ export http_proxy=http://localhost:3142/

## Build
Make your build.img:
> $ git clone https://github.com/AvANa-BBS/freepto-lb.git

> $ cd freepto-lb

> $ lb config && lb build

## Make Freepto:
Use "dmesg" to identify the usb device:
> $ dmesg

Run make-freepto.sh:

> $ bash makefreepto -h

> $ bash makefreepto -i binary.img -p myS3cr3t#luksp4ssw0rd /dev/sdX

## Read documentation:
https://we.riseup.net/avana/freepto-docs

http://avana.forteprenestino.net/freepto

## Start Freepto:

![](http://avana.forteprenestino.net/freepto/img/screenshot/freepto1.png)
![](http://avana.forteprenestino.net/freepto/img/screenshot/freepto3.png)
![](http://avana.forteprenestino.net/freepto/img/screenshot/freepto4.png)
