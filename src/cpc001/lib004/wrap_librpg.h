#ifndef _WRAP_LIB_RPG_H_
#define _WRAP_LIB_RPG_H_

#include <boost/python.hpp>
using boost::python::tuple;

#include <string>
using std::string;

namespace rpg
{
    struct librpg_ns {};    // a dummy class for namespacing

    tuple thinwrap_deau_get_values(const string& key, int number_of_values);
    tuple thinwrap_deau_get_string_values(const string& key);
    void thinwrap_deau_lb_name(const string& name);
    void export_librpg();
}

#endif /* _WRAP_LIB_RPG_H_ */

