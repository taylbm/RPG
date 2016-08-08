import os
import sys
import signal
import threading 
from time import sleep 

HERE = os.path.split(os.path.abspath(__file__))[0]     # looks awful, but gets the parent dir
PARENT = os.path.split(HERE)[0]
sys.path.append(PARENT+"/deps")
sys.path.append(PARENT+"/webapps")

MODULE_CACHE_DIR = '/tmp/HCI/mako_modules'      # change "my_app_name" to your application name

import web

from templating import Configure

Configure(
    [os.path.join(PARENT, 'templates')], 
    module_cache_dir = MODULE_CACHE_DIR
)

from hci_handlers import *
from hci_vcp_handlers import *
from hci_scc_handlers import *

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
    '/sails','hci_handlers.ORPGSAILS_set',
    '/mrle','hci_handlers.ORPGMRLE_set',
    '/set_flag','hci_handlers.Set_Flag',
    '/mrpg','hci_handlers.MRPG',
    '/mrpg_state','hci_handlers.MRPG_state',
    '/mrpg_clean','hci_handlers.MRPG_clean',
    '/deau_set','hci_handlers.DEAU_set',
    '/auth','hci_handlers.Basic_Auth',
    '/rpg_s','hci_handlers.RPG_status_server',
    '/rpg_status','hci_handlers.RPG_Status',
    '/dqd','hci_handlers.DQD',
    '/el_list','hci_vcp_handlers.Elev_List',
    '/send_rda_cmd','hci_vcp_handlers.Send_RDACOM',
    '/send_vcp_cmd','hci_vcp_handlers.Send_VCP',
    '/current_vcp','hci_vcp_handlers.Current_VCP',   
    '/list_vcps','hci_vcp_handlers.List_VCPS',
    '/parse_vcps','hci_vcp_handlers.Parse_VCPS',
    '/vcp','hci_vcp_handlers.VCP_command_control',
    '/scc','hci_scc_handlers.Shift_change_checklist'

)

app = web.application(URLS, globals())
application = app.wsgifunc()
if __name__ == '__main__':
    app.run()

