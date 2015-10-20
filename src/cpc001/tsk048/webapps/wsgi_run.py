import os
import sys
HOME = os.getenv("HOME")
sys.path.insert(0,HOME+'/src/cpc001/lib004')
sys.path.insert(0,HOME+'RPG-ecp-0634p/src/cpc001/lib004')
import _rpg
HERE = os.path.split(os.path.abspath(__file__))[0]     # looks awful, but gets the parent dir
PARENT = os.path.split(HERE)[0]
MODULE_CACHE_DIR = '/tmp/HCI_SCC/mako_modules'      # change "my_app_name" to your application name

import web

from templating import Configure

Configure(
    [os.path.join(PARENT, 'templates')], 
    module_cache_dir = MODULE_CACHE_DIR
)

from handlers import *

SESSION_DIR = '/tmp/HCI_SCC'            # change "my_app_name" to your application name
URLS = (
    '/',    'handlers.Shift_change_checklist',            # you can list other handlers here
)
def session_hook_for_sub_apps():
    n = _rpg.liborpg.orpgda_lbname(_rpg.orpgdat.ORPGDAT_ADAPT_DATA) 
    _rpg.librpg.deau_lb_name(n)
if __name__ == '__main__':
    app = web.application(URLS, globals())
    app.add_processor(web.loadhook(session_hook_for_sub_apps))
    app.run()

