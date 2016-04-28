from platform import architecture
word_size = int(architecture()[0].replace('bit',''))
if word_size == 32:
    import simplejson as json
else:
    import json
import os
import web
import sys
import datetime

CFG = os.getenv("CFG_DIR")
sys.path.append(CFG+"/web/deps")

import _rpg

import web
import cgi

from templating import LOOKUP

vcp_dir = CFG+'/vcp/'
vcp_desc = CFG+'/web/static/static_vcp/vcp_desc.json'

##
# Utility fxn defs
##
def stripList(list1):
        return str(list1).replace('[','').replace(']','').replace('\'','').strip().strip('\\n')
def hasNumbers(inputString):
        return any(char.isdigit() for char in inputString)



##
# Retrieves current VCP 
##
class Current_VCP(object):
    def GET(self):
        vcp_num = _rpg.liborpg.orpgrda_get_status(_rpg.rdastatus.RS_VCP_NUMBER)
        vel_res = _rpg.libhci.hci_current_vcp_get_vel_resolution()
        vel_res_dict = {_rpg.orpgrda.CRDA_VEL_RESO_HIGH:'label-high',_rpg.orpgrda.CRDA_VEL_RESO_LOW:'label-low'}
        return json.dumps({'vcp_num':vcp_num,'vel_res':vel_res_dict[vel_res]})


##
# Sends RDA Commands 
##
class Send_RDACOM(object):
    def POST(self):
	data = cgi.parse_qs(web.data())
	cmd = data['COM'][0]
	input = data['INPUT'][0]
	if cmd == 'COM4_DLOADVCP':
	    p1 = int(input)
	else:
	    p1 = getattr(_rpg.orpgrda,input)
	who_sent_it = {
			'COM4_RDACOM':1,
			'COM4_DLOADVCP':_rpg.orpgrda.HCI_VCP_INITIATED_RDA_CTRL_CMD,
			'COM4_VEL_RESO':_rpg.orpgrda.HCI_INITIATED_RDA_CTRL_CMD
		      }
	commanded = _rpg.liborpg.orpgrda_send_cmd(getattr(_rpg.orpgrda,cmd),who_sent_it.get(cmd),p1,0,0,0,0,_rpg.CharVector())
	return json.dumps(commanded)
##
# Retrieves VCP list from cfg directory
##
class List_VCPS(object):
    def GET(self):
  	dir_list = [x for x in (os.listdir(vcp_dir)) if len(x.split('_')) < 3]
	dir_list_parse = []
	for item in dir_list:
    	    newstr = item.split('_')
    	    if newstr[0] == 'vcp':
                dir_list_parse.append(int(newstr[1]))
	return json.dumps(dir_list_parse)


class Elev_List(object):	
    def GET(self):
	el_dict = {}
        dir_list_parse = [x.split('_')[1] for x in os.listdir(vcp_dir) if x.split('_')[0] == 'vcp']
        for vcp in dir_list_parse:
            fname = vcp_dir+'/vcp_'+vcp
            try:
                f = open(fname,'r')
                text_lines = list(f)
            except Exception,e:
                print ("vcp def read error")
            el_list = [float(x.replace('elev_ang_deg','').replace("\n",'').replace(' ','')) for x in text_lines if 'elev_ang_deg' in x]
	    el_dict.update({str(vcp):el_list})
	return json.dumps(el_dict)
##
# Renders the VCP Command Control page
##
class VCP_command_control(object):
    def GET(self):
        dir_list_parse = [x.split('_')[1] for x in os.listdir(vcp_dir) if x.split('_')[0] == 'vcp']
        complete = {}
	vcp_num = _rpg.liborpg.orpgrda_get_status(_rpg.rdastatus.RS_VCP_NUMBER)
        print vcp_num
	for vcp in dir_list_parse:	
            fname = vcp_dir+'/vcp_'+vcp
            try:
                f = open(fname,'r')
                text_lines = list(f)
            except Exception,e:
            	print ("vcp def read error")
            # creates custom display data
	    elev_list = [x for x in text_lines if 'elev_ang_deg' in x]
            unique_elevs = len(set(elev_list))
            num_split_cuts = len([x for x in text_lines if 'waveform_type' and 'CS' in x])-1
            num_batch_cuts = len([x for x in text_lines if 'waveform_type' and 'BATCH' in x])
            # identifies open and closed braces
	    text_open = [x for x,i in enumerate(text_lines) if '{' in i]
	    text_closed = [x for x,i in enumerate(text_lines) if '}' in i]
            # counts whitespaces to determine line indentation pattern
            indent_open = []
            for j in text_open:
        	indent_open.append((len(text_lines[j]) - len(text_lines[j].lstrip())))
            indent_closed = []
            for b in text_closed:
        	indent_closed.append((len(text_lines[b]) - len(text_lines[b].lstrip())))
            del indent_open[1]
            indent_open.append(8)
            indent_difference = [a - b for a, b in zip(indent_open,indent_closed)]
            for n,i in enumerate(indent_difference):
        	if i==-4:
        	    indent_difference[n]=2
            # distinguishes between Doppler cuts and Surveillance cuts (necessary as they have inherently incompatible hiearchy; Doppler cuts contain sector data)
            strtest = ''.join(str(e) for e in indent_difference)
	    index_start = [idx for idx,val in enumerate(strtest) if val == '0' and strtest[idx+1] == '0' and strtest[idx+2] == '4']
            index_end = [idx+3 for idx,val in enumerate(strtest) if val == '0' and strtest[idx+1] == '0' and strtest[idx+2] == '4'] 
            index_start1 = [idx for idx,val in enumerate(strtest) if idx < len(strtest)-4 and val+strtest[idx+1]+strtest[idx+2]+strtest[idx+3]+strtest[idx+4] == '02004']
            # Declarations
	    elev_sector_labels = [None] * len(index_start)
            sector_dict = {}
            elev_sector_full_dict = {}
            elev_multi_list = [None] * len(index_start)
            # runs through Doppler cuts

            for h,val in enumerate(index_start):
            
                subdict = {}
                elev_multi_dict = {}
                start = text_open[val] 
                end = text_open[val+1]
                start1 = text_open[index_end[h]]
                newstr1 = "".join([text_lines[x] for x in xrange(start+1,end+2)])
                newstr2 = "".join([text_lines[x] for x in xrange(start1+6,start1+8)])
                omitstr = newstr1+newstr2
                omitstr1 = omitstr.replace('}','').replace('Sector_1 {','')
                newstr = filter(None,omitstr1.split('\n'))
                substr = newstr[0]+newstr[1]
                substr = substr.split()
                break_length = len(substr)-1
                for idx in xrange(0,break_length,2):
            	    if substr[idx+1].replace('.','').isdigit():
            	    	temp1 = {substr[idx]:float(substr[idx+1])}
            	    else:
            	    	temp = {substr[idx]:(substr[idx+1])}		    
                subdict.update(temp)
                subdict.update(temp1)
                elev_multi_dict.update(subdict)
                loose2 = {'#':newstr[2]}
                elev_multi_dict.update(loose2)
                elev_multi_dict.update({'SNR_thresh_dB':[x for x in [stripList(x).split(' ') for x in omitstr.split('\n') if 'dB' in x][0] if x.replace('.','',1).isdigit()]})
                elev_multi_dict.update({'dop_pulses':[x for x in [stripList(x).split(' ') for x in omitstr.split('\n') if 'dop_pulses' in x][0] if x.isdigit()]})
                line_num1 = 0
                line_num2 = 0
                substr4 = newstr[3:len(newstr)]
                for line in substr4:
            	    if line.find('SNR_thresh_dB') >= 0:
            	    	break
            	    line_num1+=1
                del substr4[line_num1]
                for line in substr4:
            	    if line.find('dop_pulses') >= 0:
            	    	break
            	    line_num2 +=1	
                del substr4[line_num2]
                substr4 = stripList(substr4)
                substr4 = substr4.strip(',').split(',')
                for elem in substr4:
            	    temp = elem.split()
            	    if temp == []:
            	    	continue
            	    else:
            	    	if str(temp).replace('.','').isdigit():
            	  	    temp_dict = {temp[0]:float(temp[1])}
            	    	else:
            		    temp_dict = {temp[0]:(temp[1])}
            	    elev_multi_dict.update(temp_dict)
                newstr = "".join([text_lines[x] for x in xrange(start+1,start+28)])
		edge_angles = [float(x.replace('edge_angle','').replace(' ','')) for x in newstr.split('\n') if 'edge_angle' in x]
		dop_prfs = [float(x.replace('dop_prf','').replace(' ','')) for x in newstr.split('\n') if 'dop_prf' in x]
		sector_labels = [x.replace(' ','').replace('{','') for x in newstr.split('\n') if 'Sector' in x]
                for idx,sector in enumerate(sector_labels):
		    sector_subdict = {'edge_angle':edge_angles[idx],'dop_prf':dop_prfs[idx]}
		    elev_multi_dict.update({sector_labels[idx]:sector_subdict})
		text_lines[start] = text_lines[start].replace('{','')
                elev_sector_label = stripList(text_lines[start])
                elev_sector_labels[h] = elev_sector_label
                elev_multi_list[h] = elev_multi_dict	
            for idx,val in enumerate(elev_sector_labels):
                elev_sector_full_dict.update({val:elev_multi_list[idx]})    
            #runs through Surveillance cuts
            elev_data = []
            elev_dict_full = {}
            for p  in index_start1:
                elev_dict = {}
                start1 = text_open[p+1]
                text_lines[start1] = text_lines[start1].replace('{','')
                elev_label = stripList((text_lines[start1]))
                newstr = "".join([text_lines[x] for x in xrange(start1+1,start1+4)])
                newstr_split1 = newstr.split()
                dict1 = {newstr_split1[0]:float(newstr_split1[1]),newstr_split1[2]:(newstr_split1[3])}
                elev_dict.update(dict1)
                loose2 = stripList(text_lines[start1+4])
                newstr = "".join([text_lines[x] for x in xrange(start1+5,start1+11)])
                newstr_split3 = newstr.split()
                dict3 = {}
                i_max = len(newstr_split3)-1
                for index in xrange(0,i_max,2):
            		if newstr_split3[index+1].replace('.','').isdigit():
            	    		if newstr_split3[index] == 'SNR_thresh_dB':
            					dict4 = {newstr_split3[index]:[float(newstr_split3[index+1]),float(newstr_split3[index+2]),float(newstr_split3[index+3])]}
            					elev_dict.update(dict4)
            					continue
            	    		temp = {newstr_split3[index]:float(newstr_split3[index+1])}    
            		else:
            	    		temp = {newstr_split3[index]:newstr_split3[index+1]}
            		dict3.update(temp)
                elev_dict.update(dict3)
                newstr = text_lines[start1+11]
                newstr_split4 = newstr.split()
                if newstr_split4 == []:
            		pass
                else:
            		dict4 = {newstr_split4[0]:[float(newstr_split4[1]),float(newstr_split4[2]),float(newstr_split4[3])]}
            	elev_dict.update(dict4)
                dict5 = {'#':loose2}
                elev_dict.update(dict5)
                combine = {elev_label:elev_dict}
                elev_dict_full.update(combine)
            # piece everything together
            full_elev = dict(elev_sector_full_dict,**elev_dict_full)
            full_label = {"Elev_attr":full_elev}		    
            allowable = {'allowable_prfs':[stripList(x.replace('allowable_prfs','')) for x in text_lines if 'allowable_prfs' in x]}	
	    start_attr = text_lines.index((x for x in text_lines if 'VCP_attr' in x).next())
	    end_attr = text_lines.index((x for x in text_lines if 'Elev_attr' in x).next())
            main = filter(None,"".join([text_lines[x] for x in xrange(start_attr+2,end_attr-8)]).split('\n'))
	    main_dict = {}
            for elem in main:
            	temp = elem.split()
            	if temp[1].replace('.','').isdigit():
            		temp_dict = {temp[0]:float(temp[1])}
            	else:
            		temp_dict = {temp[0]:(temp[1])}
            	main_dict.update(temp_dict)
            main_dict.update(allowable)
            sails = filter(lambda x: 'allow_sails' in x, text_lines) != []
	    if sails:
		sails_cuts = int([x.replace('allow_sails','') for x in text_lines if 'allow_sails' in x][0])
	    else:
		sails_cuts = 0
            sz2 = filter(lambda x: 'phase' in x, text_lines) != []
	    multi_helper = ""
	    if unique_elevs == 5:
	        multi_helper = ("32","31")
	    if len(elev_list) == 17:
	        multi_helper = ("212","12") 
	    avset = len(elev_list) > 8
	    multi = {'bool':unique_elevs == 5 or len(elev_list) == 17,'multi_helper':multi_helper}
	    scan_rate_sum = sum(360/float(stripList(x.replace('scan_rate_dps',''))) for x in text_lines if 'scan_rate_dps' in x)
	    update_interval = str(datetime.timedelta(seconds=int(scan_rate_sum)))[2:]
            main_dict.update({
				"vcp_num":vcp_num,
				"update_interval":update_interval,
				"unique_elevs":unique_elevs,
				"sails_cuts":sails_cuts,
				"num_split_cuts":num_split_cuts,
				"multi":multi,
				"strategies":{
						"SAILS":sails,	
						"SZ2":sz2,
						"AVSET":avset
					     }
			    })
            full = dict(main_dict, **full_label)
            # python dictionary returned 
            temp_fulldict = {vcp:full}
            complete.update(temp_fulldict)
        try:
            VCP_Desc = json.loads(open(vcp_desc).read())
	    complete.update(VCP_Desc)
        except Exception,e:
            print ("vcp desc read error")

        return LOOKUP.VCP_command_control(**complete)
##
# Parses VCP data in cfg/vcp for display -> output as .json 
##
class Parse_VCPS(object):
    def GET(self):
	user_data = web.input(VCP=None)
	fname = vcp_dir+'vcp_%s' %user_data.VCP
	try:
	    f = open(fname,'r')
	    text_lines = list(f)
	except Exception,e:
	    return json.dumps({'error':True,'msg':'%s' %e})
	# creates custom display data
        unique_elevs = len(set([x for x in text_lines if 'elev_ang_deg' in x]))
        num_split_cuts = len([x for x in text_lines if 'waveform_type' and 'CS' in x])-1
        num_batch_cuts = len([x for x in text_lines if 'waveform_type' and 'BATCH' in x])
	# identifies open and closed braces
        text_open = [x for x,i in enumerate(text_lines) if '{' in i]
        text_closed = [x for x,i in enumerate(text_lines) if '}' in i]
	# counts whitespaces to determine line indentation pattern
	indent_open = []
	for j in text_open:
	    indent_open.append((len(text_lines[j]) - len(text_lines[j].lstrip())))
	indent_closed = []
	for b in text_closed:
	    indent_closed.append((len(text_lines[b]) - len(text_lines[b].lstrip())))
	del indent_open[1]
	indent_open.append(8)
	indent_difference = [a - b for a, b in zip(indent_open,indent_closed)]
	for n,i in enumerate(indent_difference):
	    if i==-4:
		indent_difference[n]=2
	# distinguishes between Doppler cuts and Surveillance cuts (necessary as they have inherently incompatible hiearchy; Doppler cuts contain sector data)
	strtest = ''.join(str(e) for e in indent_difference)
	index_start = [idx for idx,val in enumerate(strtest) if val == '0' and strtest[idx+1] == '0' and strtest[idx+2] == '4']
        index_end = [idx+3 for idx,val in enumerate(strtest) if val == '0' and strtest[idx+1] == '0' and strtest[idx+2] == '4']
        index_start1 = [idx for idx,val in enumerate(strtest) if idx < len(strtest)-4 and val+strtest[idx+1]+strtest[idx+2]+strtest[idx+3]+strtest[idx+4] == '02004']
	
	#declarations
	elev_sector_labels = [None] * len(index_start)
	sector_dict = {}
	elev_sector_full_dict = {}
	elev_multi_list = [None] * len(index_start)
    
	# runs through Doppler cuts
	for h,val in enumerate(index_start):
	    subdict = {}
	    elev_multi_dict = {}
	    start = text_open[val] 
	    end = text_open[val+1]
	    start1 = text_open[index_end[h]]
	    newstr1 = "".join([text_lines[x] for x in xrange(start+1,end+2)])
	    newstr2 = "".join([text_lines[x] for x in xrange(start1+6,start1+8)])
	    omitstr = newstr1+newstr2
	    omitstr1 = omitstr.replace('}','').replace('Sector_1 {','')
	    newstr = filter(None,omitstr1.split('\n'))
	    substr = newstr[0]+newstr[1]
	    substr = substr.split()
	    break_length = len(substr)-1
	    for idx in xrange(0,break_length,2):
		if substr[idx+1].replace('.','').isdigit():
		    temp1 = {substr[idx]:float(substr[idx+1])}
		else:
		    temp = {substr[idx]:(substr[idx+1])}		    
	    subdict.update(temp)
	    subdict.update(temp1)
	    elev_multi_dict.update(subdict)
	    loose2 = {'#':newstr[2]}
	    elev_multi_dict.update(loose2)
   	    elev_multi_dict.update({'dop_pulses':[x for x in [stripList(x).split(' ') for x in omitstr.split('\n') if 'dop_pulses' in x][0] if x.isdigit()]})
	    elev_multi_dict.update({'SNR_thresh_dB':[x for x in [stripList(x).split(' ') for x in omitstr.split('\n') if 'dB' in x][0] if x.replace('.','',1).isdigit()]})
	    line_num1 = 0
	    line_num2 = 0
	    substr4 = newstr[3:len(newstr)]
	    for line in substr4:
		if line.find('SNR_thresh_dB') >= 0:
		    break
		line_num1+=1
	    del substr4[line_num1]
	    for line in substr4:
		if line.find('dop_pulses') >= 0:
		    break
		line_num2 +=1	
	    del substr4[line_num2]
	    substr4 = stripList(substr4)
	    substr4 = substr4.strip(',').split(',')
	    for elem in substr4:
		temp = elem.split()
		if temp == []:
		    continue
		else:
		    if str(temp).replace('.','').isdigit():
			temp_dict = {temp[0]:float(temp[1])}
		    else:
			temp_dict = {temp[0]:(temp[1])}
		elev_multi_dict.update(temp_dict)
	    newstr = "".join([text_lines[x] for x in xrange(start+1,start+28)])
	    edge_angles = [float(x.replace('edge_angle','').replace(' ','')) for x in newstr.split('\n') if 'edge_angle' in x]
            dop_prfs = [float(x.replace('dop_prf','').replace(' ','')) for x in newstr.split('\n') if 'dop_prf' in x]
            sector_labels = [x.replace(' ','').replace('{','') for x in newstr.split('\n') if 'Sector' in x]
            for idx,sector in enumerate(sector_labels):
                sector_subdict = {'edge_angle':edge_angles[idx],'dop_prf':dop_prfs[idx]}
                elev_multi_dict.update({sector_labels[idx]:sector_subdict})
	    text_lines[start] = text_lines[start].replace('{','')
	    elev_sector_label = stripList(text_lines[start])
	    elev_sector_labels[h] = elev_sector_label
	    elev_multi_list[h] = elev_multi_dict	
	for idx,val in enumerate(elev_sector_labels):
	    elev_sector_full_dict.update({val:elev_multi_list[idx]})    
	#runs through Surveillance cuts
	elev_data = []
	elev_dict_full = {}
	for p  in index_start1:
	    elev_dict = {}
	    start1 = text_open[p+1]
	    text_lines[start1] = text_lines[start1].replace('{','')
	    elev_label = stripList((text_lines[start1]))
	    newstr = "".join([text_lines[x] for x in xrange(start1+1,start1+4)])
	    newstr_split1 = newstr.split()
	    dict1 = {newstr_split1[0]:float(newstr_split1[1]),newstr_split1[2]:(newstr_split1[3])}
	    elev_dict.update(dict1)
	    loose2 = stripList(text_lines[start1+4])
	    newstr = "".join([text_lines[x] for x in xrange(start1+5,start1+11)])
	    newstr_split3 = newstr.split()
	    dict3 = {}
	    i_max = len(newstr_split3)-1
	    for index in xrange(0,i_max,2):
		if newstr_split3[index+1].replace('.','').isdigit():
		    if newstr_split3[index] == 'SNR_thresh_dB':
			dict4 = {newstr_split3[index]:[float(newstr_split3[index+1]),float(newstr_split3[index+2]),float(newstr_split3[index+3])]}
			elev_dict.update(dict4)
			continue
		    temp = {newstr_split3[index]:float(newstr_split3[index+1])}    
		else:
		    temp = {newstr_split3[index]:newstr_split3[index+1]}
		dict3.update(temp)
	    elev_dict.update(dict3)
	    newstr = text_lines[start1+11]
	    newstr_split4 = newstr.split()
	    if newstr_split4 == []:
		pass
	    else:
		dict4 = {newstr_split4[0]:[float(newstr_split4[1]),float(newstr_split4[2]),float(newstr_split4[3])]}
		elev_dict.update(dict4)
	    dict5 = {'#':loose2}
	    elev_dict.update(dict5)
	    combine = {elev_label:elev_dict}
	    elev_dict_full.update(combine)
	# piece everything together
	full_elev = dict(elev_sector_full_dict,**elev_dict_full)
	full_label = {"Elev_attr":full_elev}		    
	allowable = {'allowable_prfs':[stripList(x.replace('allowable_prfs','')) for x in text_lines if 'allowable_prfs' in x]}	
	start_attr = text_lines.index((x for x in text_lines if 'VCP_attr' in x).next())
        end_attr = text_lines.index((x for x in text_lines if 'Elev_attr' in x).next())
        main = filter(None,"".join([text_lines[x] for x in xrange(start_attr+2,end_attr-8)]).split('\n'))
	main_dict = {}
	for elem in main:
		temp = elem.split()
		if temp[1].replace('.','').isdigit():
			temp_dict = {temp[0]:float(temp[1])}
		else:
			temp_dict = {temp[0]:(temp[1])}
		main_dict.update(temp_dict)
	main_dict.update(allowable)
	main_dict.update({
				"unique_elevs":unique_elevs,
				"num_batch_cuts":num_batch_cuts,
				"num_split_cuts":num_split_cuts
			})
	full = dict(main_dict, **full_label)
	# python dictionary returned as a json string
	return json.dumps(full)

