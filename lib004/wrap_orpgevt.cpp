#include <boost/python.hpp>
using boost::python::class_;
using boost::python::def;
using boost::python::scope;

#include <boost/shared_ptr.hpp>
using boost::shared_ptr;

#include <exception>
using std::runtime_error;

#include "util.h"
#include "wrap_orpgevt.h"

extern "C"
{
    #include "orpgevt.h"
}

namespace rpg
{
    void wrap_radial_acct_t()
    {
        class_<Orpgevt_radial_acct_t, shared_ptr<Orpgevt_radial_acct_t> >("Orpgevt_radial_acct_t")
            .def_readwrite("azimuth", &Orpgevt_radial_acct_t::azimuth)
            .def_readwrite("azi_num", &Orpgevt_radial_acct_t::azi_num)
            .def_readwrite("elevation", &Orpgevt_radial_acct_t::elevation)
            .def_readwrite("elev_num", &Orpgevt_radial_acct_t::elev_num)
            .def_readwrite(
                "last_ele_flag", &Orpgevt_radial_acct_t::last_ele_flag
            )
            .def_readwrite(
                "radial_status", &Orpgevt_radial_acct_t::radial_status
            )
            .def_readwrite(
                "n_sails_cuts", &Orpgevt_radial_acct_t::n_sails_cuts
            )
            .def_readwrite(
                "sails_cut_seq", &Orpgevt_radial_acct_t::sails_cut_seq
            )
            .def_readwrite("super_res", &Orpgevt_radial_acct_t::super_res)
            .def_readwrite(
                "start_elev_azm", &Orpgevt_radial_acct_t::start_elev_azm
            )
            .def_readwrite("moments", &Orpgevt_radial_acct_t::moments)
        ;
    }

    shared_ptr<Orpgevt_radial_acct_t> to_orpgevt_radial_acct_t(const string& data)
    {
        if (data.size() != sizeof(Orpgevt_radial_acct_t))
            throw runtime_error("Bad radial info event size!");

        shared_ptr<Orpgevt_radial_acct_t> ptr(new Orpgevt_radial_acct_t());
        memcpy(
            ptr.get(), 
            reinterpret_cast<const Orpgevt_radial_acct_t*>(&data[0]), 
            sizeof(Orpgevt_radial_acct_t)
        );

        byte_swap(&(ptr->azimuth));
        byte_swap(&(ptr->azi_num));
        byte_swap(&(ptr->elevation));
        byte_swap(&(ptr->radial_status));
        byte_swap(&(ptr->super_res));
        byte_swap(&(ptr->start_elev_azm));
        byte_swap(&(ptr->moments));

        return ptr;
    }

    void export_orpgevt()
    {
        class_<orpgevt_ns> c("orpgevt");
        scope in_orpgevt = c;

        def("to_orpgevt_radial_acct_t", &to_orpgevt_radial_acct_t);

        in_orpgevt.attr("ORPGEVT_RADIAL_ACCT") = static_cast<int>(ORPGEVT_RADIAL_ACCT);
        in_orpgevt.attr("RADIAL_ACCT_REFLECTIVITY") = RADIAL_ACCT_REFLECTIVITY;
	in_orpgevt.attr("RADIAL_ACCT_VELOCITY") = RADIAL_ACCT_VELOCITY;
	in_orpgevt.attr("RADIAL_ACCT_WIDTH") = RADIAL_ACCT_WIDTH;
	in_orpgevt.attr("RADIAL_ACCT_DUALPOL") = RADIAL_ACCT_DUALPOL;
        in_orpgevt.attr("ORPGEVT_ENVWND_UPDATE") = static_cast<int>(ORPGEVT_ENVWND_UPDATE);
        in_orpgevt.attr("ORPGEVT_PERF_MAIN_RECEIVED") = static_cast<int>(ORPGEVT_PERF_MAIN_RECEIVED);
        in_orpgevt.attr("ORPGEVT_RPG_STATUS_CHANGE") = static_cast<int>(ORPGEVT_RPG_STATUS_CHANGE);
        in_orpgevt.attr("ORPGEVT_START_OF_VOLUME") = static_cast<int>(ORPGEVT_START_OF_VOLUME);
        in_orpgevt.attr("ORPGEVT_RDA_STATUS_CHANGE") = static_cast<int>(ORPGEVT_RDA_STATUS_CHANGE);
        in_orpgevt.attr("ORPGEVT_RDA_ALARMS_UPDATE") = static_cast<int>(ORPGEVT_RDA_ALARMS_UPDATE);
        in_orpgevt.attr("ORPGEVT_RPG_ALARM") = static_cast<int>(ORPGEVT_RPG_ALARM);
        in_orpgevt.attr("ORPGEVT_RPG_OPSTAT_CHANGE") = static_cast<int>(ORPGEVT_RPG_OPSTAT_CHANGE);
        in_orpgevt.attr("ORPGEVT_ADAPT_UPDATE") = static_cast<int>(ORPGEVT_ADAPT_UPDATE);
	in_orpgevt.attr("ORPGEVT_LOAD_SHED_CAT") = static_cast<int>(ORPGEVT_LOAD_SHED_CAT);


	c.staticmethod("to_orpgevt_radial_acct_t");
	
        
        wrap_radial_acct_t();
    }
}

