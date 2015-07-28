#include <boost/python.hpp>
using boost::python::args;
using boost::python::class_;
using boost::python::def;
using boost::python::make_tuple;
using boost::python::scope;

#include <string>
using std::string;

#include <vector>
using std::vector;

extern "C"
{
    #include "orpginfo.h"
    #include "orpgmisc.h"
    #include "orpgrda.h"
    #include "orpgsails.h"
}

#include "wrap_liborpg.h"

namespace rpg
{
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
    }

    void wrap_orpginfo()
    {

        def("orpginfo_is_sails_enabled", &ORPGINFO_is_sails_enabled);
        def("orpginfo_is_avest_enabled", &ORPGINFO_is_avset_enabled);
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
    }

    void export_liborpg()
    {
        class_<liborpg_ns> c("liborpg");
        scope in_liborpg = c;

        wrap_orpgrda();
        wrap_orpgmisc();
        wrap_orpginfo();

        c.staticmethod("orpgrda_send_cmd")
            .staticmethod("orpgrda_get_wb_status")
            .staticmethod("orpgrda_get_status")
            .staticmethod("orpgmisc_is_rpg_status")
            .staticmethod("orpginfo_is_sails_enabled")
            .staticmethod("orpginfo_is_avest_enabled")
            .staticmethod("orpginfo_statefl_get_rpgalrm")
            .staticmethod("orpginfo_statefl_get_rpgopst")
            .staticmethod("orpgsails_get_status")
            .staticmethod("orpgsails_init")
        ;
    }
}

