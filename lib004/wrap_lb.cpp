#include <boost/python.hpp>
using boost::python::class_;
using boost::python::scope;

extern "C"
{
    #include "lb.h"
    #include "itc.h"
    #include "rpg_port.h"
    #include "hci_le.h"
}

#include "wrap_lb.h"

namespace rpg
{
    void export_lb()
    {
        scope in_lb = class_<lb_ns>("lb");

	in_lb.attr("LB_ALL") = LB_ALL;
	in_lb.attr("LB_ANY") = LB_ANY;
	in_lb.attr("LB_NEXT") = LB_NEXT;
	in_lb.attr("LB_MSG_EXPIRED") = LB_MSG_EXPIRED;
        in_lb.attr("LB_LATEST") = LB_LATEST;
        in_lb.attr("LB_READ") = LB_READ;
        in_lb.attr("LB_WRITE") = LB_WRITE;
        in_lb.attr("LB_CREATE") = LB_CREATE;
	in_lb.attr("EWT_UPT") = static_cast<int>(EWT_UPT);
	in_lb.attr("ITC_IDRANGE") = static_cast<int>(ITC_IDRANGE);
        in_lb.attr("LBID_EWT_UPT") = static_cast<int>(LBID_EWT_UPT);


	scope in_le = class_<le_ns>("le");

	/*	RPG Alarms							*/
	in_le.attr("HCI_LE_RPG_ALARM_MASK") = static_cast<int>(HCI_LE_RPG_ALARM_MASK);
	in_le.attr("HCI_LE_RPG_ALARM_LS") = static_cast<int>(HCI_LE_RPG_ALARM_LS);
	in_le.attr("HCI_LE_RPG_ALARM_MAR") = static_cast<int>(HCI_LE_RPG_ALARM_MAR);
	in_le.attr("HCI_LE_RPG_ALARM_MAM") = static_cast<int>(HCI_LE_RPG_ALARM_MAM);
	in_le.attr("HCI_LE_RPG_ALARM_CLEAR") = static_cast<int>(HCI_LE_RPG_ALARM_CLEAR);
	/*	RPG Status							*/
	in_le.attr("HCI_LE_RPG_STATUS_MASK") = static_cast<int>(HCI_LE_RPG_STATUS_MASK);
	in_le.attr("HCI_LE_RPG_STATUS_WARN") = static_cast<int>(HCI_LE_RPG_STATUS_WARN);
	in_le.attr("HCI_LE_RPG_STATUS_GEN") = static_cast<int>(HCI_LE_RPG_STATUS_GEN);
	in_le.attr("HCI_LE_RPG_STATUS_INFO") = static_cast<int>(HCI_LE_RPG_STATUS_INFO);
	in_le.attr("HCI_LE_RPG_STATUS_COMMS") = static_cast<int>(HCI_LE_RPG_STATUS_COMMS);
	/*	RDA Alarms							*/
	in_le.attr("HCI_LE_RDA_ALARM_MASK") = static_cast<int>(HCI_LE_RDA_ALARM_MASK);
	in_le.attr("HCI_LE_RDA_ALARM_NA") = static_cast<int>(HCI_LE_RDA_ALARM_NA);
	in_le.attr("HCI_LE_RDA_ALARM_SEC") = static_cast<int>(HCI_LE_RDA_ALARM_SEC);
	in_le.attr("HCI_LE_RDA_ALARM_MAR") = static_cast<int>(HCI_LE_RDA_ALARM_MAR);
	in_le.attr("HCI_LE_RDA_ALARM_MAM") = static_cast<int>(HCI_LE_RDA_ALARM_MAM);
	in_le.attr("HCI_LE_RDA_ALARM_INOP") = static_cast<int>(HCI_LE_RDA_ALARM_INOP);
	in_le.attr("HCI_LE_RDA_ALARM_CLEAR") = static_cast<int>(HCI_LE_RDA_ALARM_CLEAR);
	/* 	Error Bit	*/
	in_le.attr("HCI_LE_ERROR_BIT") = static_cast<int>(HCI_LE_ERROR_BIT);

    }
    
}

