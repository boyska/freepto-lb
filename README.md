Freepto-lb
==========

Encrypted GNU/Linux OS (based on Debian Wheezy) wich can be installed on USB flash drive.

Freepto is designed for encrypt your communications (OTR, GPG, SSL), carry your documents in secure way (LUKS) and save your anonymity (TOR, OPENVPN)


For developers: build Freepto
=============================

You need a debian wheezy  and some packages installed:
`aptitude install live-build python git-core debootstrap`

Just clone a repository, edit the configuration file:

 vim config/freepto

and run:

`lb config && lb build`

and you'll find a binary.img file :)

We are also providing a Vagrantfile to create quickly a Freepto development environment
https://github.com/AvANa-BBS/freepto-vagrant

See more information:
http://www.freepto.mx/en/dev-team/


For users: Burn Freepto on a USB
================================

You can download the latest images from
https://download.freepto.mx

Then follow our documentation:
http://www.freepto.mx/en/get-started/

Documentation
=============

Italiano:
* https://we.riseup.net/freepto-wiki/freepto-docs
* https://www.freepto.mx/

Castellano:
* https://we.riseup.net/freepto-wiki/freepto-docs-es
* https://www.freepto.mx/es/

English:
* https://we.risep.net/freepto-wiki/freepto-docs-en
* https://www.freepto.mx/en

Screenshots
============

![](http://www.freepto.mx/static/syslinux-berenjena.png)
![](http://www.freepto.mx/static/paranoiatools.png)
