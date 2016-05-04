#ifndef _RPG_UTIL_H_
#define _RPG_UTIL_H_

#include <algorithm>
using std::reverse;

namespace rpg
{
    template <class T>
    void byte_swap(T *in)
    {
        if (sizeof(T) == 1)
            return;

        reverse(
            reinterpret_cast<unsigned char*>(in), 
            reinterpret_cast<unsigned char*>(in) + sizeof(T)
        );
    }
}

#endif /* _RPG_UTIL_H_ */

