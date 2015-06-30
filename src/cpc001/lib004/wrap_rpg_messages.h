#ifndef _RPG_WRAP_RPG_MESSAGES_H_
#define _RPG_WRAP_RPG_MESSAGES_H_

namespace rpg
{
    void wrap_vcp_message_header_t();
    void wrap_vcp_elevation_cut_data_t();
    void wrap_vcp_elevation_cut_header_t();
    void wrap_vcp_icd_msg_t();
    
    void export_vcp_messages();
    void export_rpg_messages();
}

#endif /* _RPG_WRAP_RPG_MESSAGES_H_ */

