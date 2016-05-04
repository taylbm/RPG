#ifndef _RPG_WRAP_RPG_MESSAGES_H_
#define _RPG_WRAP_RPG_MESSAGES_H_

#include <boost/python.hpp>
using boost::python::list;

#include <boost/shared_ptr.hpp>
using boost::shared_ptr;

extern "C"
{
    #include "orpg.h"
}

namespace rpg
{
    struct rpgvcp_ns {};    // dummy struct for namespacing

    shared_ptr<VCP_elevation_cut_header_t> wrap_set_vcp_elevation_cut_header_t_data(
        shared_ptr<VCP_elevation_cut_header_t> self, 
        list data
    );

    list wrap_get_vcp_elevation_cut_header_t_data(
        shared_ptr<VCP_elevation_cut_header_t> self
    );

    void wrap_vcp_message_header_t();
    void wrap_vcp_elevation_cut_data_t();
    void wrap_vcp_elevation_cut_header_t();
    void wrap_vcp_icd_msg_t();
    
    void export_vcp_messages();
    void export_rpg_messages();
}

#endif /* _RPG_WRAP_RPG_MESSAGES_H_ */

