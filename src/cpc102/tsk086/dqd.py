#!/usr/bin/python

import os
import subprocess

if __name__ == '__main__':
    subprocess.call(['firefox', os.path.join(os.environ['CFG_DIR'], 'dqd/index.html')])
    
