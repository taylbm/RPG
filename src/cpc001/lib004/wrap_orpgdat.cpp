#include <boost/python.hpp>
using boost::python::class_;
using boost::python::scope;

extern "C"
{
    #include "orpgdat.h"
}

#include "wrap_orpgdat.h"

namespace rpg
{
    void export_orpgdat()
    {
        scope in_as = class_<orpgdat_ns>("orpgdat");
        in_as.attr("ORPGDAT_ADAPT_DATA") = ORPGDAT_ADAPT_DATA;
	in_as.attr("ORPGDAT_SYSLOG_LATEST") = ORPGDAT_SYSLOG_LATEST;
    }
}

