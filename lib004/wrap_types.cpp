#include "wrap_types.h"

namespace rpg
{
    void export_types()
    {
        wrap_vector_type<char>("CharVector");
        wrap_vector_type<double>("DoubleVector");
	wrap_vector_type<unsigned int>("timeVector");
	wrap_vector_type<string>("stringVector");
    }
}

