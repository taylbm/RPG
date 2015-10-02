#include "wrap_liben.h"

#include <boost/python.hpp>
using boost::python::class_;
using boost::python::def;
using boost::python::scope;

#include <map>
using std::map;

#include <string>
using std::string;

#include <vector>
using std::vector;

namespace rpg
{
    map<EN_id_t, vector<object> > EventProxy::Register;

    void EventProxy::Notify(
        EN_id_t event, char *msg, int length, void *stuff
    )
    {
        map<EN_id_t, vector<object> >::iterator handlers(EventProxy::Register.find(event));

        if (handlers == EventProxy::Register.end())
            return;

        string msg_data(msg, length);

        for (vector<object>::const_iterator handler = handlers->second.begin(); handler != handlers->second.end(); handler++)
        {
            if (handler->is_none() == false)
            {
                //
                // need to get the global interpreter lock 
                // because the RPG may be multi-threaded.
                // TODO: make sure we RELASE the GIL upon error!
                //

                PyGILState_STATE gs = PyGILState_Ensure();
                (*handler)(event, msg_data);
                PyGILState_Release(gs);
            }
        }
    }

    void thinwrap_en_register(EN_id_t id, object callable)
    {
        if (EventProxy::Register.find(id) == EventProxy::Register.end())
        {
            EventProxy::Register[id] = vector<object>();
            EN_register(id, EventProxy::Notify);
        }

        EventProxy::Register[id].push_back(callable);
    }

    void export_liben()
    {
        class_<liben_ns> c("liben");
        scope in_liben = c;

        def("en_register", &thinwrap_en_register);

        c.staticmethod("en_register");
    }
}

