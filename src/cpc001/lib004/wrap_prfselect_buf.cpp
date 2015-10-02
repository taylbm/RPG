#include <boost/python.hpp>
using boost::python::class_;
using boost::python::scope;

extern "C"
{
    #include "prfselect_buf.h"
}

#include "wrap_prfselect_buf.h"

namespace rpg
{
    void wrap_prf_status_t()
    {
        scope in_prf_status = class_<Prf_status_t>("Prf_status_t")
            .def_readwrite("state", &Prf_status_t::state);
        ;

        in_prf_status.attr("PRF_COMMAND_UNKNOWN") = PRF_COMMAND_UNKNOWN;
        in_prf_status.attr("PRF_COMMAND_MANUAL_PRF") = PRF_COMMAND_MANUAL_PRF;
        in_prf_status.attr("PRF_COMMAND_AUTO_PRF") = PRF_COMMAND_AUTO_PRF;
        in_prf_status.attr("PRF_COMMAND_STORM_BASED") = PRF_COMMAND_STORM_BASED;
        in_prf_status.attr("PRF_COMMAND_CELL_BASED") = PRF_COMMAND_CELL_BASED;
    }

    void export_prfselect_buf()
    {
        wrap_prf_status_t();
    }
}

