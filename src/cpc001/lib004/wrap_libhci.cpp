#include <boost/python.hpp>
using boost::python::class_;
using boost::python::def;
using boost::python::reference_existing_object;
using boost::python::return_value_policy;
using boost::python::scope;

extern "C"
{
    #include "hci_orda_pmd.h"
}

#include "wrap_libhci.h"

namespace rpg
{
    void export_libhci()
    {
        class_<libhci_ns> c("libhci");
        scope in_libhci = c;

        def(
            "hci_get_orda_pmd_ptr", 
            &hci_get_orda_pmd_ptr, 
            return_value_policy<reference_existing_object>()    // it's a static C-variable we don't manage
        );
        c.staticmethod("hci_get_orda_pmd_ptr");
    }
}

