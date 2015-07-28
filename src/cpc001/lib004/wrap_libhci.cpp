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
    #include "hci_orda_pmd.h"
//#define class class_variable
//    #include "hci_up_nb.h"
//#undef class
    #include "hci_wx_status.h"
}

#include "wrap_libhci.h"

namespace rpg
{
    /*
    int thinwrap_hci_up_nb_update_dedicated_user_table()
    {
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
        //def("hci_get_wx_status", &hci_get_wx_status, doc2);
        def("hci_get_wx_status", &hci_get_wx_status);
        /*
        def(
            "hci_up_nb_update_dedicated_user_table", 
            &thinwrap_hci_up_nb_update_dedicated_user_table
        );
        */

        c.staticmethod("hci_get_orda_pmd_ptr");
        c.staticmethod("hci_get_wx_status");
        //c.staticmethod("hci_up_nb_update_dedicated_user_table");
    }
}

