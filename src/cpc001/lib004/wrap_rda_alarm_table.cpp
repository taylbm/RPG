#include <boost/python.hpp>
using boost::python::class_;

extern "C"
{
    #include "rda_alarm_table.h"
}

#include "wrap_rda_alarm_table.h"

namespace rpg
{
    void export_rda_alarm_table()
    {
        class_<RDA_alarm_t>("RDA_alarm_t")
            .def_readwrite("month", &RDA_alarm_t::month)
            .def_readwrite("day", &RDA_alarm_t::day)
            .def_readwrite("year", &RDA_alarm_t::year)
            .def_readwrite("hour", &RDA_alarm_t::hour)
            .def_readwrite("minute", &RDA_alarm_t::minute)
            .def_readwrite("second", &RDA_alarm_t::second)
            .def_readwrite("code", &RDA_alarm_t::code)
            .def_readwrite("alarm", &RDA_alarm_t::alarm)
            .def_readwrite("channel", &RDA_alarm_t::channel)
        ;
    }
}

