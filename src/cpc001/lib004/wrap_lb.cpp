#include <boost/python.hpp>
using boost::python::class_;
using boost::python::scope;

extern "C"
{
    #include "lb.h"
}

#include "wrap_lb.h"

namespace rpg
{
    void export_lb()
    {
        scope in_lb = class_<lb_ns>("lb");

        in_lb.attr("LB_READ") = LB_READ;
        in_lb.attr("LB_WRITE") = LB_WRITE;
        in_lb.attr("LB_CREATE") = LB_CREATE;
    }
}

