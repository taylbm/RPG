#ifndef _RPG_WRAP_TYPES_
#define _RPG_WRAP_TYPES_

#include <string>
using std::string;

#include <vector>
using std::vector;

#include <boost/python.hpp>
using boost::python::class_;

#include <boost/python/suite/indexing/vector_indexing_suite.hpp>
using boost::python::vector_indexing_suite;

#include <boost/shared_ptr.hpp>
using boost::shared_ptr;

namespace rpg
{    
    template <class Type>
    void wrap_vector_type(const string& name)
    {
        class_<vector<Type>, shared_ptr<vector<Type> > >(name.c_str())
            .def(vector_indexing_suite<vector<Type> >());
        ;
    }
    
    void export_types();
}

#endif /* _RPG_WRAP_TYPES */

