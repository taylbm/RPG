#ifndef _WRAP_ORPGEVT_H_ 
#define _WRAP_ORPGEVT_H_

#include <boost/shared_ptr.hpp>
using boost::shared_ptr;

#include <string>
using std::string;

extern "C"
{
    #include "orpgevt.h"
}

namespace rpg
{
    struct orpgevt_ns {};   // dummy class for namespacing
    shared_ptr<Orpgevt_radial_acct_t> to_orpgevt_radial_acct_t(const string& data);

    void export_orpgevt();
}

#endif /* _WRAP_ORPGEVT_H_ */

