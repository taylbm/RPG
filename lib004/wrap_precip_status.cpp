#include <boost/python.hpp>
using boost::python::class_;

extern "C"
{
    #include "precip_status.h"
}

#include "wrap_precip_status.h"

namespace rpg
{
    void export_precip_status()
    {
        class_<Precip_status_t>("Precip_status_t")
            .def_readwrite(
                "current_precip_status", 
                &Precip_status_t::current_precip_status
            )
            .def_readwrite(
                "rain_area_trend", &Precip_status_t::rain_area_trend
            )
            .def_readwrite(
                "time_last_exceeded_raina", 
                &Precip_status_t::time_last_exceeded_raina
            )
            .def_readwrite(
                "time_remaining_to_reset_accum", 
                &Precip_status_t::time_remaining_to_reset_accum
            )
            .def_readwrite("rain_area", &Precip_status_t::rain_area)
            .def_readwrite(
                "rain_area_diff", &Precip_status_t::rain_area_diff
            )
            .def_readwrite(
                "rain_dbz_thresh_rainz", 
                &Precip_status_t::rain_dbz_thresh_rainz
            )
            .def_readwrite(
                "rain_area_thresh_raina", 
                &Precip_status_t::rain_area_thresh_raina
            )
            .def_readwrite(
                "rain_time_thresh_raint", 
                &Precip_status_t::rain_time_thresh_raint
            )
        ;
    }
}

