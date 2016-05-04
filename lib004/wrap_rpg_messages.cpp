#include <boost/python.hpp>
using boost::python::class_;
using boost::python::extract;
using boost::python::len;
using boost::python::list;
using boost::python::scope;

#include <boost/shared_ptr.hpp>
using boost::shared_ptr;

extern "C"
{
    #include <orpg.h>
}

#include "wrap_rpg_messages.h"

namespace rpg
{
    shared_ptr<VCP_elevation_cut_header_t> wrap_set_vcp_elevation_cut_header_t_data(
        shared_ptr<VCP_elevation_cut_header_t> self,
        list data
    )
    {
        for (int i = 0; i < len(data); i++)
            self->data[i] = extract<VCP_elevation_cut_data_t>(data[i]);

        return self;
    }

    list wrap_get_vcp_elevation_cut_header_t_data(
        shared_ptr<VCP_elevation_cut_header_t> self
    )
    {
        list l;

        for (short i = 0; i < self->number_cuts; i++)
            l.append(self->data[i]);

        return l;
    }

    void wrap_vcp_message_header_t()
    {
        class_<VCP_message_header_t, 
                shared_ptr<VCP_message_header_t> >("VCP_message_header_t")
            .def_readwrite("msg_size", &VCP_message_header_t::msg_size)
            .def_readwrite("pattern_type", &VCP_message_header_t::pattern_type)
            .def_readwrite("pattern_number", 
                            &VCP_message_header_t::pattern_number)
        ;
    }
    
    void wrap_vcp_elevation_cut_data_t()
    {
        class_<VCP_elevation_cut_data_t, 
                shared_ptr<VCP_elevation_cut_data_t> >("VCP_elevation_cut_data_t")
            .def_readwrite("angle", &VCP_elevation_cut_data_t::angle)
            .def_readwrite("phase", &VCP_elevation_cut_data_t::phase)
            .def_readwrite("waveform", &VCP_elevation_cut_data_t::waveform)
            .def_readwrite("super_res", &VCP_elevation_cut_data_t::super_res)
            .def_readwrite("surv_prf_num", 
                            &VCP_elevation_cut_data_t::surv_prf_num)
            .def_readwrite("surv_prf_pulse", 
                            &VCP_elevation_cut_data_t::surv_prf_pulse)
            .def_readwrite("azimuth_rate", 
                            &VCP_elevation_cut_data_t::azimuth_rate)
            .def_readwrite("refl_thresh", 
                            &VCP_elevation_cut_data_t::refl_thresh)
            .def_readwrite("vel_thresh", &VCP_elevation_cut_data_t::vel_thresh)
            .def_readwrite("sw_thresh", &VCP_elevation_cut_data_t::sw_thresh)
            .def_readwrite("diff_refl_thresh", 
                            &VCP_elevation_cut_data_t::diff_refl_thresh)
            .def_readwrite("diff_phase_thresh", 
                            &VCP_elevation_cut_data_t::diff_phase_thresh)
            .def_readwrite("corr_coeff_thresh", 
                            &VCP_elevation_cut_data_t::corr_coeff_thresh)
            .def_readwrite("edge_angle1", 
                            &VCP_elevation_cut_data_t::edge_angle1)
            .def_readwrite("dopp_prf_num1", 
                            &VCP_elevation_cut_data_t::dopp_prf_num1)
            .def_readwrite("dopp_prf_pulse1", 
                            &VCP_elevation_cut_data_t::dopp_prf_pulse1)
            .def_readwrite("edge_angle2", 
                            &VCP_elevation_cut_data_t::edge_angle2)
            .def_readwrite("dopp_prf_num2", 
                            &VCP_elevation_cut_data_t::dopp_prf_num2)
            .def_readwrite("dopp_prf_pulse2", 
                            &VCP_elevation_cut_data_t::dopp_prf_pulse2)
            .def_readwrite("edge_angle3", 
                            &VCP_elevation_cut_data_t::edge_angle3)
            .def_readwrite("dopp_prf_num3", 
                            &VCP_elevation_cut_data_t::dopp_prf_num3)
            .def_readwrite("dupp_prf_pulse3", 
                            &VCP_elevation_cut_data_t::dopp_prf_pulse3)
        ;
    }
    
    void wrap_vcp_elevation_cut_header_t()
    {
        class_<VCP_elevation_cut_header_t, 
                shared_ptr<VCP_elevation_cut_header_t> >("VCP_elevation_cut_header_t")
            .def_readwrite("number_cuts", 
                            &VCP_elevation_cut_header_t::number_cuts)
            .def_readwrite("group", &VCP_elevation_cut_header_t::group)
            .def_readwrite("doppler_res", 
                            &VCP_elevation_cut_header_t::doppler_res)
            .def_readwrite("pulse_width", 
                            &VCP_elevation_cut_header_t::pulse_width)
            .add_property(
                "data", 
                &wrap_get_vcp_elevation_cut_header_t_data, 
                &wrap_set_vcp_elevation_cut_header_t_data
            )
        ;
    }
    
    void wrap_vcp_icd_msg_t()
    {
        class_<VCP_ICD_msg_t, shared_ptr<VCP_ICD_msg_t> >("VCP_ICD_msg_t")
            .def_readwrite("vcp_msg_hdr", &VCP_ICD_msg_t::vcp_msg_hdr)
            .def_readwrite("vcp_elev_data", &VCP_ICD_msg_t::vcp_elev_data)
        ;
    }
    
    void export_vcp_messages()
    {
        wrap_vcp_message_header_t();
        wrap_vcp_elevation_cut_data_t();
        wrap_vcp_elevation_cut_header_t();
        wrap_vcp_icd_msg_t();
    }
    
    void export_rpg_messages()
    {
        scope in_rpgvcp = class_<rpgvcp_ns>("rpgvcp");
        in_rpgvcp.attr("MAX_ELEVATION_CUTS") = MAX_ELEVATION_CUTS;
        in_rpgvcp.attr("VCP_CONST_ELEV_CUT_PT") = VCP_CONST_ELEV_CUT_PT;
        in_rpgvcp.attr("VCP_HORIZ_RAST_SCAN_PT") = VCP_HORIZ_RAST_SCAN_PT;
        in_rpgvcp.attr("VCP_VERT_RAST_SCAN_PT") = VCP_VERT_RAST_SCAN_PT;
        in_rpgvcp.attr("VCP_SEARCHLIGHT_PT") = VCP_SEARCHLIGHT_PT;

        export_vcp_messages();
    }
}

