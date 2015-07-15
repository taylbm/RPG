###
### layout.mako - this is the main layout for, it's designed to be inherited
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
        <title>RPG HCI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <%include file="jquery.mako" args="all=True" />
        <%block name="extra_header_markup" />

    </head>
    <body id="top_level">

        ${next.body()}
        <div data-role="page" id="vcp-def">
            <div data-role="header">
                <h2>VCP Definition</h2>
                <a href="#" data-rel="back" class="ui-btn-left ui-btn ui-btn-inline ui-corner-all ui-btn-icon-left ui-icon-back">Back</a>
            </div>
            <div id ="vcpDef" role="main" class="ui-content">
	    <div id="radioContain"></div>
	    <div id="tableContain"></div>
	    </div>
	    <div data-role="footer">
                <h3>NEXRAD Radar Operations Center</h3>
            </div>
        </div>
    </body>
</html>

