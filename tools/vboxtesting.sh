#!/bin/bash

DIALOG=${DIALOG:-zenity}

function create() {
    (
    if [ "${img: -3}" == "img" ]; then
        echo "20"; sleep 1
        echo "# Converting image"; sleep 1
        vboxmanage convertdd $img $vdi
        echo "40"
    elif [ "${img: -3}" == "vdi" ]; then
        vdi=$img
        echo "40"
    fi
    
    echo "60"; sleep 1
    echo "# Creating virtual machine"; sleep 1
    vboxmanage createvm --name "freepto" --ostype Debian --register; sleep 1

    # setup
    echo "70"; sleep 1
    echo "Configuring virtula machine"; sleep 1
    vboxmanage modifyvm "freepto" --nic1 nat
    vboxmanage modifyvm "freepto" --memory 512
    echo "80"; sleep 1
    echo "Attach IDE controller"; sleep 1
    vboxmanage storagectl "freepto" --name "IDE Controller" --add ide
    vboxmanage storageattach "freepto" --storagectl "IDE Controller" --port 0 --device 0 --type hdd --medium ${vdi}
    echo "100"; sleep 1
    ) | 
    $DIALOG --progress --title="Freepto testing" --text="Setup VirtualBox" --auto-close --percentage=0

    if [ "$?" != 0 ] ; then
        $DIALOG --error --text="Aborted."
        exit 1
    fi
}

function remove() {
    # remove vm:
    vboxmanage unregistervm "freepto" --delete
    $DIALOG --info --text="Freepto removed"
}

function confirm() {
    conf=$($DIALOG  --list  --text "Freepto is already present." --radiolist  --column "Select" --column "Action" TRUE Start FALSE Remove)
    if [ "$conf" == "Remove" ]; then
        remove
    elif [ "$conf" == "Start" ]; then
        startvm
    fi
}

function startvm() {
    # start
    VBoxManage startvm "freepto"
}

function main() {
    # check if the vm already exist
    if vboxmanage list vms | grep freepto >/dev/null; then
        confirm
    else
        FILE=`$DIALOG --file-selection --title="Select Freepto image file"`
        case $? in
            1)
            exit 1;;
            -1)
            exit 1;;
        esac
        
        img="${FILE}"
        if [[ "${img: -3}" == "img" || "${img: -3}" == "vdi" ]]; then
            imgpath=$(dirname $FILE)
            vdi="${imgpath}/freepto_vbox.vdi"
        
            create
            startvm
        else
            $DIALOG --error --text="File not valid"
            exit 1
        fi
    fi
}

main
