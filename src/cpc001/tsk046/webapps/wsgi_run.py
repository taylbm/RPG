import os
import sys

HERE = os.path.split(os.path.abspath(__file__))[0]     # looks awful, but gets the parent dir
PARENT = os.path.split(HERE)[0]
MODULE_CACHE_DIR = '/tmp/HCI_vcp/mako_modules'      # change "my_app_name" to your application name

import web

from templating import Configure

Configure(
    [os.path.join(PARENT, 'templates')], 
    module_cache_dir = MODULE_CACHE_DIR
)

from handlers import *

SESSION_DIR = '/tmp/HCI_vcp'            # change "my_app_name" to your application name
URLS = (
    '/',    'handlers.IndexView',            # you can list other handlers here
'/list_vcps','handlers.List_VCPS',
'/parse_vcps','handlers.Parse_VCPS',
'/VCP','handlers.VCP_command_control',
'/shift_change_checklist','handlers.Shift_change_checklist'
,'/update','handlers.Updater',
'/button','handlers.Button',
'/operations','handlers.Operations')

if __name__ == '__main__':
    app = web.application(URLS, globals())
    app.run()

