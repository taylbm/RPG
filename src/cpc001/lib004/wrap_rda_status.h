#ifndef _WRAP_RDA_STATUS_H_
#define _WRAP_RDA_STATUS_H_

namespace rpg
{
    struct rdastatus_ns {};     // dummy structs for namespacing
    struct wideband_ns {};
    struct rdastatus2_ns {};
    struct opstatus_ns {};
    struct alarmsummary_ns {};
    struct tps_ns {};
    struct auxgen_ns {};
    struct controlstatus_ns {};

    void export_rda_status();
}

#endif /* _WRAP_RDA_STATUS_H_ */

