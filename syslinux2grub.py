#!/usr/bin/env python2

class Entry(object):
    label = None
    kernel = None
    initrd = None
    params = None  # is a list

    def __str__(self):
        return 'Entry (%s)' % self.label

    def to_menuentry(self):
        tmpl = ('menuentry "%(label)s" {\n'
                '\tset gfxpayload=keep\n'
                '\tlinux %(kernel)s %(params_string)s\n'
                '\tinitrd %(initrd)s\n'
                '}\n')
        return tmpl % self

    def __getitem__(self, key):
        if key == 'params_string':
            return ' '.join(self.params)
        return getattr(self, key)


def parse_syslinux(buf):
    e = None
    for line in buf:
        line = line.strip()
        if line.startswith('label'):
            if e is not None:
                yield e
            e = Entry()
            e.label = line.split(None, 1)[1]
        elif line.startswith('linux'):
            e.kernel = line.split(None, 1)[1]
        elif line.startswith('initrd'):
            e.initrd = line.split(None, 1)[1]
        elif line.startswith('append'):
            e.params = line.split(None, 1)[1].split()
    if e is not None:
        yield e


if __name__ == '__main__':
    import sys
    with open(sys.argv[1], 'r') as buf:
        if len(sys.argv) > 2:
            out = open(sys.argv[2], 'w')
        else:
            out = sys.stdout
        for entry in parse_syslinux(buf):
            out.write(entry.to_menuentry())
