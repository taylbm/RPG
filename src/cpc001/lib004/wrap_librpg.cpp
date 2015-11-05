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
    #include "infr.h"
    #include "orpg.h"
    #include "deau.h"
    #include "dpprep_isdp.h"
}

#include "wrap_librpg.h"

namespace rpg
{
    tuple thinwrap_deau_get_values(const string& key, int number_of_values)
    {
        vector<double> vals(number_of_values);
        int ret = DEAU_get_values(
            const_cast<char*>(&key[0]), &vals[0], number_of_values
        );

        return make_tuple(ret, vals);
    }

    tuple thinwrap_deau_get_string_values(const string& key)
    {
        char *tmp;
        int ret = DEAU_get_string_values(const_cast<char*>(&key[0]), &tmp);

        return make_tuple(ret, string(tmp));
    }

    void thinwrap_deau_lb_name(const string& name)
    {
        DEAU_LB_name(const_cast<char*>(&name[0]));
    }

    void export_librpg()
    {
        class_<librpg_ns> c("librpg");
        scope in_librpg = c;
        
	def("deau_lb_name", &thinwrap_deau_lb_name, args("name"));
        def(
            "deau_get_values", 
            &thinwrap_deau_get_values, 
            args("key", "number_of_values")
        );
        def(
            "deau_get_string_values", 
            &thinwrap_deau_get_string_values, 
            args("key")
        );

        c.staticmethod("deau_get_values")
            .staticmethod("deau_lb_name")
            .staticmethod("deau_get_string_values")
        ;
    }
}

