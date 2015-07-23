#include <string>
using std::string;

#include <boost/python.hpp>
using boost::python::class_;

extern "C"
{
#include "gen_stat_msg.h"
}

#include "wrap_gen_stat_msg.h"

namespace rpg
{
    void wrap_a305t()
    {
        //
        // just a placeholder to expose the type for now
        //

        class_<A3052t>("A3052t")
        ;
    }

    void wrap_wx_status_t()
    {
        string doc(
            "A Python wrapper for the Wx_status_t object. You can use libhci.hci_get_wx_status to retrieve this object."
        );

        class_<Wx_status_t>("Wx_status_t", doc)
            .def_readwrite(
                "current_wxstatus", 
                &Wx_status_t::current_wxstatus
            )
            .def_readwrite(
                "mode_select_adapt", 
                &Wx_status_t::mode_select_adapt
            )
        ;
    }

    void export_gen_stat_msg()
    {
        wrap_a305t();
        wrap_wx_status_t();
    }
}

