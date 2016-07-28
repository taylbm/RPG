##
### page.mako - this is a layout for pages
###

###
### see if we should include a full page layout
###

<%
layout = self.attr.layout_name
%>

% try:
    % if self.attr.inherit_layout is True:
        <%inherit file="layout.mako" />
    % endif
% except:
    ### just swallow this, we only care if it exists
% endtry
 

			

###
### content
###

<div data-role="page" id="${self.attr.page_id}" class="${self.attr.page_classes}">
% if self.attr.page_id == "main-page" or self.attr.page_id == "ops-page":
<div data-role="navbar">
    <ul>
        <li><div id="clock_contain"><div style="text-align:center" id="clockbox-date"></div><div style="text-align:center" class="center" id="clockbox-time"></div></div></li>
        <li><a id="88D-ops" style="color:white" class="nav-item control-shadow" href="#">WSR-88D Operations</a></li>
        % if self.attr.page_id == "main-page":
        <li><a id="shift-change" style="color:white" class="nav-item control-shadow">Shift Change Checklist</a></li>
        <li><a id="prf_control" style="color:white" class="nav-item control-shadow" href="#">PRF Control</a></li>
        <li><a id="enviro_data" style="color:white" class="nav-item control-shadow" href="#">Environmental Data</a></li>
	% elif self.attr.page_id == "ops-page":
        <li><button id="pass-protect" value="locked" style="color:white;text-align:center" class="ui-btn ui-icon-lock ui-btn-icon-left nav-item control-shadow">Locked</button></li>
        <li><a id="close"data-theme="b" style="position:relative;left:0px;top:0px" class="ui-btn-left ui-btn ui-btn-inline ui-btn-icon-left ui-icon-back" href="#">Close</a></li>
	% endif
    </ul>
</div>
% endif

${next.body()}

</div>



