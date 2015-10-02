#ifndef _WRAP_LIBEN_H_
#define _WRAP_LIBEN_H_

#include <boost/python.hpp>
using boost::python::object;

#include <map>
using std::map;

#include <vector>
using std::vector;

extern "C"
{
    #include "en.h"
}

namespace rpg
{
    struct EventProxy
    {
        static void Notify(EN_id_t, char *, int, void *);

        static map<EN_id_t, vector<object> > Register;
    };

    struct liben_ns {};     // dummy namespace for scoping

    void thinwrap_en_register(EN_id_t id, object callable);
    void export_liben();
}

#endif /* _WRAP_LIBEN_H_ */

