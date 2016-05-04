#include <boost/python.hpp>
using boost::python::args;
using boost::python::class_;
using boost::python::def;
using boost::python::scope;
using boost::python::enum_;
using boost::python::make_tuple;

#include <string>
using std::string;


extern "C"
{
    #include "mrpg.h"
}

#include "wrap_mrpg.h"

namespace rpg
{
    tuple thinwrap_orpgmgr_get_rpg_states()
    {
	Mrpg_state_t mrpg;
	int status;
	status = ORPGMGR_get_RPG_states(&mrpg);
	return make_tuple(status,mrpg.state);
    }
    void export_mrpg()
    {
	class_<mrpg_ns> c("mrpg");
        scope in_mrpg = c;
	enum_<Mrpg_command_code_t>("commands")
            .value("MRPG_STARTUP",MRPG_STARTUP)
	    .value("MRPG_RESTART",MRPG_RESTART)
	    .value("MRPG_STANDBY",MRPG_STANDBY)
	    .value("MRPG_SHUTDOWN",MRPG_SHUTDOWN)	
	    .value("MRPG_CLEANUP",MRPG_CLEANUP)
	;
	enum_<Mrpg_state_code_t>("states")	
	    .value("MRPG_ST_SHUTDOWN",MRPG_ST_SHUTDOWN)
	    .value("MRPG_ST_STANDBY",MRPG_ST_STANDBY)
	    .value("MRPG_ST_OPERATING",MRPG_ST_OPERATING)
	    .value("MRPG_ST_TRANSITION",MRPG_ST_TRANSITION)
	    .value("MRPG_ST_FAILED",MRPG_ST_FAILED)
	    .value("MRPG_ST_POWERFAIL",MRPG_ST_POWERFAIL)
	;
	def(
	    "orpgmgr_send_command",
	    &ORPGMGR_send_command,
	    args("cmd")
	);	
	def(
	    "orpgmgr_get_rpg_states",	
	    &thinwrap_orpgmgr_get_rpg_states
	);
	c.staticmethod("orpgmgr_get_rpg_states");
	c.staticmethod("orpgmgr_send_command");
	

    }
}

