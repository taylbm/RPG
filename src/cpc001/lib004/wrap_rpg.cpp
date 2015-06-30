#include <boost/python.hpp>

#include "wrap_liborpg.h"
#include "wrap_rpg_messages.h"
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
        // RPG stuff
        //

        export_rpg_messages();
        export_liborpg();
    }
}

BOOST_PYTHON_MODULE(_rpg)
{
    rpg::export_rpg();
}

