#include <boost/python.hpp>
using boost::python::class_;
using boost::python::scope;

#include "wrap_rpg_rda.h"

extern "C"
{
    #include "orpgrda.h"
    #include "rda_control.h"
}

namespace rpg
{
    void export_rpg_rda()
    {
        scope in_orpgrda = class_<orpgrda_ns>("orpgrda");
            in_orpgrda.attr("COM4_LBTEST_RDAtoRPG") = COM4_LBTEST_RDAtoRPG;
            in_orpgrda.attr("COM4_LBTEST") = COM4_LBTEST;
            in_orpgrda.attr("COM4_WBMSG") = COM4_WBMSG;
            in_orpgrda.attr("COM4_WBDISABLE") = COM4_WBDISABLE;
            in_orpgrda.attr("COM4_WMVCPCHG") = COM4_WMVCPCHG;
            in_orpgrda.attr("COM4_RDACOM") = COM4_RDACOM;
            in_orpgrda.attr("COM4_REQRDADATA") = COM4_REQRDADATA;
            in_orpgrda.attr("COM4_DLOADVCP") = COM4_DLOADVCP;
            in_orpgrda.attr("COM4_SENDEDCLBY") = COM4_SENDEDCLBY;
            in_orpgrda.attr("COM4_SENDCLCZ") = COM4_SENDCLCZ;
            in_orpgrda.attr("COM4_SB_ENAB") = COM4_SB_ENAB;
            in_orpgrda.attr("COM4_SB_DIS") = COM4_SB_DIS;
            in_orpgrda.attr("COM4_VEL_RESO") = COM4_VEL_RESO;
            in_orpgrda.attr("COM4_HEARTBEATLB") = COM4_HEARTBEATLB;
            in_orpgrda.attr("COM4_PBD_TEST") = COM4_PBD_TEST;
            in_orpgrda.attr("ORPGRDA_DATA_NOT_FOUND") = ORPGRDA_DATA_NOT_FOUND;


            //
            // RDA Command Codes 
            //
    
            in_orpgrda.attr("CRDA_SR_ENAB") = CRDA_SR_ENAB;
	    in_orpgrda.attr("CRDA_SR_DISAB") = CRDA_SR_DISAB;
	    in_orpgrda.attr("CRDA_CMD_ENAB") = CRDA_CMD_ENAB;
	    in_orpgrda.attr("CRDA_CMD_DISAB") = CRDA_CMD_DISAB;
	    in_orpgrda.attr("CRDA_AVSET_ENAB") = CRDA_AVSET_ENAB;
	    in_orpgrda.attr("CRDA_AVSET_DISAB") = CRDA_AVSET_DISAB;
	    in_orpgrda.attr("CRDA_RESTART_VCP") = CRDA_RESTART_VCP;
	    in_orpgrda.attr("CRDA_SELECT_VCP") = CRDA_SELECT_VCP;
	    in_orpgrda.attr("CRDA_STANDBY") = CRDA_STANDBY;
	    in_orpgrda.attr("CRDA_OFFOPER") = CRDA_OFFOPER;
	    in_orpgrda.attr("CRDA_OPERATE") = CRDA_OPERATE;
	    in_orpgrda.attr("CRDA_RESTART") = CRDA_RESTART;
	    in_orpgrda.attr("CRDA_REREMOTE") = CRDA_REQREMOTE;
	    in_orpgrda.attr("CRDA_ENALOCAL") = CRDA_ENALOCAL;
	    in_orpgrda.attr("CRDA_PERF_CHECK") = CRDA_PERF_CHECK;
	    in_orpgrda.attr("CRDA_UTIL") = CRDA_UTIL;
	    in_orpgrda.attr("CRDA_AUXGEN") = CRDA_AUXGEN;	   
 
	    //
   	    // originators of RDA Commands
   	    //

	    in_orpgrda.attr("HCI_INITIATED_RDA_CTRL_CMD") = HCI_INITIATED_RDA_CTRL_CMD;


	    in_orpgrda.attr("HCI_VCP_INITIATED_RDA_CTRL_CMD") = HCI_VCP_INITIATED_RDA_CTRL_CMD;

            //
            // Velocity Resolution codes
            //

            in_orpgrda.attr("CRDA_VEL_RESO_LOW") = CRDA_VEL_RESO_LOW;
            in_orpgrda.attr("CRDA_VEL_RESO_HIGH") = CRDA_VEL_RESO_HIGH;

 	    //
 	    // RDA Data Request Types		
 	    //
            
	    in_orpgrda.attr("DREQ_STATUS") = DREQ_STATUS;
	    in_orpgrda.attr("DREQ_PERFMAINT") = DREQ_PERFMAINT;

            //
            // alarm elements
            //

            in_orpgrda.attr("ORPGRDA_ALARM_MONTH") = static_cast<int>(ORPGRDA_ALARM_MONTH);
            in_orpgrda.attr("ORPGRDA_ALARM_DAY") = static_cast<int>(ORPGRDA_ALARM_DAY);
            in_orpgrda.attr("ORPGRDA_ALARM_YEAR") = static_cast<int>(ORPGRDA_ALARM_YEAR);
            in_orpgrda.attr("ORPGRDA_ALARM_HOUR") = static_cast<int>(ORPGRDA_ALARM_HOUR);
            in_orpgrda.attr("ORPGRDA_ALARM_MINUTE") = static_cast<int>(ORPGRDA_ALARM_MINUTE);
            in_orpgrda.attr("ORPGRDA_ALARM_SECOND") = static_cast<int>(ORPGRDA_ALARM_SECOND);
            in_orpgrda.attr("ORPGRDA_ALARM_CODE") = static_cast<int>(ORPGRDA_ALARM_CODE);
            in_orpgrda.attr("ORPGRDA_ALARM_ALARM") = static_cast<int>(ORPGRDA_ALARM_ALARM);
            in_orpgrda.attr("ORPGRDA_ALARM_CHANNEL") = static_cast<int>(ORPGRDA_ALARM_CHANNEL);
            //
            //	Wideband Status
            //
	    in_orpgrda.attr("ORPGRDA_WBLNSTAT") = ORPGRDA_WBLNSTAT;
            in_orpgrda.attr("ORPGRDA_DISPLAY_BLANKING") = ORPGRDA_DISPLAY_BLANKING;
            in_orpgrda.attr("ORPGRDA_WBFAILED") = ORPGRDA_WBFAILED;
 


    }
}

