#include <boost/python.hpp>
using boost::python::class_;

extern "C"
{
    #include "orda_pmd.h"
}

#include "wrap_orda_pmd.h"

namespace rpg
{
    void export_pmd_t()
    {
        class_<Pmd_t>("Pmd_t")
            //
            // equipment shelter
            //


            .def_readwrite("cnvrtd_gnrtr_fuel_lvl", &Pmd_t::cnvrtd_gnrtr_fuel_lvl)
            .def_readwrite("trsmttr_leaving_air_temp", &Pmd_t::trsmttr_leaving_air_temp)

            //
            // transmitter
            //

            .def_readwrite("xmtr_peak_pwr", &Pmd_t::xmtr_peak_pwr)

            //
            // device status
            //

            .def_readwrite("perf_check_time", &Pmd_t::perf_check_time)
        ;
        
        class_<orda_pmd_t>("orda_pmd_t")
            .def_readwrite("msg_hdr", &orda_pmd_t::msg_hdr)
            .def_readwrite("pmd", &orda_pmd_t::pmd)
        ;
    }
}
