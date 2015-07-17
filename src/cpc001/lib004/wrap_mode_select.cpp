#include <boost/python.hpp>
using boost::python::class_;

extern "C"
{
    #include "mode_select.h"
}

#include "wrap_mode_select.h"

namespace rpg
{
    void export_mode_select()
    {
        class_<Mode_select_entry_t>("Mode_select_entry_t")
            .def_readwrite("auto_mode_A", &Mode_select_entry_t::auto_mode_A)
            .def_readwrite("auto_mode_B", &Mode_select_entry_t::auto_mode_B)
        ;
    }
}

