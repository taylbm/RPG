#ifndef _WRAP_LIBHCI_H_
#define _WRAP_LIBHCI_H_

namespace rpg
{
    struct libhci_ns {};    // dummy class for scoping

    int thinwrap_hci_up_nb_update_dedicated_user_table();
    void export_libhci();
}

#endif /* _WRAP_LIBHCI_H_ */

