#include <boost/python.hpp>
using boost::python::class_;
using boost::python::scope;
using boost::python::args;
using boost::python::def;
using boost::python::enum_;
extern "C"
{
    #include "orpgdat.h"
    #include "orpgsails.h"
    #include "hci.h"
}

#include "wrap_orpgdat.h"

namespace rpg
{
    
    void export_orpgdat()
    {
        class_<orpgdat_ns> c("orpgdat");
	scope in_as = c;
        in_as.attr("ORPGDAT_ADAPT_DATA") = ORPGDAT_ADAPT_DATA;
	in_as.attr("ORPGDAT_SYSLOG_LATEST") = ORPGDAT_SYSLOG_LATEST;
	in_as.attr("ORPGDAT_SYSLOG") = ORPGDAT_SYSLOG;
	in_as.attr("ORPGDAT_HCI_DATA") = ORPGDAT_HCI_DATA;
	in_as.attr("ORPGDAT_GSM_DATA") = ORPGDAT_GSM_DATA;
	in_as.attr("ORPGDAT_RPG_INFO") = ORPGDAT_RPG_INFO;
	in_as.attr("ORPGDAT_PRF_COMMAND_INFO") = ORPGDAT_PRF_COMMAND_INFO;
	in_as.attr("ORPGDAT_PRF_STATUS_MSGID") = ORPGDAT_PRF_STATUS_MSGID;
	in_as.attr("ORPGDAT_LOAD_SHED_CAT") = ORPGDAT_LOAD_SHED_CAT;
	in_as.attr("ORPGDAT_PROD_GEN_MSGS") = ORPGDAT_PROD_GEN_MSGS;
	enum_<Orpgdat_gsm_data_msg_id_t>("Orpgdat_gsm_data_msg_id_t")
	    .value("RDA_STATUS_ID", RDA_STATUS_ID)
	    .value("SAILS_STATUS_ID", SAILS_STATUS_ID)
	    .value("VOL_STAT_GSM_ID", VOL_STAT_GSM_ID)
	    .value("WX_STATUS_ID", WX_STATUS_ID)
	;
	enum_<Orpginfo_msgids_t>("Orpginfo_msgids_t")
	    .value("ORPGINFO_STATEFL_SHARED_MSGID", ORPGINFO_STATEFL_SHARED_MSGID)
	;
	enum_<Orpgdat_hci_data_msg_id_t>("Orpgdat_hci_data_msg_id_t")
	    .value("HCI_PROD_INFO_STATUS_MSG_ID", HCI_PROD_INFO_STATUS_MSG_ID)
	    .value("HCI_PRECIP_STATUS_MSG_ID", HCI_PRECIP_STATUS_MSG_ID)
	;
    }
}

