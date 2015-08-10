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
}

#include "wrap_librpg.h"

namespace rpg
{
    tuple thinwrap_deau_get_values(string key, int number_of_values)
    {
        vector<double> vals(number_of_values);
        int ret = DEAU_get_values(&key[0], &vals[0], number_of_values);

        return make_tuple(ret, vals);
    }

    void thinwrap_deau_lb_name(string name)
    {
        DEAU_LB_name(&name[0]);
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

        c.staticmethod("deau_get_values")
            .staticmethod("deau_lb_name")
        ;
    }
}

