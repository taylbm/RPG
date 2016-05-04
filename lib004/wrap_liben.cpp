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

#include <iostream>

#include <utility>
using std::pair;
using std::make_pair;

namespace rpg
{
    map<EN_id_t, vector<object> > EventProxy::Register;

    map<pair<int,LB_id_t>, vector<object> > EventProxy::RegisterLBmulti;

    map<int, vector<object> > EventProxy::RegisterLB;
    
    object EventProxy::RegisterDEA;


    
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
		try { 
	        PyGILState_STATE gs = PyGILState_Ensure();
                (*handler)(event, msg_data);
		PyGILState_Release(gs);
		}
		catch(...) {
		    std::cout << "EN ERROR";
		}
			
            }
        }
    }
    
    void EventProxy::NotifyLBmulti(
	int fd, LB_id_t msg_id, int length, void *stuff
    )
    {
        map<pair<int,LB_id_t>, vector<object> >:: iterator handlers(EventProxy::RegisterLBmulti.find(make_pair(fd,msg_id)));
	
	if (handlers == EventProxy::RegisterLBmulti.end())
	    return; 
	
	for (vector<object>::const_iterator handler = handlers->second.begin(); handler != handlers->second.end(); handler++)
	{
	    if (handler->is_none() == false)
	    {
		try { 
		    PyGILState_STATE gs = PyGILState_Ensure();
		    (*handler)(fd,msg_id);
		    PyGILState_Release(gs);
	   	}
		catch(...) {
		    std::cout << "LB ERROR";
		}
	    }
	}
    }

    void EventProxy::NotifyLB(
        int fd, LB_id_t msg_id, int length, void *stuff
    )
    {
        map<int, vector<object> >:: iterator handlers(EventProxy::RegisterLB.find(fd));

        if (handlers == EventProxy::RegisterLB.end())
            return;

        for (vector<object>::const_iterator handler = handlers->second.begin(); handler != handlers->second.end(); handler++)
        {
            if (handler->is_none() == false)
            {
                try {
                    PyGILState_STATE gs = PyGILState_Ensure();
                    (*handler)(fd,msg_id);
                    PyGILState_Release(gs);
    		}        
                catch(...) {
                    std::cout << "LB ERROR";
                }
            }
        }
    }


    void EventProxy::NotifyDEA(
        int fd, EN_id_t msg_id, int length, void *stuff
    )
    {
        try {
            PyGILState_STATE gs = PyGILState_Ensure();
            (EventProxy::RegisterDEA)(fd,msg_id);
            PyGILState_Release(gs);
        }
        catch(...) {
            std::cout << "DEA ERROR";
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
    
    void thinwrap_orpgda_un_register_multi(int data_id, LB_id_t msg_id, object callable)
    {
	int fd = ORPGDA_lbfd(data_id);
        if (EventProxy::RegisterLBmulti.find(make_pair(fd,msg_id)) == EventProxy::RegisterLBmulti.end())
	{
	    EventProxy::RegisterLBmulti[make_pair(fd,msg_id)] = vector<object>();
	    LB_UN_register(fd,msg_id,EventProxy::NotifyLBmulti);
	}
	
	EventProxy::RegisterLBmulti[make_pair(fd,msg_id)].push_back(callable);
    }

    void thinwrap_orpgda_un_register(int data_id, LB_id_t msg_id, object callable)
    {
        int fd = ORPGDA_lbfd(data_id);
        if (EventProxy::RegisterLB.find(fd) == EventProxy::RegisterLB.end())
        {
            EventProxy::RegisterLB[fd] = vector<object>();
            LB_UN_register(fd,msg_id,EventProxy::NotifyLB);
        }

        EventProxy::RegisterLB[fd].push_back(callable);
    }

    void thinwrap_deau_un_register(const string& name, object callable)
    {
 	char *group_name = const_cast<char*>(&name[0]);
	DEAU_UN_register(group_name,EventProxy::NotifyDEA);
	EventProxy::RegisterDEA = callable;
    }
	
    

    void export_liben()
    {
        class_<liben_ns> c("liben");
        scope in_liben = c;
        def("en_register", &thinwrap_en_register);
        def("un_register", &thinwrap_orpgda_un_register);
        def("un_register_multi", &thinwrap_orpgda_un_register_multi);
	def("deau_un_register", &thinwrap_deau_un_register);
	c.staticmethod("deau_un_register");
	c.staticmethod("un_register");
        c.staticmethod("en_register");
	c.staticmethod("un_register_multi");	
    }
}

