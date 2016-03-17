from templating import LOOKUP
import sys
import os

CFG = os.getenv("CFG_DIR")
sys.path.append(CFG+"/web/deps")

import subprocess

##
# Method for retrieving/parsing sccprod 
##

def SCC():
   final = {}
   dump = subprocess.Popen('standalone_scc -t',shell=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
   out = dump.communicate()
   if out[0] != '':
       out_split = out[0].split('Shift Change Checklist')
       out_len = len(out_split)
       out_item = out_split[out_len-1]
       out_id = out_split[out_len-2].split('\n\n')
       out_id_len = len(out_id)-1
       id = filter(None,out_id[out_id_len].split(' '))
       final.update({id[0]:id[1],id[2]:id[3]+' '+id[4]})
       item = filter(None,out_item.split('\n'))
       item_dict = dict((i,v.split(': ')) for i,v in enumerate(item) if '\\x' not in repr(v) and ':' in v)
       extra_items = dict((k,v) for k,v in enumerate(item) if '\\x' not in repr(v) and ':' not in v)
       for k in extra_items.keys():
            if ':' not in item[k-1]:
                extra_items[k-1] += ','+extra_items[k].strip()
                del extra_items[k]
                break
       for k in extra_items.keys():
            item_dict[k-1][1] += ','+extra_items[k].strip()
       final_list = [item_dict[x] for x in item_dict]
       final.update(dict((k.strip(),v.strip()) for k,v in iter(final_list)))

   return final 

##
# Renders the Shift Change Checklist 
##	
class Shift_change_checklist(object):
    def GET(self):
        return LOOKUP.Shift_change_check(**{'SCC':SCC()})


