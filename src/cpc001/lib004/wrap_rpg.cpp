#include <boost/python.hpp>

#include "wrap_libhci.h"
#include "wrap_liborpg.h"
#include "wrap_orda_pmd.h"
#include "wrap_orpg_misc.h"
#include "wrap_rda_status.h"
#include "wrap_rpg_messages.h"
#include "wrap_rpg_rda.h"
#include "wrap_types.h"

namespace rpg
{
    void export_rpg()
    {
        //
        // utility type stuff
        //

        export_types();

        //
        // RDA/RPG stuff
        //

        export_rpg_rda();
        export_pmd_t();

        //
        // RPG stuff
        //

        export_orpg_misc();
        export_rpg_messages();
        export_rda_status();
        export_liborpg();
        export_libhci();
    }
}

BOOST_PYTHON_MODULE(_rpg)
{
    rpg::export_rpg();
}

