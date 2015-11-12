import simplejson as json
from templating import LOOKUP
import sys
import os
import web
HOME = os.getenv("HOME")
sys.path.insert(0,HOME+'/RPG-ecp0634p/src/cpc001/lib004')
sys.path.insert(0,HOME+'/lib/lnux_x86')
import _rpg
import time
import subprocess
import commands
import cgi
import datetime
import time
months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec']
main_path = '/export/home/$USER/src/cpc001/'
vcp_dir = os.environ['HOME']+'/cfg/vcp/'
DE = {'DISABLED':'off','ENABLED':'on'}
color = {'yellow':'#FCFC23','green':'#51FF22'}
SECONDS_PER_HOUR = 3600
event_holder = {}
moments = {
	    _rpg.orpgevt.RADIAL_ACCT_REFLECTIVITY:'R',
	    _rpg.orpgevt.RADIAL_ACCT_VELOCITY:'V',
	    _rpg.orpgevt.RADIAL_ACCT_WIDTH:'W',
	    _rpg.orpgevt.RADIAL_ACCT_DUALPOL:'D'
	  }

##
# Callback for event handling 
##
def callback(event, msg_data):
        msg = _rpg.orpgevt.to_orpgevt_radial_acct_t(msg_data)
        event_holder.update({
			    'radial_status':msg.radial_status,
			    'super_res':msg.super_res,
			    'moments':msg.moments,
			    'sails_seq':msg.sails_cut_seq,
			    'az':msg.azimuth,
			    'el':msg.elevation,
			    'start_az':msg.start_elev_azm,
			    'last_elev':msg.last_ele_flag

			    })
##			    
# Utility fxn defs
##
def stripList(list1):
	return str(list1).replace('[','').replace(']','').replace('\'','').strip().strip('\\n')
def hasNumbers(inputString):
	return any(char.isdigit() for char in inputString)

##
# Flag setting function
##

class Set_Flag(object):
    def POST(self):
	data = cgi.parse_qs(web.data())
	set_type = data['TYPE'][0]
	flag = int(data['FLAG'][0])
	print set_type,flag
	get_type = set_type.replace('set','get')
	get_flag = getattr(_rpg.libhci,get_type)()
	set_flag = getattr(_rpg.libhci,set_type)(flag)
	return json.dumps(set_flag)

##
# Sets number of SAILS cuts 
##
class ORPGSAILS_set(object):
    def POST(self):
	data = cgi.parse_qs(web.data())
	cuts = int(data['NUM_CUTS'][0])
	commanded_cuts = _rpg.liborpg.orpgsails_set_req_num_cuts(cuts)
	return json.dumps(commanded_cuts)

##
# Sends RDA Commands 
##
class Send_RDACOM(object):
    def POST(self):
        data = cgi.parse_qs(web.data())
        req = data['COM'][0]
	set_clear_flag = data['FLAG'][0]
	print req
	statefl = dict((str(v),k) for k,v in _rpg.liborpg.STATEFL.values.items())
	orpginfo = dict((str(v),k) for k,v in _rpg.liborpg.ORPGINFO_STATEFL.values.items())
	CRDA = {
		'RS_SUPER_RES_ENABLE':[_rpg.orpgrda.CRDA_SR_ENAB,'orpginfo_set_super_resolution_enabled'],
		'RS_SUPER_RES_DISABLE':[_rpg.orpgrda.CRDA_SR_DISAB,'orpginfo_clear_super_resolution_enabled'],
		'RS_CMD_ENABLE':[_rpg.orpgrda.CRDA_CMD_ENAB,'orpginfo_set_cmd_enabled'],
		'RS_CMD_DISABLE':[_rpg.orpgrda.CRDA_CMD_DISAB,'orpginfo_clear_cmd_enabled'],
		'RS_AVSET_DISABLE':[_rpg.orpgrda.CRDA_AVSET_DISAB,statefl['ORPGINFO_STATEFL_CLR']],
		'RS_AVSET_ENABLE':[_rpg.orpgrda.CRDA_AVSET_ENAB,statefl['ORPGINFO_STATEFL_SET']]
		}
	if set_clear_flag:
	    if req.split('_')[1] == 'AVSET':
		set_clear = _rpg.liborpg.orpginfo_statefl_flag(_rpg.liborpg.ORPGINFO_STATEFL.ORPGINFO_STATEFL_FLG_AVSET_ENABLED,CRDA[req][1])
	    else:
	        set_clear = getattr(_rpg.liborpg,CRDA[req][1])()
        commanded = _rpg.liborpg.orpgrda_send_cmd(_rpg.orpgrda.COM4_RDACOM,_rpg.orpgrda.MSF_INITIATED_RDA_CTRL_CMD,CRDA[req][0],0,0,0,0,_rpg.CharVector())
        return json.dumps(commanded)

##
# Method for retrieving RDA data 
##
def RS():
	RS_dict = {}
	RS_states = {}
	RS_list = [x for x in dir(_rpg.rdastatus) if 'RS' in x]
	for task in RS_list:
		if task == "RS_CMD" and _rpg.liborpg.orpgrda_get_status(getattr(_rpg.rdastatus,task)) >=1:
			RS_dict.update({task:1})
		else:
			RS_dict.update({task:_rpg.liborpg.orpgrda_get_status(getattr(_rpg.rdastatus,task))})
	class_list = [x for x in dir(_rpg.rdastatus) if '_' not in x]
	class_dict = dict((classname,[x for x in dir(getattr(_rpg.rdastatus,classname)) if '__' not in x]) for classname in class_list)
	for cls in class_list:
		temp = dict((getattr(getattr(_rpg.rdastatus,cls),x),x) for x in class_dict[cls])
		if cls == 'rdastatus':
			temp.update({0:'UNKNOWN'})
		if cls == 'controlstatus':
			temp.update({0:'N/A'})
		temp.update({-9999:'-9999'})
		RS_states.update({cls:temp})
	RS_states.update({'datatrans':{2:'None',4:'R',8:'V',16:'W'}})
	RS_dict.update(RS_states)
	
	oper_list = [RS_states['opstatus'][key].replace('OS_','') for key in RS_states['opstatus'].keys() if (key & RS_dict['RS_OPERABILITY_STATUS']) > 0]
	if not oper_list:
		oper_list.append('UNKNOWN')
 	aux_gen_list = [RS_states['auxgen'][key].strip('AP_').strip('RS_') for key in RS_states['auxgen'].keys() if (key & RS_dict['RS_AUX_POWER_GEN_STATE']) > 0]
	if 'GENERATOR_ON' in aux_gen_list:
		aux_gen_list.append('true')
	else:
		aux_gen_list.append('false')
	
	alarm_list = [RS_states['alarmsummary'][key].strip('AS_-9999') for key in RS_states['alarmsummary'].keys() if (key & RS_dict['RS_RDA_ALARM_SUMMARY']) > 0 or key == RS_dict['RS_RDA_ALARM_SUMMARY']]
	alarm_status = _rpg.liborpg.orpgrda_get_alarm(_rpg.liborpg.orpgrda_get_num_alarms()-1,_rpg.orpgrda.ORPGRDA_ALARM_CODE)	
	try:
	    latest_alarm_text = _rpg.liborpg.orpgrat_get_alarm_text(_rpg.liborpg.orpgrda_get_alarm(_rpg.liborpg.orpgrda_get_num_alarms()-1,_rpg.orpgrda.ORPGRDA_ALARM_ALARM))
	    yr = str(_rpg.liborpg.orpgrda_get_alarm(_rpg.liborpg.orpgrda_get_num_alarms()-1,_rpg.orpgrda.ORPGRDA_ALARM_YEAR))
	    mo = _rpg.liborpg.orpgrda_get_alarm(_rpg.liborpg.orpgrda_get_num_alarms()-1,_rpg.orpgrda.ORPGRDA_ALARM_MONTH)
	    day = _rpg.liborpg.orpgrda_get_alarm(_rpg.liborpg.orpgrda_get_num_alarms()-1,_rpg.orpgrda.ORPGRDA_ALARM_DAY)
	    hr = _rpg.liborpg.orpgrda_get_alarm(_rpg.liborpg.orpgrda_get_num_alarms()-1,_rpg.orpgrda.ORPGRDA_ALARM_HOUR)
	    min = _rpg.liborpg.orpgrda_get_alarm(_rpg.liborpg.orpgrda_get_num_alarms()-1,_rpg.orpgrda.ORPGRDA_ALARM_MINUTE)
	    sec = _rpg.liborpg.orpgrda_get_alarm(_rpg.liborpg.orpgrda_get_num_alarms()-1,_rpg.orpgrda.ORPGRDA_ALARM_SECOND)
	    latest_alarm_timestamp = months[mo-1]+' '+str(day)+','+yr[2]+yr[3]+' ['+'%02d' % hr+':'+'%02d' % min+':'+'%02d' % sec+']'
	    alarm = _rpg.liborpg.orpgda_read(_rpg.orpgdat.ORPGDAT_SYSLOG_LATEST,_rpg.libhci.HCI_LE_MSG_MAX_LENGTH,2)
            tstamp_alarm = alarm[2]+(_rpg.liborpg.rpgcs_get_time_zone()*SECONDS_PER_HOUR);
            ts = datetime.datetime(int(yr),mo,day,hr,min,sec)
            uts = time.mktime(ts.timetuple())
	    precedence = ts>tstamp_alarm
	    latest_alarm = {'precedence':precedence,'valid':1,'alarm_status':alarm_status,'timestamp':latest_alarm_timestamp,'text':latest_alarm_text}
	except:
	    latest_alarm = {'valid':0}
	radome_update = event_holder
	try:
	    moments_list = [moments[x] for x in moments.keys() if x & radome_update['moments'] > 0]
	    RS_dict.update({'moments':moments_list})
	except:
	    RS_dict.update({'moments':['False']})
        _rpg.liben.en_register(_rpg.orpgevt.ORPGEVT_RADIAL_ACCT, callback)
	lookup = dict((k,v) for k,v in _rpg.rdastatus.rdastatus_lookup.__dict__.items() if '__' not in k)
	RS_dict.update({
			'radome_update':radome_update,
			'latest_alarm':latest_alarm,
			'RDA_static':{
				'LOOKUP':{
					'RS_CMD':dict((lookup[x],DE[x.split('_')[1]]) for x in lookup.keys() if 'CMD' in x),
					'RS_AVSET':dict((lookup[x],DE[x.split('_')[1]]) for x in lookup.keys() if 'AVSET' in x),
					'RS_SUPER_RES':dict((lookup[x],DE[x.split('_')[1]]) for x in lookup.keys() if 'SR' in x)
					},
				'CONTROL_STATUS':RS_states['controlstatus'][RS_dict['RS_CONTROL_STATUS']].replace('CS_',''),
				'TPS_STATUS':RS_states['tps'][RS_dict['RS_TPS_STATUS']].strip('TP_'),
				'OPERABILITY_LIST':",".join(oper_list),
				'AUX_GEN_LIST':"<br>".join(aux_gen_list),
				'RS_RDA_ALARM_SUMMARY_LIST':"<br>".join(filter(None,alarm_list)),
				'RDA_STATE':RS_states['rdastatus'][RS_dict['RS_RDA_STATUS']].replace('RS_',''),
				'WIDEBAND':RS_states['wideband'][_rpg.liborpg.orpgrda_get_wb_status(0)].replace('RS_','')
				},
			'RDA_alarms_all':[x.replace('AS_','') for x in RS_states['alarmsummary'].values() if not x.strip('-').isdigit()]
			})
	return RS_dict
##
# Method for retrieving RPG data 
##
def RPG():
	RPG_state_list = [x for x in dir(_rpg.orpgmisc) if 'ORPGMISC' in x]
	RPG_state = [task.replace('ORPGMISC_IS_RPG_STATUS_','') for task in RPG_state_list if _rpg.liborpg.orpgmisc_is_rpg_status(getattr(_rpg.orpgmisc,task))]
	if not RPG_state:
		RPG_state.append("SHUTDOWN")
	sails_cuts = _rpg.liborpg.orpgsails_get_num_cuts()
	sails_allowed = _rpg.liborpg.orpgsails_get_num_cuts()
	precip_switch = _rpg.libhci.hci_get_mode_a_auto_switch_flag()
        clear_air_switch = _rpg.libhci.hci_get_mode_b_auto_switch_flag()	
	RPG_alarms_iter = _rpg.orpginfo.orpgalarms.values.iteritems()
	RPG_alarms = [str(v) for k,v in RPG_alarms_iter if k & _rpg.liborpg.orpginfo_statefl_get_rpgalrm()[1] > 0]  
	RPG_op_iter = _rpg.orpginfo.opstatus.values.iteritems()
	RPG_op = [str(v) for k,v in RPG_op_iter if k & _rpg.liborpg.orpginfo_statefl_get_rpgopst()[1] > 0]
	ORPGVST = time.strftime(' %H:%M:%S UT',time.gmtime(_rpg.liborpg.orpgvst_get_volume_time()/1000))
	msg = _rpg.liborpg.orpgda_read(_rpg.orpgdat.ORPGDAT_SYSLOG_LATEST,_rpg.libhci.HCI_LE_MSG_MAX_LENGTH,1)
	parse_msg = msg[1][:msg[0]-1].split(' ')
	tstamp = msg[2]
	tstamp_msg = msg[2]+(_rpg.liborpg.rpgcs_get_time_zone()*SECONDS_PER_HOUR);	
	st1 = months[int(datetime.datetime.fromtimestamp(tstamp_msg).strftime('%m'))-1]
	st2 = datetime.datetime.fromtimestamp(tstamp_msg).strftime('%-d,%y [%H:%M:%S]')
	rpg_status = st1+' '+st2+' >> '+" ".join([x for x in parse_msg if '\\x' not in repr(x)]).replace('\n','');
	alarm = _rpg.liborpg.orpgda_read(_rpg.orpgdat.ORPGDAT_SYSLOG_LATEST,_rpg.libhci.HCI_LE_MSG_MAX_LENGTH,2)
	parse_alarm = alarm[1][:alarm[0]-1].split(' ')
        alarm_final = [x for x in parse_alarm if '\\x' not in repr(x)]
	alarm_state = {'cleared':'CLEARED' in alarm_final,'activated':'ACTIVATED' in alarm_final}
	tstamp_alarm = alarm[2]+(_rpg.liborpg.rpgcs_get_time_zone()*SECONDS_PER_HOUR);
        at1 = months[int(datetime.datetime.fromtimestamp(tstamp_alarm).strftime('%m'))-1]
        at2 = datetime.datetime.fromtimestamp(tstamp_alarm).strftime('%-d,%y [%H:%M:%S]')
	if not alarm_final:	
	    rpg_alarm_suppl = ''
	else:
	    rpg_alarm_suppl = at1+' '+at2+' >> '+" ".join(alarm_final).replace('\n','');
	category_dict = dict((str(v),k) for k,v in _rpg.liborpg.LOAD_SHED_CATEGORY.values.items())
	type_dict = dict((str(v),k) for k,v in _rpg.liborpg.LOAD_SHED_TYPE.values.items())
	loadshed_dict = {}
	loadshed = {}
	for c in category_dict:
	    temp = {}
	    for t in type_dict:
		temp.update({t:_rpg.liborpg.orpgload_get_data(category_dict[c],type_dict[t])[1]})
	    loadshed_dict.update({c:temp})
	for cat in loadshed_dict:
	    if(loadshed_dict[cat]['LOAD_SHED_CURRENT_VALUE'] >=loadshed_dict[cat]['LOAD_SHED_WARNING_THRESHOLD']):
	        loadshed[cat] = 'WARNING'
            elif(loadshed_dict[cat]['LOAD_SHED_CURRENT_VALUE'] >=loadshed_dict[cat]['LOAD_SHED_ALARM_THRESHOLD']):
                loadshed[cat] = 'ALARM'
            else:
                loadshed[cat] = 'NONE'
	nb = _rpg.libhci.hci_get_nb_connection_status()
	nb_dict = dict((v,k) for k,v in _rpg.libhci.nb_status.__dict__.items() if '__' not in k)

	return {
		'sails_allowed':sails_allowed,
		'sails_cuts':sails_cuts,
		'ORPGVST':ORPGVST,
		'RPG_state':",".join(RPG_state),
		'RPG_AVSET':_rpg.liborpg.orpginfo_is_avset_enabled(),
		'RPG_SAILS':_rpg.liborpg.orpginfo_is_sails_enabled(),
		'RPG_alarms':",".join(RPG_alarms).replace('ORPGINFO_STATEFL_RPGALRM_',''),
		'RPG_alarm_suppl':rpg_alarm_suppl,
		'alarm_state':alarm_state,
		'RPG_op':",".join(RPG_op).replace('ORPGINFO_STATEFL_RPGOPST_',''),
		'RPG_status':rpg_status,
		'RPG_status_ts':tstamp,
		'mode_A_auto_switch':precip_switch,
		'mode_B_auto_switch':clear_air_switch,
	 	'loadshed':loadshed,
	  	'narrowband':nb_dict[nb]
	}
##
# Method for retrieving Performance/ Maintenance Data
##	
def PMD():
	model_flag = _rpg.libhci.hci_get_model_update_flag()
	vad_flag = _rpg.libhci.hci_get_vad_update_flag()
	prf = _rpg.libhci.hci_get_prf_mode_status_msg().state
	precip = _rpg.libhci.hci_get_precip_status().current_precip_status
	pmd = _rpg.libhci.hci_get_orda_pmd_ptr().pmd
	wx = _rpg.libhci.hci_get_wx_status().mode_select_adapt
	
	if int(time.strftime('%H',time.gmtime(pmd.perf_check_time-int(time.time())))) < 1:
		perf_color = color['yellow']
	else: 
		perf_color = 'white'
	prf_dict = dict((_rpg.Prf_status_t.__dict__[x],x.replace('PRF_COMMAND_','')) for x in _rpg.Prf_status_t.__dict__ if 'PRF_COMMAND' in x)
	mode_conflict = (_rpg.libhci.hci_get_wx_status().current_wxstatus != _rpg.libhci.hci_get_wx_status().recommended_wxstatus)
	mode_trans = _rpg.libhci.hci_get_wx_status().wxstatus_deselect
	return {
		"Model_Update":model_flag,
		"VAD_Update":vad_flag,
		"prf":prf_dict[prf],
		"mode_conflict":mode_conflict,
		"mode_trans":mode_trans,
		"current_precip_status":precip,	
		"cnvrtd_gnrtr_fuel_lvl":pmd.cnvrtd_gnrtr_fuel_lvl,
		"perf_check_time":[time.strftime('%Hh %Mm %Ss',time.gmtime(pmd.perf_check_time-int(time.time()))),perf_color],
		"trsmttr_leaving_air_temp":int(pmd.trsmttr_leaving_air_temp),
		"xmtr_peak_pwr":int(pmd.xmtr_peak_pwr),
		'v_delta_dbz0':'%0.2f' % pmd.v_delta_dbz0,
		'h_delta_dbz0':'%0.2f' % pmd.h_delta_dbz0,
		"precip_mode_area_thresh":wx.precip_mode_area_thresh,
		"precip_mode_zthresh":wx.precip_mode_zthresh
	}
##
# Method for retrieving Adaptation Data
##
def ADAPT():
	sails_available = _rpg.librpg.deau_get_values('sails.sails_available',1)
	ICAO = _rpg.librpg.deau_get_string_values('site_info.rpg_name')
	zr_mult = _rpg.librpg.deau_get_values('alg.hydromet_rate.zr_mult', 1)
	zr_exp = _rpg.librpg.deau_get_values('alg.hydromet_rate.zr_exp', 1)
	isdp = _rpg.librpg.deau_get_values('alg.dpprep.isdp_apply',1)
	version = _rpg.librpg.deau_get_values('alg.Archive_II.version',1)
	default_dir = _rpg.librpg.deau_get_values('alg.storm_cell_track.default_dir',1)
        default_spd = _rpg.librpg.deau_get_values('alg.storm_cell_track.default_spd',1)
	ptype = _rpg.librpg.deau_get_string_values('alg.dp_precip.Precip_type') 
	return {'ICAO':ICAO[1],'ZR_mult':zr_mult[1][0],'ISDP':isdp[1][0],'ZR_exp':zr_exp[1][0],'version':version[1][0],'default_spd':default_spd[1][0],'default_dir':default_dir[1][0],'ptype':ptype[1]}
##
# Method for retrieving VCP Configuration Data
##
def CFG():
	allow_sails = {}
        last_elev = {}
        super_res = {}
        dir_list_parse = [x for x in os.listdir(vcp_dir) if x.split('_')[0] == 'vcp']
        for vcp in dir_list_parse:
            fname = vcp_dir+vcp
            try:
                f = open(fname,'r')
                text_lines = list(f)
            except:
                pass
	    if [x for x in text_lines if 'allow_sails' in x]:            
                temp = {vcp.replace('vcp_',''):1}
            else:
                temp = {vcp.replace('vcp_',''):0}
            allow_sails.update(temp)
	    max_sails = _rpg.liborpg.orpgsails_get_site_max_cuts()
            temp = max([float(x.replace('elev_ang_deg','').replace("\n",'').replace(' ','')) for x in text_lines if 'elev_ang_deg' in x])
            last_elev.update({vcp.replace('vcp_',''):temp})
            temp = dict((x.replace('\n','').replace('elev_ang_deg','').replace(' ','').replace('{',''),text_lines[text_lines.index(x)+3].replace('super_res','').replace('\n','').replace(' ','')) for x in text_lines if 'elev_ang_deg' in x)
            super_res.update({vcp.replace('vcp_',''):temp})
	CFG_dict = {
		    'max_sails':max_sails,
		    'allow_sails':allow_sails,
		    'last_elev':last_elev,
		    'super_res':super_res
		    }
	return CFG_dict 
##
# Renders the main HCI 
##
class IndexView(object):
    def GET(self):
        return LOOKUP.IndexView(**{'CFG_dict':CFG()})
##
# Refreshes the data in the HCI 
##
class Updater(object):
    def GET(self):
	return json.dumps({'PMD_dict':PMD(),'RS_dict':RS(),'RPG_dict':RPG(),'ADAPT':ADAPT()})
##
# Operations Sub-Menu
##
class Operations(object):
    def GET(self):
	return LOOKUP.ops(**{'PMD_dict':PMD(),'RS_dict':RS(),'RPG_dict':RPG(),'CFG_dict':CFG()})
##
# Spawns subtasks
##
class Button(object):
    def GET(self):
	selected_button = web.input(id=None)
	if selected_button.id not in commands.getoutput('ps -A'):
	    return subprocess.Popen(selected_button.id).wait()

