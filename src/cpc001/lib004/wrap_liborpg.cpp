#include <boost/python.hpp>
using boost::python::args;
using boost::python::class_;
using boost::python::def;
using boost::python::make_tuple;
using boost::python::reference_existing_object;
using boost::python::return_value_policy;
using boost::python::scope;

#include <string>
using std::string;

#include <vector>
using std::vector;

extern "C"
{
    #include "orpgda.h"
    #include "orpginfo.h"
    #include "orpgmisc.h"
    #include "orpgrat.h"
    #include "orpgrda.h"
    #include "orpgsails.h"
    #include "orpgvst.h"
}

#include "wrap_liborpg.h"

namespace rpg
{


    int thinwrap_orpgsails_set_req_num_cuts(int num_cuts)
    {
        return ORPGSAILS_set_req_num_cuts(num_cuts);
    }

    int thinwrap_orpg_send_cmd(
        int cmd, 
        int who_sent_it, 
        int param1, 
        int param2, 
        int param3, 
        int param4, 
        int param5, 
        vector<char>& msg
    )
    {
        if (msg.empty())
            return ORPGRDA_send_cmd(
            cmd, who_sent_it, param1, param2, param3, param4, param5, NULL
        );
        else
            return ORPGRDA_send_cmd(
                cmd, who_sent_it, param1, param2, param3, param4, param5, &msg[0]
            );
    }

    tuple thinwrap_orpginfo_statefl_get_rpgalrm()
    {
        unsigned int rval = 9999;
        bool success = ORPGINFO_statefl_get_rpgalrm(&rval) == 0;

        return make_tuple(success, rval);
    }

    tuple thinwrap_orpginfo_statefl_get_rpgopst()
    {
        unsigned int rval = 9999;
        bool success = ORPGINFO_statefl_get_rpgopst(&rval) == 0;

        return make_tuple(success, rval);
    }

    string thinwrap_orpgda_lbname(int data_id)
    {
        return string(ORPGDA_lbname(data_id));
    }

    string thinwrap_orpgrat_get_alarm_text(int code)
    {
        return string(ORPGRAT_get_alarm_text(code));
    }

    void wrap_orpgda()
    {
        def(
            "orpgda_lbname", 
            &thinwrap_orpgda_lbname, 
            args("data_id")
        );

        def("orpgda_open", &ORPGDA_open, args("data_id", "flags"));
        def("orpgda_close", &ORPGDA_close, args("data_id"));
    }
    void wrap_orpgsails()
    {
	def(
	    "orpgsails_set_req_num_cuts",
	    &thinwrap_orpgsails_set_req_num_cuts,
	    args("num_cuts")
	);
	def("orpgsails_allowed",&ORPGSAILS_allowed);
	def("orpgsails_get_site_max_cuts",&ORPGSAILS_get_site_max_cuts);
    }
    void wrap_orpgrda()
    {
        def(
            "orpgrda_send_cmd", 
            &thinwrap_orpg_send_cmd,
            args(
                "cmd", 
                "who_sent_it", 
                "param1", 
                "param2", 
                "param3", 
                "param4", 
                "param5", 
                "msg"
            )
        );
        def(
            "orpgrda_get_wb_status", 
            &ORPGRDA_get_wb_status, 
            args("item"),
            "Using a constant from rdastatus as 'item' this function will return the value for that wideband status item. The returned value is also an rdastatus constant."
        );
        def(
            "orpgrda_get_status", 
            &ORPGRDA_get_status, 
            args("item"),
            "Using a constant from rdastatus. as 'item' this function will return the value for that status item. This value is also an rdastatus constant."
        );
        def("orpgrda_read_alarms", &ORPGRDA_read_alarms);
        def("orpgrda_get_num_alarms", &ORPGRDA_get_num_alarms);
        def("orpgrda_get_alarm", &ORPGRDA_get_alarm);
    }

    void wrap_orpginfo()
    {
	def("orpginfo_set_super_resolution_enabled", &ORPGINFO_set_super_resolution_enabled);
	def("orpginfo_clear_super_resolution_enabled", &ORPGINFO_clear_super_resolution_enabled);
	def("orpginfo_set_cmd_enabled", &ORPGINFO_set_cmd_enabled);
	def("orpginfo_clear_cmd_enabled", &ORPGINFO_clear_cmd_enabled);
        def("orpginfo_is_sails_enabled", &ORPGINFO_is_sails_enabled);
        def("orpginfo_is_avset_enabled", &ORPGINFO_is_avset_enabled);
        def(
            "orpginfo_statefl_get_rpgalrm", 
            &thinwrap_orpginfo_statefl_get_rpgalrm 
        );
        def(
            "orpginfo_statefl_get_rpgopst",
            &thinwrap_orpginfo_statefl_get_rpgopst
        );
    }

    void wrap_orpgmisc()
    {
        def(
            "orpgmisc_is_rpg_status", 
            &ORPGMISC_is_rpg_status, 
            args("check_status")
        );
        def("orpgsails_get_status", &ORPGSAILS_get_status);
        def("orpgsails_init", &ORPGSAILS_init);
        def("orpgsails_get_num_cuts", &ORPGSAILS_get_num_cuts);
    }

    void wrap_orpgvst()
    {
        def("orpgvst_get_volume_time", &ORPGVST_get_volume_time);
    }

    void wrap_orpgrat()
    {
        def(
            "orpgrat_get_alarm_text", 
            &thinwrap_orpgrat_get_alarm_text, 
            args("code")
        );
    }

    void export_liborpg()
    {
        class_<liborpg_ns> c("liborpg");
        scope in_liborpg = c;

        wrap_orpgda();
        wrap_orpgrda();
        wrap_orpgmisc();
        wrap_orpginfo();
        wrap_orpgrat();
        wrap_orpgvst();
	wrap_orpgsails();

        c.staticmethod("orpgrda_send_cmd")
            .staticmethod("orpgrda_get_wb_status")
            .staticmethod("orpgrda_get_status")
            .staticmethod("orpgrda_read_alarms")
            .staticmethod("orpgrda_get_num_alarms")
            .staticmethod("orpgrda_get_alarm")
            .staticmethod("orpgda_lbname")
            .staticmethod("orpgda_open")
            .staticmethod("orpgda_close")
            .staticmethod("orpgmisc_is_rpg_status")
            .staticmethod("orpginfo_is_sails_enabled")
            .staticmethod("orpginfo_is_avset_enabled")
            .staticmethod("orpginfo_statefl_get_rpgalrm")
            .staticmethod("orpginfo_statefl_get_rpgopst")
	    .staticmethod("orpginfo_set_super_resolution_enabled")
            .staticmethod("orpginfo_clear_super_resolution_enabled")
            .staticmethod("orpginfo_set_cmd_enabled")
            .staticmethod("orpginfo_clear_cmd_enabled")
            .staticmethod("orpgsails_get_status")
            .staticmethod("orpgsails_init")
            .staticmethod("orpgsails_get_num_cuts")
	    .staticmethod("orpgsails_set_req_num_cuts")
	    .staticmethod("orpgsails_allowed")
	    .staticmethod("orpgsails_get_site_max_cuts")
            .staticmethod("orpgvst_get_volume_time")
            .staticmethod("orpgrat_get_alarm_text")
        ;
    }
}

