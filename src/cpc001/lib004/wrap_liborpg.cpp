#include <boost/python.hpp>
using boost::python::args;
using boost::python::def;

#include <vector>
using std::vector;

extern "C"
{
    #include "orpgrda.h"
}

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

    void wrap_orpgrda()
    {
        def(
            "orpgrda_send_cmd", 
            &thinwrap_orpg_send_cmd,
            args("cmd", "who_sent_it", "param1", "param2", "param3", "param4", "param5", "msg")
        );
    }

    void export_liborpg()
    {
        wrap_orpgrda();
    }
}

