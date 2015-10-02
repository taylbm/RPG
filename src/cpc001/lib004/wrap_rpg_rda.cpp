#include <boost/python.hpp>
using boost::python::class_;
using boost::python::scope;

#include "wrap_rpg_rda.h"

extern "C"
{
    #include "orpgrda.h"
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
    }
}

