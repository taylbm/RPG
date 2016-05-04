#ifndef _WRAP_MPRG_H_
#define _WRAP_MRPG_H_

#include <boost/python.hpp>
using boost::python::tuple;


namespace rpg
{
    struct mrpg_ns {};    // a dummy class for namespacing
    tuple thinwrap_orpgmgr_get_rpg_states(); 
    void export_mrpg();
}

#endif /* _WRAP_MRPG_H_ */

