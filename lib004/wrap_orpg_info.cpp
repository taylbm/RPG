#include <boost/python.hpp>
using boost::python::class_;
using boost::python::enum_;
using boost::python::def;
using boost::python::scope;

#include <boost/shared_ptr.hpp>
using boost::shared_ptr;

#include <exception>
using std::runtime_error;

#include "util.h"

extern "C"
{
    #include "orpginfo.h"
}

#include "wrap_orpg_info.h"

namespace rpg
{
    void wrap_orpginfo_statefl_flag_evtmsg_t()
    {
        class_<Orpginfo_statefl_flag_evtmsg_t, shared_ptr<Orpginfo_statefl_flag_evtmsg_t> >("orpginfo_statefl_flag_evtmsg")
            .def_readwrite(
                "flag_id",
                &Orpginfo_statefl_flag_evtmsg_t::flag_id
            )
            .def_readwrite(
                "flag",
                &Orpginfo_statefl_flag_evtmsg_t::flag
            )
            .def_readwrite(
                "old_bitflags",
                &Orpginfo_statefl_flag_evtmsg_t::old_bitflags
            )
            .def_readwrite(
                "new_bitflags",
                &Orpginfo_statefl_flag_evtmsg_t::new_bitflags
            )
        ;
    }
    shared_ptr<Orpginfo_statefl_flag_evtmsg_t> to_orpginfo_statefl_flag_evtmsg_t(const string& data)
    {     
        if (data.size() != sizeof(Orpginfo_statefl_flag_evtmsg_t))
            throw runtime_error("Bad statefl event size!");
	shared_ptr<Orpginfo_statefl_flag_evtmsg_t> ptr(new Orpginfo_statefl_flag_evtmsg_t());
        memcpy(
            ptr.get(), 
            reinterpret_cast<const Orpginfo_statefl_flag_evtmsg_t*>(&data[0]), 
            sizeof(Orpginfo_statefl_flag_evtmsg_t)
        );
        

        return ptr;
    }

    void export_orpginfo()
    {
	
        class_<orpginfo_ns> c("orpginfo");
	scope in_orpginfo = c;
	def("to_orpginfo_statefl_flag_evtmsg_t", &to_orpginfo_statefl_flag_evtmsg_t);
	
        enum_<Orpginfo_statefl_rpgalrm_t>("orpgalarms")
            .value("ORPGINFO_STATEFL_RPGALRM_NONE", ORPGINFO_STATEFL_RPGALRM_NONE)
            .value("ORPGINFO_STATEFL_RPGALRM_NODE_CON", ORPGINFO_STATEFL_RPGALRM_NODE_CON)
            .value("ORPGINFO_STATEFL_RPGALRM_WBFAILRE", ORPGINFO_STATEFL_RPGALRM_WBFAILRE)
            .value("ORPGINFO_STATEFL_RPGALRM_RPGCTLFL", ORPGINFO_STATEFL_RPGALRM_RPGCTLFL)
            .value("ORPGINFO_STATEFL_RPGALRM_DBFL", ORPGINFO_STATEFL_RPGALRM_DBFL)
            .value("ORPGINFO_STATEFL_RPGALRM_WBDLS", ORPGINFO_STATEFL_RPGALRM_WBDLS)
            .value("ORPGINFO_STATEFL_RPGALRM_PRDSTGLS", ORPGINFO_STATEFL_RPGALRM_PRDSTGLS)
            .value("ORPGINFO_STATEFL_RPGALRM_RDAWB", ORPGINFO_STATEFL_RPGALRM_RDAWB)
            .value("ORPGINFO_STATEFL_RPGALRM_RPGRPGFL", ORPGINFO_STATEFL_RPGALRM_RPGRPGFL)
            .value("ORPGINFO_STATEFL_RPGALRM_REDCHNER", ORPGINFO_STATEFL_RPGALRM_REDCHNER)
            .value("ORPGINFO_STATEFL_RPGALRM_RPGTSKFL", ORPGINFO_STATEFL_RPGALRM_RPGTSKFL)
            .value("ORPGINFO_STATEFL_RPGALRM_MEDIAFL", ORPGINFO_STATEFL_RPGALRM_MEDIAFL)
            .value("ORPGINFO_STATEFL_RPGALRM_RDAINLS", ORPGINFO_STATEFL_RPGALRM_RDAINLS)
            .value("ORPGINFO_STATEFL_RPGALRM_RPGINLS", ORPGINFO_STATEFL_RPGALRM_RPGINLS)
            .value("ORPGINFO_STATEFL_RPGALRM_FLACCFL", ORPGINFO_STATEFL_RPGALRM_FLACCFL)
            .value("ORPGINFO_STATEFL_RPGALRM_DISTRI", ORPGINFO_STATEFL_RPGALRM_DISTRI)
    ;

        enum_<Orpginfo_statefl_rpgopst_t>("opstatus")
            .value("ORPGINFO_STATEFL_RPGOPST_LOADSHED", ORPGINFO_STATEFL_RPGOPST_LOADSHED)
            .value("ORPGINFO_STATEFL_RPGOPST_ONLINE", ORPGINFO_STATEFL_RPGOPST_ONLINE)
            .value("ORPGINFO_STATEFL_RPGOPST_MAR", ORPGINFO_STATEFL_RPGOPST_MAR)
            .value("ORPGINFO_STATEFL_RPGOPST_MAM", ORPGINFO_STATEFL_RPGOPST_MAM)
            .value("ORPGINFO_STATEFL_RPGOPST_CMDSHDN", ORPGINFO_STATEFL_RPGOPST_CMDSHDN)
    ;
	enum_<unsigned char>("STATEFL")
	    .value("ORPGINFO_STATEFL_GET",ORPGINFO_STATEFL_GET)
            .value("ORPGINFO_STATEFL_SET",ORPGINFO_STATEFL_SET)
            .value("ORPGINFO_STATEFL_CLR",ORPGINFO_STATEFL_CLR)
    ;
	c.staticmethod("to_orpginfo_statefl_flag_evtmsg_t");

	wrap_orpginfo_statefl_flag_evtmsg_t();	
	   
    } 
}

