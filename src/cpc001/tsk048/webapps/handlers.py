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
months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec']
vcp_dir = os.environ['HOME']+'/cfg/vcp/'
event_holder = {}
moments = {
            _rpg.orpgevt.RADIAL_ACCT_REFLECTIVITY:'R',
            _rpg.orpgevt.RADIAL_ACCT_VELOCITY:'V',
            _rpg.orpgevt.RADIAL_ACCT_WIDTH:'W',
            _rpg.orpgevt.RADIAL_ACCT_DUALPOL:'D'
          }

##
# Utility fxn defs
##
def stripList(list1):
	return str(list1).replace('[','').replace(']','').replace('\'','').strip().strip('\\n')
def hasNumbers(inputString):
	return any(char.isdigit() for char in inputString)
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
	RS_dict.update(RS_states)
	
	oper_list = [RS_states['opstatus'][key].replace('OS_','') for key in RS_states['opstatus'].keys() if (key & RS_dict['RS_OPERABILITY_STATUS']) > 0]
	if not oper_list:
		oper_list.append('UNKNOWN')
 	aux_gen_list = [RS_states['auxgen'][key].strip('AP_').strip('RS_') for key in RS_states['auxgen'].keys() if (key & RS_dict['RS_AUX_POWER_GEN_STATE']) > 0]
	if 'GENERATOR_ON' in aux_gen_list:
		aux_gen_list.append('true')
	else:
		aux_gen_list.append('false')
	data_trans = [RS_states['datatrans'][key] for key in RS_states['datatrans'].keys() if (key & RS_dict['RS_DATA_TRANS_ENABLED']) > 0]
	
	alarm_list = [RS_states['alarmsummary'][key].strip('AS_-9999') for key in RS_states['alarmsummary'].keys() if (key & RS_dict['RS_RDA_ALARM_SUMMARY']) > 0 or key == RS_dict['RS_RDA_ALARM_SUMMARY']]
	alarm_status = _rpg.liborpg.orpgrda_get_alarm(_rpg.liborpg.orpgrda_get_num_alarms()-1,_rpg.orpgrda.ORPGRDA_ALARM_CODE)	
	lookup = dict((k,v) for k,v in _rpg.rdastatus.rdastatus_lookup.__dict__.items() if '__' not in k)
	RS_dict.update({
			'RDA_static':{
					'LOOKUP':{
                                        	'RS_CMD':dict((lookup[x],x.split('_')[1]) for x in lookup.keys() if 'CMD' in x), 
                                        	'RS_AVSET':dict((lookup[x],x.split('_')[1]) for x in lookup.keys() if 'AVSET' in x),
                                        	'RS_SUPER_RES':dict((lookup[x],x.split('_')[1]) for x in lookup.keys() if 'SR' in x)
                                        	},
					'DATA_TRANS':data_trans,
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
	precip_switch = _rpg.libhci.hci_get_wx_status().mode_select_adapt.auto_mode_A
        clear_air_switch = _rpg.libhci.hci_get_wx_status().mode_select_adapt.auto_mode_B	
	RPG_alarms_iter = _rpg.orpginfo.orpgalarms.values.iteritems()
	RPG_alarms = [str(v) for k,v in RPG_alarms_iter if k & _rpg.liborpg.orpginfo_statefl_get_rpgalrm()[1] > 0]  
	RPG_op_iter = _rpg.orpginfo.opstatus.values.iteritems()
	RPG_op = [str(v) for k,v in RPG_op_iter if k & _rpg.liborpg.orpginfo_statefl_get_rpgopst()[1] > 0]
	ORPGVST = time.strftime(' %H:%M:%S UT',time.gmtime(_rpg.liborpg.orpgvst_get_volume_time()/1000))
	return {
		'sails_cuts':sails_cuts,
		'RPG_state':",".join(RPG_state),
		'RPG_AVSET':_rpg.liborpg.orpginfo_is_avset_enabled(),
		'RPG_SAILS':_rpg.liborpg.orpginfo_is_sails_enabled(),
		'RPG_alarms':",".join(RPG_alarms).replace('ORPGINFO_STATEFL_RPGALRM_',''),
		'RPG_op':",".join(RPG_op).replace('ORPGINFO_STATEFL_RPGOPST_',''),
		'Precip_Switch':precip_switch,
		'Clear_Air_Switch':clear_air_switch
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
	prf_dict = dict((_rpg.Prf_status_t.__dict__[x],x.replace('PRF_COMMAND_','')) for x in _rpg.Prf_status_t.__dict__ if 'PRF_COMMAND' in x)
	mode_conflict = (_rpg.libhci.hci_get_wx_status().current_wxstatus != _rpg.libhci.hci_get_wx_status().recommended_wxstatus)	
	sb_dict = dict((v,k) for k,v in _rpg.rdastatus.sb.__dict__.items() if '__' not in k)
	sb = _rpg.liborpg.orpgrda_get_status(_rpg.rdastatus.RS_SPOT_BLANKING_STATUS)
	return {
		"Model_Update":model_flag,
		"VAD_Update":vad_flag,
		"prf":prf_dict[prf],
		"mode_conflict":mode_conflict,
		"current_precip_status":precip,
		"cnvrtd_gnrtr_fuel_lvl":pmd.cnvrtd_gnrtr_fuel_lvl,
		"perf_check_time":time.strftime('%Hh %Mm %Ss',time.gmtime(pmd.perf_check_time-int(time.time()))),
		"trsmttr_leaving_air_temp":int(pmd.trsmttr_leaving_air_temp),
		"xmtr_peak_pwr":int(pmd.xmtr_peak_pwr),
		'v_delta_dbz0':'%0.2f' % pmd.v_delta_dbz0,
		'h_delta_dbz0':'%0.2f' % pmd.h_delta_dbz0,
		"precip_mode_area_thresh":wx.precip_mode_area_thresh,
		"precip_mode_zthresh":wx.precip_mode_zthresh,
	  	"spot_blanking":sb_dict[sb]
		}
##
# Method for retrieving Adaptation Data
##
def ADAPT():
	zr_mult = _rpg.librpg.deau_get_values('alg.hydromet_rate.zr_mult', 1)
	zr_exp = _rpg.librpg.deau_get_values('alg.hydromet_rate.zr_exp', 1)
	isdp = _rpg.librpg.deau_get_values('alg.dpprep.isdp_apply',1)
	version = _rpg.librpg.deau_get_values('alg.Archive_II.version',1)
	default_dir = _rpg.librpg.deau_get_values('alg.storm_cell_track.default_dir',1)
        default_spd = _rpg.librpg.deau_get_values('alg.storm_cell_track.default_spd',1)
	ptype = _rpg.librpg.deau_get_string_values('alg.dp_precip.Precip_type') 
	return {
		'ZR_mult':zr_mult[1][0],
		'ISDP':isdp[1][0],
		'ZR_exp':zr_exp[1][0],
		'version':version[1][0],
		'default_spd':default_spd[1][0],	
		'default_dir':default_dir[1][0],
		'ptype':ptype[1]
		}
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
            if 'allow_sails' in text_lines:
                temp = {vcp.replace('vcp_',''):1}
            else:
                temp = {vcp.replace('vcp_',''):0}
            allow_sails.update(temp)
            temp = max([float(x.replace('elev_ang_deg','').replace("\n",'').replace(' ','')) for x in text_lines if 'elev_ang_deg' in x])
            last_elev.update({vcp.replace('vcp_',''):temp})
            temp = dict((x.replace('\n','').replace('elev_ang_deg','').replace(' ','').replace('{',''),text_lines[text_lines.index(x)+3].replace('super_res','').replace('\n','').replace(' ','')) for x in text_lines if 'elev_ang_deg' in x)
            super_res.update({vcp.replace('vcp_',''):temp})
	CFG_dict = {
			'allow_sails':allow_sails,
			'last_elev':last_elev,
			'super_res':super_res
		   }
	return CFG_dict 
##
# Renders the Shift Change Checklist 
##	
class Shift_change_checklist(object):
    def GET(self):
        return LOOKUP.Shift_change_check(**{
						'PMD_dict':PMD(),
						'RS_dict':RS(),
						'RPG_dict':RPG(),
						'ADAPT':ADAPT()
					   })


