#include <boost/python.hpp>
using boost::python::class_;
using boost::python::scope;

#include "wrap_rda_status.h"

extern "C"
{
    #include "rda_status.h"
}

namespace rpg
{
    void export_rda_status()
    {
        scope in_rdastatus = class_<rdastatus_ns>("rdastatus");
            in_rdastatus.attr("RS_RDA_STATUS") = RS_RDA_STATUS;
            in_rdastatus.attr("RS_OPERABILITY_STATUS") = RS_OPERABILITY_STATUS;
            in_rdastatus.attr("RS_CONTROL_STATUS") = RS_CONTROL_STATUS;
            in_rdastatus.attr("RS_AUX_POWER_GEN_STATE") = RS_AUX_POWER_GEN_STATE;
            in_rdastatus.attr("RS_AVE_TRANS_POWER") = RS_AVE_TRANS_POWER;
            in_rdastatus.attr("RS_REFL_CALIB_CORRECTION") = RS_REFL_CALIB_CORRECTION;
            in_rdastatus.attr("RS_DATA_TRANS_ENABLED") = RS_DATA_TRANS_ENABLED;
            in_rdastatus.attr("RS_VCP_NUMBER") = RS_VCP_NUMBER;
            in_rdastatus.attr("RS_RDA_CONTROL_AUTH") = RS_RDA_CONTROL_AUTH;
            in_rdastatus.attr("RS_RDA_BUILD_NUM") = RS_RDA_BUILD_NUM;
            in_rdastatus.attr("RS_OPERATIONAL_MODE") = RS_OPERATIONAL_MODE;
            in_rdastatus.attr("RS_SUPER_RES") = RS_SUPER_RES;
            in_rdastatus.attr("RS_CMD") = RS_CMD;
            in_rdastatus.attr("RS_AVSET") = RS_AVSET;
            in_rdastatus.attr("RS_RDA_ALARM_SUMMARY") = RS_RDA_ALARM_SUMMARY;
            in_rdastatus.attr("RS_TPS_STATUS") = RS_TPS_STATUS;
            in_rdastatus.attr("RS_RMS_CONTROL_STATUS") = RS_RMS_CONTROL_STATUS;
            in_rdastatus.attr("RS_PERF_CHECK_STATUS") = RS_PERF_CHECK_STATUS;
        ;
	//
	// lookup values for rdastatus
	//


	{
            scope in_rdastatus_lookup = class_<rdastatus_lookup_ns>("rdastatus_lookup");
            in_rdastatus_lookup.attr("CMD_ENABLED") = CMD_ENABLED;
            in_rdastatus_lookup.attr("CMD_DISABLED") = CMD_DISABLED;
            in_rdastatus_lookup.attr("AVSET_ENABLED") = AVSET_ENABLED;
            in_rdastatus_lookup.attr("AVSET_DISABLED") = AVSET_DISABLED;
            in_rdastatus_lookup.attr("SR_ENABLED") = SR_ENABLED;
            in_rdastatus_lookup.attr("SR_DISABLED") = SR_DISABLED;
	}


        //
        // wideband status line values
        //

        {
            scope in_wideband = class_<wideband_ns>("wideband");
            in_wideband.attr("RS_NOT_IMPLEMENTED") = RS_NOT_IMPLEMENTED;
            in_wideband.attr("RS_CONNECT_PENDING") = RS_CONNECT_PENDING;
            in_wideband.attr("RS_DISCONNECT_PENDING") = RS_DISCONNECT_PENDING;
            in_wideband.attr("RS_DISCONNECTED_HCI") = RS_DISCONNECTED_HCI;
            in_wideband.attr("RS_DISCONNECTED_CM") = RS_DISCONNECTED_CM;
            in_wideband.attr("RS_DISCONNECTED_SHUTDOWN") = RS_DISCONNECTED_SHUTDOWN;
            in_wideband.attr("RS_CONNECTED") = RS_CONNECTED;
            in_wideband.attr("RS_DOWN") = RS_DOWN;
            in_wideband.attr("RS_WBFAILURE") = RS_WBFAILURE;
            in_wideband.attr("RS_DISCONNECTED_RMS") = RS_DISCONNECTED_RMS;
        }

        //
        // command ack status values
        //
	{
	    scope in_acknowledge = class_<acknowledge_ns>("acknowledge");
            in_rdastatus.attr("RS_NO_ACKNOWLEDGEMENT") = RS_NO_ACKNOWLEDGEMENT;
            in_rdastatus.attr("RS_REMOVE_VCP_RECEIVED") = RS_REMOTE_VCP_RECEIVED;
            in_rdastatus.attr("RS_CLUTTER_BYPASS_MAP_RECEIVED") = RS_CLUTTER_BYPASS_MAP_RECEIVED;
            in_rdastatus.attr("RS_CLUTTER_CENSOR_ZONES_RECEIVED") = RS_CLUTTER_CENSOR_ZONES_RECEIVED;
            in_rdastatus.attr("RS_REDUND_CHNL_STBY_CMD_ACCEPTED") = RS_REDUND_CHNL_STBY_CMD_ACCEPTED;
	}
        //
        // RDA status states
        //
        
        {
            scope in_rdastatus2 = class_<rdastatus2_ns>("rdastatus");
            in_rdastatus2.attr("RS_STARTUP") = RS_STARTUP;
            in_rdastatus2.attr("RS_STANDBY") = RS_STANDBY;
            in_rdastatus2.attr("RS_RESTART") = RS_RESTART;
            in_rdastatus2.attr("RS_OPERATE") = RS_OPERATE;
            in_rdastatus2.attr("RS_OFFOPER") = RS_OFFOPER;
        }

        //
        // RDA operability status
        //

        {
            scope in_opstatus = class_<opstatus_ns>("opstatus");
            in_opstatus.attr("OS_INDETERMINATE") = OS_INDETERMINATE;
            in_opstatus.attr("OS_ONLINE") = OS_ONLINE;
            in_opstatus.attr("OS_MAINTENANCE_REQ") = OS_MAINTENANCE_REQ;
            in_opstatus.attr("OS_MAINTENANCE_MAN") = OS_MAINTENANCE_MAN;
            in_opstatus.attr("OS_COMMANDED_SHUTDOWN") = OS_COMMANDED_SHUTDOWN;
            in_opstatus.attr("OS_INOPERABLE") = OS_INOPERABLE;
            in_opstatus.attr("OS_WIDEBAND_DISCONNECT") = OS_WIDEBAND_DISCONNECT;
        }

        //
        // RDA control status
        //

        {
            scope in_cs = class_<controlstatus_ns>("controlstatus");
            in_cs.attr("CS_LOCAL_ONLY") = CS_LOCAL_ONLY;
            in_cs.attr("CS_RPG_REMOTE") = CS_RPG_REMOTE;
            in_cs.attr("CS_EITHER") = CS_EITHER;
        }

        //
        // RDA aux/gen status
        //

        {
            scope in_auxgen = class_<auxgen_ns>("auxgen");
            in_auxgen.attr("RS_COMMANDED_SWITCHOVER") = RS_COMMANDED_SWITCHOVER;
            in_auxgen.attr("AP_UTILITY_PWR_AVAIL") = AP_UTILITY_PWR_AVAIL;
            in_auxgen.attr("AP_GENERATOR_ON") = AP_GENERATOR_ON;
            in_auxgen.attr("AP_TRANS_SWITCH_MAN") = AP_TRANS_SWITCH_MAN;
            in_auxgen.attr("AP_COMMAND_SWITCHOVER") = AP_COMMAND_SWITCHOVER;
            in_auxgen.attr("AP_SWITCH_AUX_PWR") = AP_SWITCH_AUX_PWR;
        }

        //
        // TPS status
        //

        {
            scope in_tps = class_<tps_ns>("tps");
            in_tps.attr("TP_NOT_INSTALLED") = TP_NOT_INSTALLED;
            in_tps.attr("TP_OFF") = TP_OFF;
            in_tps.attr("TP_OK") = TP_OK;
        }

        //
        // alarm summary
        //

        {
            scope in_as = class_<alarmsummary_ns>("alarmsummary");
            in_as.attr("AS_NO_ALARMS") = AS_NO_ALARMS;
            in_as.attr("AS_TOW_UTIL") = AS_TOW_UTIL;
            in_as.attr("AS_PEDESTAL") = AS_PEDESTAL;
            in_as.attr("AS_TRANSMITTER") = AS_TRANSMITTER;
            in_as.attr("AS_RECV") = AS_RECV;
            in_as.attr("AS_RDA_CONTROL") = AS_RDA_CONTROL;
            in_as.attr("AS_RPG_COMMUN") = AS_RPG_COMMUN;
            in_as.attr("AS_SIGPROC") = AS_SIGPROC;
        }
    }
}

