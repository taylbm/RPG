#include <string>
using std::string;

#include <boost/shared_ptr.hpp>
using boost::shared_ptr;

#include "wrap_types.h"

namespace rpg
{
    void export_types()
    {
        wrap_vector_type<char>("CharVector");
    }
}

