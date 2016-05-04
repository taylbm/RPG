#include <boost/python.hpp>
using boost::python::class_;
using boost::python::scope;

extern "C"
{
    #include "orpgsails.h"
}

#include "wrap_orpg_sails.h"

namespace rpg
{
    void export_orpgsails()
    {
        scope in_orpgsails = class_<orpgsails_ns>("orpgsails");
            in_orpgsails.attr("GS_SAILS_DISABLED") = GS_SAILS_DISABLED;
            in_orpgsails.attr("GS_SAILS_INACTIVE") = GS_SAILS_INACTIVE;
            in_orpgsails.attr("GS_SAILS_ACTIVE") = GS_SAILS_ACTIVE;
    }
}

