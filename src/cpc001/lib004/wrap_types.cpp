#include "wrap_types.h"

namespace rpg
{
    void export_types()
    {
        wrap_vector_type<char>("CharVector");
        wrap_vector_type<double>("DoubleVector");
    }
}

