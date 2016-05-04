import os
import sys
import signal
import threading 
from time import sleep 

CFG = os.getenv("CFG_DIR")
sys.path.append(CFG+"/web/deps")
RPG_LIB = os.getenv("RPGLIB")
sys.path.append(RPG_LIB)

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

from hci_handlers import *
SESSION_DIR = '/tmp/HCI'            # change "my_app_name" to your application name
URLS = (
    '/','hci_handlers.IndexView',            # you can list other handlers here
    '/update','hci_handlers.Update',
    '/update_s','hci_handlers.Update_Server',
    '/radome','hci_handlers.Radome',
    '/vst','hci_handlers.ORPGVST',
    '/button','hci_handlers.Button',
    '/operations','hci_handlers.Operations',
    '/control_rpg','hci_handlers.Control_RPG',
    '/send_cmd','hci_handlers.Send_RDACOM',
    '/sails','hci_handlers.ORPGSAILS_set',
    '/set_flag','hci_handlers.Set_Flag',
    '/mrpg','hci_handlers.MRPG',
    '/mrpg_state','hci_handlers.MRPG_state',
    '/mrpg_clean','hci_handlers.MRPG_clean',
    '/deau_set','hci_handlers.DEAU_set',
    '/auth','hci_handlers.Basic_Auth',
    '/rpg_s','hci_handlers.RPG_status_server',
    '/rpg_status','hci_handlers.RPG_Status',
    '/dqd','hci_handlers.DQD'
)

if __name__ == '__main__':
    app = web.application(URLS, globals())
    app.run()

