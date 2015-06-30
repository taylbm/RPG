#ifndef _RPG_WRAP_LIBORPG_H_
#define _RPG_WRAP_LIBORPG_H_

#include <vector>
using std::vector;

namespace rpg
{
    int thinwrap_orpg_send_cmd(
        int cmd, 
        int who_sent_it, 
        int param1, 
        int param2, 
        int param3, 
        int param4, 
        int param5, 
        vector<char>& msg
    );

    void wrap_orpgrda();
    void export_liborpg();
}

#endif /* _RPG_WRAP_LIBORPG_H_ */

