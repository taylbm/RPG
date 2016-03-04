###
### vcp.mako - this is the page for VCP Command and Control
###

###
### namespaces
###


###
### body
###

<!doctype html>
<html>

    <head>
        <title>VCP Mode and Control</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <%include file="jquery.mako" args="all=True" />
        <%block name="extra_header_markup" />

    </head>

    <body id="top_level">
        <%

       vcp_list = [x for x in context.keys() if x.isdigit()]
        
	%>

        ${next.body()}




        <div data-role="page" id="vcp-def">
            <div data-role="header">
                <h2>VCP Definition</h2>
                <a href="#" data-rel="back" class="ui-btn-left ui-btn ui-btn-inline ui-corner-all ui-btn-icon-left ui-icon-back">Back</a>
            </div>
            <div id ="vcpDef" role="main" class="ui-content">
	    	<div id="radioContain">            	
		    <form>
	    		<fieldset data-theme="b" id="vcpselector" class="ui-controlgroup ui-controlgroup-horizontal ui-corner-all" data-role="controlgroup" data-type="horizontal">
			<legend>VCP:</legend><div class="ui-controlgroup-controls">			
    			<div class="ui-radio">
    			    %for vcp in vcp_list:
    				<input type="radio" name="vcp-choice" id="${vcp}" value="off">
    				<label id="${vcp}" class="v${vcp} vcp-button ui-btn ui-corner-all ui-btn-inherit ui-radio-off" for="${vcp}">${vcp}</label>
    			    %endfor
    			</div>
			</fieldset>
	    	    </form>
		</div>
		<table data-role="table" id="TableContain" class="ui-body-d ui-shadow table-stripe ui-responsive" data-column-btn-theme="b" ></table>
	    	<div style="display:none">
	 	% for vcp in vcp_list:
                    <table data-role="table" id="vcpTable-${vcp}" class="ui-body-d ui-shadow table-stripe ui-responsive" data-column-btn-theme="b" >
                    <thead>
                        <tr class="ui-bar-d">
                            <th data-priority="2" colspan="2" style="text-align:center;">Elevation</th>
                            <th data-priority="3" style="text-align:center;">Scan</th>
                            <th data-priority="1" style="text-align:center;">DP</th>
                            <th data-priority="5" style="text-align:center;">SR</th>
                            <th data-priority="6" style="text-align:center;">Waveform</th>
                            <th data-priority="7" style="text-align:center;" colspan="2">Sector 1</th>
                            <th data-priority="8" style="text-align:center;" colspan="2">Sector 2</th>
                            <th data-priority="9" style="text-align:center;" colspan="2">Sector 3</th>
                            <th data-priority="10" style="text-align:center;" colspan="3">Signal/Noise Ratio (dB)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                    	    <th style="text-align:center;">#</th><th style="text-align:center;">Deg</th>
                	    <th style="text-align:center;">Deg/Sec</th>
                	    <th style="text-align:center;">Y/N</th>
                	    <th style="text-align:center;">Y/N</th>
                	    <th style="text-align:center;">Type</th>
                	    <th style="text-align:center;">Az</th><th style="text-align:center;">PRF #</th>
                	    <th style="text-align:center;">Az</th><th style="text-align:center;">PRF #</th>
                	    <th style="text-align:center;">Az</th><th style="text-align:center;">PRF #</th>
                	    <th style="text-align:center;">Refl</th><th style="text-align:center;">Vel</th><th style="text-align:center;">Width</th>
                	</tr>
                        <tr>
        		<%
                	Elev = context.get(vcp).get("Elev_attr")
                	sorted_elevs = sorted([int(elevation.split('_')[1]) for elevation in Elev])        
        		%>
        		% for elev in sorted_elevs:
        		    <% Elev_num = Elev.get("Elev_"+str(elev)) %>		
                	<tr>
                	    <td style="text-align:center;">${elev}</td>
                	    <td style="text-align:center;">${Elev_num.get("elev_ang_deg")}</td>
                	    <td style="text-align:center;">${Elev_num.get("scan_rate_dps")}</td>
                	    <td style="text-align:center;">${Elev_num.get("dual_pol")}</td>
			    % if Elev_num.get("super_res") == 3.0:
			    <td style="text-align:center;">Yes</td>
			    % else:
			    <td style="text-align:center;">No</td>
			    % endif
                	    <td style="text-align:center;">${Elev_num.get("waveform_type")}</td>
        		    % if Elev_num.get("waveform_type") == "CS": 
                	    <td style="text-align:center;"></td>
			    <td style="text-align:center;"></td>
			    <td style="text-align:center;"></td>
			    <td style="text-align:center;"></td>
			    <td style="text-align:center;"></td>
			    <td style="text-align:center;"></td>
			    % else: 
			    <td style="text-align:center;">${int(Elev_num.get("Sector_1").get("edge_angle"))}</td>
			    <td style="text-align:center;">${int(Elev_num.get("Sector_1").get("dop_prf"))}</td>
			    <td style="text-align:center;">${int(Elev_num.get("Sector_2").get("edge_angle"))}</td>
			    <td style="text-align:center;">${int(Elev_num.get("Sector_2").get("dop_prf"))}</td>
			    <td style="text-align:center;">${int(Elev_num.get("Sector_3").get("edge_angle"))}</td>
			    <td style="text-align:center;">${int(Elev_num.get("Sector_3").get("dop_prf"))}</td>
			    % endif
			    % for num in Elev_num.get("SNR_thresh_dB"):
			    <td style="text-align:center;">${num}</td>
			    % endfor	
			</tr>	
        		%endfor
                    </tbody>
                    </table>
        	    % endfor
                </div>
	    </div>
	</div>
        % for vcp in vcp_list:
            % if context.get(vcp).get("multi").get("bool"):
                <%
		
                master = context.get(vcp).get("multi").get("multi_helper")[0]
                if master == vcp:
                    vcp_list.remove(context.get(vcp).get("multi").get("multi_helper")[1])
                    other_vcp = context.get(vcp).get("multi").get("multi_helper")[1]
                else:
                    vcp_list.remove(master)
                    other_vcp = master
                %>
                <div alt=${vcp} id="vcp-${vcp}-page" class="plot-page" data-role="page">
                    <div data-role="header">
                        <h2>VCP ${vcp}/${other_vcp} Details</h2>
                        <a href="#" data-rel="back" class="ui-btn-left ui-btn ui-btn-inline ui-corner-all ui-btn-icon-left ui-icon-back">Back</a>
                    </div>
                    <div role="main" class="ui-content">
                        <h3 class="ui-bar ui-bar-a ui-corner-all">VCP ${vcp}/${other_vcp}</h3>
                        <div class="ui-body ui-body-a ui-corner-all vcp-details" style="height:600px; width:600px; margin:auto;">
                            <div></div>
			    <div id="vcp${vcp}-draw-details" style="height:500px; width: 500px; margin:auto;" class="vcp-details"></div>
			</div>
                    </div>
                </div>
            % else:
                <div alt=${vcp} id="vcp-${vcp}-page" class="plot-page" data-role="page">
                    <div data-role="header">
                        <h2>VCP ${vcp} Details</h2>
                        <a href="#" data-rel="back" class="ui-btn-left ui-btn ui-btn-inline ui-corner-all ui-btn-icon-left ui-icon-back">Back</a>
                    </div>
                    <div role="main" class="ui-content">
                        <h3 class="ui-bar ui-bar-a ui-corner-all">VCP ${vcp}</h3>
                        <div class="ui-body ui-body-a ui-corner-all vcp-details" style="height:600px; width:600px; margin:auto;">
                            <div></div>
			    <div id="vcp${vcp}-draw-details" style="height:500px; width: 500px; margin:auto;" class="vcp-details"></div>
                        </div>
                    </div>
                </div>
            % endif
        % endfor

    </div>
    </body>
</html>

