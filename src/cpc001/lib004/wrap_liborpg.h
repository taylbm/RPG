#ifndef _RPG_WRAP_LIBORPG_H_
#define _RPG_WRAP_LIBORPG_H_

#include <boost/python.hpp>
using boost::python::tuple;

#include <string>
using std::string;

#include <vector>
using std::vector;

namespace rpg
{
    struct liborpg_ns {};      // dummy struct for namespacing

    int thinwrap_orpgsails_set_req_num_cuts(int num_cuts);
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
    tuple thinwrap_orpg_statefl_get_rpgalrm();
    tuple thinwrap_orpg_statefl_get_rpgopst();
    tuple thinwrap_orpgda_read(int data_id, int length,int msg);
    tuple thinwrap_orpgload_get_data(int category,int type); 
    string thinwrap_orpgda_lbname(int data_id);
    string thinwrap_orpgrat_get_alarm_text(int code);

    void wrap_orpgsails();
    void wrap_orpgda();
    void wrap_orpgrda();
    void wrap_orpgmisc();
    void wrap_orpginfo();
    void wrap_orpgvst();
    void wrap_orpgrat();
    void wrap_rpgcs();
    void wrap_orpgload();
    void export_liborpg();
}

#endif /* _RPG_WRAP_LIBORPG_H_ */

