#ifndef _WRAP_LIBEN_H_
#define _WRAP_LIBEN_H_

#include <boost/python.hpp>
using boost::python::object;

#include <string>
using std::string;

#include <map>
using std::map;

#include <vector>
using std::vector;

#include <utility>
using std::pair;


extern "C"
{
    #include "lb.h"
    #include "en.h"
    #include "orpgda.h"
    #include "deau.h"	
}

namespace rpg
{
    struct EventProxy
    {
        static map<EN_id_t, vector<object> > Register;
	static map<pair<int,LB_id_t>, vector<object> > RegisterLBmulti;
        static map<int, vector<object> > RegisterLB;
        static object RegisterDEA;
    
        static void Notify(EN_id_t, char *, int, void *);
	static void NotifyDEA(int, EN_id_t, int, void *);
	static void NotifyLB(int, LB_id_t, int, void *);
        static void NotifyLBmulti(int, LB_id_t, int, void *);

    };

    struct liben_ns {};     // dummy namespace for scoping


    void thinwrap_deau_un_register(const string& name, object callable);
    void thinwrap_orpgda_un_register(int data_id, LB_id_t msg_id, object callable);
    void thinwrap_orpgda_un_register_multi(int data_id, LB_id_t msg_id, object callable);
    void thinwrap_en_register(EN_id_t id, object callable);
    void export_liben();
}

#endif /* _WRAP_LIBEN_H_ */

