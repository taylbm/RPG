#include <boost/python.hpp>
using boost::python::args;
using boost::python::class_;
using boost::python::def;
using boost::python::make_tuple;
using boost::python::reference_existing_object;
using boost::python::return_value_policy;
using boost::python::scope;
using boost::python::object;
using boost::python::ptr;
using boost::python::handle;
using boost::python::list;
using boost::python::enum_;

#include <boost/python/suite/indexing/vector_indexing_suite.hpp>
using boost::python::vector_indexing_suite;

#include <string>
using std::string;

#include <vector>
using std::vector;

#include <boost/shared_ptr.hpp>
using boost::shared_ptr;


extern "C"
{
    #include "orpg.h"
    #include "prod_gen_msg.h"
    #include "gen_stat_msg.h"
    #include "time.h"
    #include "rpgcs_time_funcs.h"
    #include "lb.h"
    #include "hci_le.h"
}

#include "wrap_liborpg.h"

namespace rpg
{
    int thinwrap_orpgsails_set_req_num_cuts(int num_cuts)
    {
        return ORPGSAILS_set_req_num_cuts(num_cuts);
    }

    int thinwrap_orpg_send_cmd(
        int cmd, 
        int who_sent_it, 
        int param1, 
        int param2, 
        int param3, 
        int param4, 
        int param5, 
        vector<char>& msg
    )
    {
        if (msg.empty())
            return ORPGRDA_send_cmd(
            cmd, who_sent_it, param1, param2, param3, param4, param5, NULL
        );
        else
            return ORPGRDA_send_cmd(
                cmd, who_sent_it, param1, param2, param3, param4, param5, &msg[0]
            );
    }
    int thinwrap_orpginfo_statefl_flag(Orpginfo_statefl_flagid_t flag_id, int action)
    {
	unsigned char flag_p;
	bool sucess = ORPGINFO_statefl_flag(flag_id,action,&flag_p);
	return sucess;
    }
    tuple thinwrap_orpginfo_statefl_get_rpgalrm()
    {
        unsigned int rval = 9999;
        bool success = ORPGINFO_statefl_get_rpgalrm(&rval) == 0;

        return make_tuple(success, rval);
    }

    tuple thinwrap_orpginfo_statefl_get_rpgopst()
    {
        unsigned int rval = 9999;
        bool success = ORPGINFO_statefl_get_rpgopst(&rval) == 0;

        return make_tuple(success, rval);
    }

    string thinwrap_orpgda_lbname(int data_id)
    {
        return string(ORPGDA_lbname(data_id));
    }
    tuple thinwrap_orpgda_read_syslog(int data_id,int length, LB_id_t id)
    {
	char *buf;
	LE_critical_message *le_msg;
	time_t gen_time;
	int rval = ORPGDA_read(data_id,&buf,0,id);
	if (rval < 0) {
	    return make_tuple(rval,"ORPGDA_read error");
	}
	else {
	    le_msg = (LE_critical_message *) buf;
	    gen_time = le_msg->time;
	    int code = le_msg->code;
	    char *text = le_msg->text;
	    return make_tuple(rval,string(text),gen_time,code);
	}
    }
    tuple thinwrap_orpgda_read_syslog_full(int data_id)
    {
	int Msgs_read = 0;
        int MAX_MSGS_BUFFER = 10000;
        int status = 0;
        int offset = 0;
        int le_msg_len = 0;
        LE_critical_message *le_msg;
        LB_status Log_status;
	vector<unsigned int> time_vec;
	vector<unsigned int> code_vec;
	list text_list;
	ORPGDA_open( data_id, LB_READ);
	
       // if ( ( status = ORPGDA_stat( data_id, &Log_status ) ) == LB_SUCCESS )
        //{
         // if( Log_status.n_msgs > MAX_MSGS_BUFFER )
          //{
          //  status = ORPGDA_seek( data_id, -(MAX_MSGS_BUFFER-1), LB_LATEST, NULL );
          //}
          //else
          //{
          status = ORPGDA_seek( data_id, 0, LB_FIRST, NULL);
          //}
		
          char * msg = (char *) calloc (HCI_LE_MSG_MAX_LENGTH*MAX_MSGS_BUFFER, 1);

          if( status >= 0 )
          {	
            status = ORPGDA_read( data_id,
                                  msg,
                                  HCI_LE_MSG_MAX_LENGTH*MAX_MSGS_BUFFER,
                                  ( LB_MULTI_READ | (MAX_MSGS_BUFFER - 1) ) );
          }
          if( status >= 0 )
          {
            while( status > offset )
            {
              le_msg = ( LE_critical_message* ) (msg+offset);
	      char *text = le_msg->text;
              le_msg_len = ALIGNED_SIZE( sizeof( LE_critical_message )+strlen( text ) );
	      offset += le_msg_len;
	      text_list.append(string(text));
	      time_vec.push_back(le_msg->time);
	      code_vec.push_back(le_msg->code);
		
	      Msgs_read++;
	      
	      if(Msgs_read >= MAX_MSGS_BUFFER)
	      {
		std::cout << "Too many messages read";
		break;
	      }
	    }
	  }
	  free( msg );
        //}
	return make_tuple(status,time_vec,code_vec,text_list);	
    }

            

	
    tuple thinwrap_orpgda_read_sails(int data_id,int msg)
    {
        SAILS_status_t SAILS_status;
        int rval = ORPGDA_read( data_id,
			        (char *) &SAILS_status,
			        (int) sizeof(SAILS_status_t),
				msg );
        if(rval < 0){
            return make_tuple(rval,"ORPGDA_read error");
        }
        else{
	    int cuts = SAILS_status.n_sails_cuts;
            return make_tuple(rval,cuts);
	}
        
    }

    tuple thinwrap_orpgload_get_data(int category,int type)
    {
	int value;
	int rval = ORPGLOAD_get_data(category,type,&value);
	return make_tuple(rval,value);
    }
    string thinwrap_orpgrat_get_alarm_text(int code)
    {
        return string(ORPGRAT_get_alarm_text(code));
    }

    
    void wrap_orpgda()
    {
        def(
            "orpgda_lbname", 
            &thinwrap_orpgda_lbname, 
            args("data_id")
        );
	def(
	    "orpgda_lbfd",
	    ORPGDA_lbfd,
	    args("data_id")
	);
	def(
	    "orpgda_read_syslog",
	    &thinwrap_orpgda_read_syslog,
	    args("data_id","length","msg")
	);
	def(
	    "orpgda_read_sails",
	    &thinwrap_orpgda_read_sails,
	    args("data_id","msg")
	);
	def(
	    "orpgda_write_permission",
	    &ORPGDA_write_permission,
	    args("data_id")
	);
        def(
	    "orpgda_open", 
	    &ORPGDA_open, 
	    args("data_id", "flags")
	);
        def(
	    "orpgda_close", 
	    &ORPGDA_close, 
	    args("data_id")
	);
	def( 
	    "orpgda_read_syslog_full",
	    &thinwrap_orpgda_read_syslog_full,
	    args("data_id")
	);
    }
    void wrap_orpgsails()
    {
	def(
	    "orpgsails_set_req_num_cuts",
	    &thinwrap_orpgsails_set_req_num_cuts,
	    args("num_cuts")
	);
	def("orpgsails_allowed",&ORPGSAILS_allowed);
	def("orpgsails_get_site_max_cuts",&ORPGSAILS_get_site_max_cuts);
	def("orpgsails_init",&ORPGSAILS_init);	
    }
    void wrap_orpgrda()
    {
        def(
            "orpgrda_send_cmd", 
            &thinwrap_orpg_send_cmd,
            args(
                "cmd", 
                "who_sent_it", 
                "param1", 
                "param2", 
                "param3", 
                "param4", 
                "param5", 
                "msg"
            )
        );
        def(
            "orpgrda_get_wb_status", 
            &ORPGRDA_get_wb_status, 
            args("item"),
            "Using a constant from rdastatus as 'item' this function will return the value for that wideband status item. The returned value is also an rdastatus constant."
        );
        def(
            "orpgrda_get_status", 
            &ORPGRDA_get_status, 
            args("item"),
            "Using a constant from rdastatus. as 'item' this function will return the value for that status item. This value is also an rdastatus constant."
        );
        def("orpgrda_read_alarms", &ORPGRDA_read_alarms);
        def("orpgrda_get_num_alarms", &ORPGRDA_get_num_alarms);
        def("orpgrda_get_alarm", &ORPGRDA_get_alarm);
    }

    void wrap_orpginfo()
    {
	def("orpginfo_set_super_resolution_enabled", &ORPGINFO_set_super_resolution_enabled);
	def("orpginfo_clear_super_resolution_enabled", &ORPGINFO_clear_super_resolution_enabled);
	def("orpginfo_set_cmd_enabled", &ORPGINFO_set_cmd_enabled);
	def("orpginfo_clear_cmd_enabled", &ORPGINFO_clear_cmd_enabled);
        def("orpginfo_is_sails_enabled", &ORPGINFO_is_sails_enabled);
        def("orpginfo_is_avset_enabled", &ORPGINFO_is_avset_enabled);
        def(
            "orpginfo_statefl_get_rpgalrm", 
            &thinwrap_orpginfo_statefl_get_rpgalrm 
        );
        def(
            "orpginfo_statefl_get_rpgopst",
            &thinwrap_orpginfo_statefl_get_rpgopst
        );
	def(
	    "orpginfo_statefl_flag",
	    &thinwrap_orpginfo_statefl_flag
	);
    }

    void wrap_orpgmisc()
    {
        def(
            "orpgmisc_is_rpg_status", 
            &ORPGMISC_is_rpg_status, 
            args("check_status")
        );
        def("orpgsails_get_status", &ORPGSAILS_get_status);
        def("orpgsails_get_num_cuts", &ORPGSAILS_get_num_cuts);
    }

    void wrap_orpgvst()
    {
        def("orpgvst_get_volume_time", &ORPGVST_get_volume_time);
    }

    void wrap_orpgrat()
    {
        def(
            "orpgrat_get_alarm_text", 
            &thinwrap_orpgrat_get_alarm_text, 
            args("code")
        );
    }
    void wrap_rpgcs()
    {
	def(	
	    "rpgcs_get_time_zone",
	     &RPGCS_get_time_zone
	);
    }
    void wrap_orpgload()
    {
	def(
	    "orpgload_get_data",
	    &thinwrap_orpgload_get_data,
	    args("category","type")
	);
    }
    void export_liborpg()
    {
        class_<liborpg_ns> c("liborpg");
        scope in_liborpg = c;
	enum_<int>("LOAD_SHED_CATEGORY")
	    .value("LOAD_SHED_CATEGORY_PROD_DIST",LOAD_SHED_CATEGORY_PROD_DIST)
      	    .value("LOAD_SHED_CATEGORY_PROD_STORAGE",LOAD_SHED_CATEGORY_PROD_STORAGE)
      	    .value("LOAD_SHED_CATEGORY_INPUT_BUF",LOAD_SHED_CATEGORY_INPUT_BUF)
      	    .value("LOAD_SHED_CATEGORY_RDA_RADIAL",LOAD_SHED_CATEGORY_RDA_RADIAL)
      	    .value("LOAD_SHED_CATEGORY_RPG_RADIAL",LOAD_SHED_CATEGORY_RDA_RADIAL)
      	    .value("LOAD_SHED_CATEGORY_WB_USER",LOAD_SHED_CATEGORY_WB_USER)
	;
	enum_<short>("LOAD_SHED_TYPE")
	    .value("LOAD_SHED_WARNING_THRESHOLD",LOAD_SHED_WARNING_THRESHOLD)
	    .value("LOAD_SHED_ALARM_THRESHOLD",LOAD_SHED_ALARM_THRESHOLD)
	    .value("LOAD_SHED_CURRENT_VALUE",LOAD_SHED_CURRENT_VALUE)
	;

	in_liborpg.attr("LOAD_SHED_THRESHOLD_MSG_ID") = LOAD_SHED_THRESHOLD_MSG_ID;
	in_liborpg.attr("LOAD_SHED_CURRENT_MSG_ID") = LOAD_SHED_CURRENT_MSG_ID;
	in_liborpg.attr("LOAD_SHED_THRESHOLD_BASELINE_MSG_ID") = LOAD_SHED_THRESHOLD_BASELINE_MSG_ID;
	enum_<Orpginfo_statefl_flagid_t>("Orpginfo_statefl_flagid_t")
	    .value("ORPGINFO_STATEFL_FLG_SPARE",ORPGINFO_STATEFL_FLG_SPARE)
            .value("ORPGINFO_STATEFL_FLG_PRFSELECT",ORPGINFO_STATEFL_FLG_PRFSELECT)
            .value("ORPGINFO_STATEFL_FLG_SBIMPLEM",ORPGINFO_STATEFL_FLG_SBIMPLEM)
            .value("ORPGINFO_STATEFL_FLG_PRFSF_PAUSED",ORPGINFO_STATEFL_FLG_PRFSF_PAUSED)
            .value("ORPGINFO_STATEFL_FLG_SUPER_RES_ENABLED",ORPGINFO_STATEFL_FLG_SUPER_RES_ENABLED)
            .value("ORPGINFO_STATEFL_FLG_CMD_ENABLED",ORPGINFO_STATEFL_FLG_CMD_ENABLED)
            .value("ORPGINFO_STATEFL_FLG_AVSET_ENABLED",ORPGINFO_STATEFL_FLG_AVSET_ENABLED)
            .value("ORPGINFO_STATEFL_FLG_SAILS_ENABLED",ORPGINFO_STATEFL_FLG_SAILS_ENABLED)
	;
        wrap_orpgda();
        wrap_orpgrda();
        wrap_orpgmisc();
        wrap_orpginfo();
        wrap_orpgrat();
        wrap_orpgvst();
	wrap_orpgsails();
	wrap_rpgcs();
	wrap_orpgload();
        c.staticmethod("orpgrda_send_cmd")
            .staticmethod("orpgrda_get_wb_status")
            .staticmethod("orpgrda_get_status")
            .staticmethod("orpgrda_read_alarms")
            .staticmethod("orpgrda_get_num_alarms")
            .staticmethod("orpgrda_get_alarm")
            .staticmethod("orpgda_lbname")
	    .staticmethod("orpgda_lbfd")
            .staticmethod("orpgda_open")
            .staticmethod("orpgda_close")
	    .staticmethod("orpgda_read_syslog")
	    .staticmethod("orpgda_read_sails")
	    .staticmethod("orpgda_write_permission")
            .staticmethod("orpgmisc_is_rpg_status")
            .staticmethod("orpginfo_is_sails_enabled")
            .staticmethod("orpginfo_is_avset_enabled")
            .staticmethod("orpginfo_statefl_get_rpgalrm")
            .staticmethod("orpginfo_statefl_get_rpgopst")
	    .staticmethod("orpginfo_set_super_resolution_enabled")
            .staticmethod("orpginfo_clear_super_resolution_enabled")
            .staticmethod("orpginfo_set_cmd_enabled")
            .staticmethod("orpginfo_clear_cmd_enabled")
            .staticmethod("orpgsails_get_status")
            .staticmethod("orpgsails_init")
            .staticmethod("orpgsails_get_num_cuts")
	    .staticmethod("orpgsails_set_req_num_cuts")
	    .staticmethod("orpgsails_allowed")
	    .staticmethod("orpgsails_get_site_max_cuts")
            .staticmethod("orpgvst_get_volume_time")
            .staticmethod("orpgrat_get_alarm_text")
	    .staticmethod("rpgcs_get_time_zone")
	    .staticmethod("orpgload_get_data")
            .staticmethod("orpginfo_statefl_flag")
	    .staticmethod("orpgda_read_syslog_full")
	;
    }
}

