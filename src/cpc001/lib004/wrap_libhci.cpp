#include <string>
using std::string;

#include <boost/python.hpp>
using boost::python::class_;
using boost::python::def;
using boost::python::reference_existing_object;
using boost::python::return_value_policy;
using boost::python::scope;

extern "C"
{
    #include "hci_basedata.h"
    #include "hci_environmental_wind.h"
    #include "hci_orda_pmd.h"
//#define class class_variable
//    #include "hci_up_nb.h"
//#undef class
    #include "hci_precip_status.h"
    #include "hci_wx_status.h"
    #include "hci_le.h"
    #include "hci_up_nb.h" // TODO Resolve reserved type in this header file. 'class' used as variable name in Class_details and Dial_details structs
}

#include "wrap_libhci.h"

namespace rpg
{
    /*
    int thinwrap_hci_up_nb_update_dedicated_user_table()
    
        char *throw_away = 0;

        return hci_up_nb_update_dedicated_user_table(throw_away);
    }
    */
    void export_libhci()
    {
        string doc1(
            "Retrieves the latest orda_pmd_t pointer and returns it. Python does NOT own this object!"
        ), doc2(
            "Returns the latest Wx_status_t object."
        );
        class_<libhci_ns> c("libhci");
        scope in_libhci = c;
	
        def(
            "hci_get_orda_pmd_ptr", 
            &hci_get_orda_pmd_ptr, 
            return_value_policy<reference_existing_object>()//,    // it's a static C-variable we don't manage
//            doc1
        );
        def("hci_get_wx_status", &hci_get_wx_status);
	def("hci_get_mode_a_auto_switch_flag",&hci_get_mode_A_auto_switch_flag);
        def("hci_set_mode_a_auto_switch_flag",&hci_set_mode_A_auto_switch_flag);
        def("hci_get_mode_b_auto_switch_flag",&hci_get_mode_B_auto_switch_flag);
        def("hci_set_mode_b_auto_switch_flag",&hci_set_mode_B_auto_switch_flag);
        def("hci_get_precip_status", &hci_get_precip_status);
        def("hci_get_vad_update_flag", &hci_get_vad_update_flag);
	def("hci_set_vad_update_flag", &hci_set_vad_update_flag);
        def("hci_get_model_update_flag", &hci_get_model_update_flag);
	def("hci_set_model_update_flag", &hci_set_model_update_flag);
        def("hci_get_prf_mode_status_msg", &hci_get_PRF_Mode_status_msg);
	def("hci_get_nb_connection_status",&hci_get_nb_connection_status);

        c.staticmethod("hci_get_orda_pmd_ptr");
        c.staticmethod("hci_get_wx_status");
        c.staticmethod("hci_get_precip_status");
        c.staticmethod("hci_get_vad_update_flag");
	c.staticmethod("hci_set_vad_update_flag");
        c.staticmethod("hci_get_model_update_flag");
	c.staticmethod("hci_set_model_update_flag");
        c.staticmethod("hci_get_prf_mode_status_msg");
	c.staticmethod("hci_get_mode_a_auto_switch_flag");
        c.staticmethod("hci_set_mode_a_auto_switch_flag");
        c.staticmethod("hci_get_mode_b_auto_switch_flag");
        c.staticmethod("hci_set_mode_b_auto_switch_flag");
	c.staticmethod("hci_get_nb_connection_status");
	in_libhci.attr("HCI_LE_MSG_MAX_LENGTH") = HCI_LE_MSG_MAX_LENGTH;
	scope in_nb_status = class_<nb_status_ns>("nb_status");
	    in_nb_status.attr("NB_HAS_NO_CONNECTIONS") = NB_HAS_NO_CONNECTIONS;
	    in_nb_status.attr("NB_HAS_CONNECTIONS") = NB_HAS_CONNECTIONS; 
            in_nb_status.attr("NB_HAS_FAILED_CONNECTIONS") = NB_HAS_FAILED_CONNECTIONS;
    }
}

