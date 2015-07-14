#include <boost/python.hpp>
using boost::python::args;
using boost::python::class_;
using boost::python::def;
using boost::python::scope;

extern "C"
{
    #include "orpgmisc.h"
}

#include "wrap_orpg_misc.h"

namespace rpg
{
    void export_orpg_misc()
    {
        scope in_orpgmisc = class_<orpgmisc_ns>("orpgmisc");
            in_orpgmisc.attr("ORPGMISC_IS_RPG_STATUS_OPER") = static_cast<int>(ORPGMISC_IS_RPG_STATUS_OPER);
            in_orpgmisc.attr("ORPGMISC_IS_RPG_STATUS_RESTART") = static_cast<int>(ORPGMISC_IS_RPG_STATUS_RESTART);
            in_orpgmisc.attr("ORPGMISC_IS_RPG_STATUS_STANDBY") = static_cast<int>(ORPGMISC_IS_RPG_STATUS_STANDBY);
            in_orpgmisc.attr("ORPGMISC_IS_RPG_STATUS_TEST") = static_cast<int>(ORPGMISC_IS_RPG_STATUS_TEST);
    }
}

