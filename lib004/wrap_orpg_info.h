#ifndef _WRAP_ORPG_INFO_H_
#define _WRAP_ORPG_INFO_H_

#include <boost/shared_ptr.hpp>
using boost::shared_ptr;

#include <string>
using std::string;

extern "C"
{
    #include "orpginfo.h"
}

namespace rpg
{
    struct orpginfo_ns {};  // dummy struct for namespacing
    shared_ptr<Orpginfo_statefl_flag_evtmsg_t> to_orpginfo_statefl_flag_evtmsg_t(const string& data);
    void wrap_orpginfo_statefl_flag_evtmsg_t();
    void export_orpginfo();
}

#endif /* _WRAP_ORPG_INFO_H_ */

