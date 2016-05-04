#ifndef _WRAP_LIBHCI_H_
#define _WRAP_LIBHCI_H_

namespace rpg
{
    struct libhci_ns {};    // dummy class for scoping
    struct nb_status_ns {}; 
    int thinwrap_hci_up_nb_update_dedicated_user_table();
    void thinwrap_hci_current_vcp_set_vel_resolution(int num);
    void export_libhci();
}

#endif /* _WRAP_LIBHCI_H_ */

