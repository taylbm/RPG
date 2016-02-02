import os
import sys
import signal
import threading 
from time import sleep 

CFG = os.getenv("CFG_DIR")
LD_LIB = os.getenv("LD_LIBRARY_PATH")
sys.path.append(CFG+"/web/deps")
sys.path.append(LD_LIB)

import _rpg
HERE = os.path.split(os.path.abspath(__file__))[0]     # looks awful, but gets the parent dir
PARENT = os.path.split(HERE)[0]
MODULE_CACHE_DIR = '/tmp/HCI/mako_modules'      # change "my_app_name" to your application name

import web

from templating import Configure

Configure(
    [os.path.join(PARENT, 'templates_hci')], 
    module_cache_dir = MODULE_CACHE_DIR
)

from handlers import *
SESSION_DIR = '/tmp/HCI'            # change "my_app_name" to your application name
URLS = (
    '/','handlers.IndexView',            # you can list other handlers here
    '/update','handlers.Update',
    '/update_s','handlers.Update_Server',
    '/radome','handlers.Radome',
    '/perf','handlers.Performance',
    '/vst','handlers.ORPGVST',
    '/button','handlers.Button',
    '/operations','handlers.Operations',
    '/control_rpg','handlers.Control_RPG',
    '/send_cmd','handlers.Send_RDACOM',
    '/sails','handlers.ORPGSAILS_set',
    '/set_flag','handlers.Set_Flag',
    '/mrpg','handlers.MRPG'
)
#def deau_loadhook():
#    n = _rpg.liborpg.orpgda_lbname(_rpg.orpgdat.ORPGDAT_ADAPT_DATA) 
#    _rpg.librpg.deau_lb_name(n)

if __name__ == '__main__':
    app = web.application(URLS, globals())
#    app.add_processor(web.loadhook(deau_loadhook))
    app.run()

