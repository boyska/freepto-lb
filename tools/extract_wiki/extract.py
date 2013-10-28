#!/usr/bin/env python3

import os
import sys
from urllib.request import urlopen, urlretrieve
from urllib.parse import urljoin, urlsplit
from datetime import datetime

from bs4 import BeautifulSoup
from bs4.element import Comment


def remove_js(content):
    '''remove js inclusion'''
    ### Bit of cleanup
    scripts = content.find_all('script')
    for s in scripts:
        s.replace_with(Comment("script rimosso"))


def download_url(pageurl, target):
    imgdir = target + "_files"

    def get_external(el, tag):
        if not os.path.exists(imgdir):
            os.mkdir(imgdir)
        resource_url = urljoin(pageurl, el[tag])
        base = urlsplit(resource_url).path.split('/')[-1]
        target = os.path.join(imgdir, base)
        if not os.path.exists(target):
            urlretrieve(resource_url, filename=target)
        el[tag] = os.path.join(os.path.basename(imgdir), base)

    p = BeautifulSoup(urlopen(pageurl))
    head = p.find('head')
    content = p.find(id='wiki_html')

    remove_js(p)

    ### Images
    for image in content.findAll("img"):
        get_external(image, "src")
    for css in p.findAll("link"):
        get_external(css, "href")

    ### Finally, write to disk!
    print('''<html>%(head)s<body>
          <div class="content_box"><div class="wiki">%(body)s</div></div>
          <div class="creation-notes">
          This is a copy of <a href="%(url)s">%(url)s</a>, taken on %(date)s
          </div>
          </body></html>''' % {'head': head, 'body': content, 'url': pageurl,
                               'date': datetime.now().strftime('%d %B %Y')},
          file=open(target, 'w'))


if __name__ == '__main__':
    download_url(sys.argv[1], sys.argv[2])
