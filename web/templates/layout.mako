###
## layout.mako - this is the main layout for the hci, it's designed to be inherited
###


###
### namespaces
###
<%namespace name="control_rpg" file="control_rpg.html" inheritable="True"/>
<%namespace name="control_rda" file="control_rda.html" inheritable="True"/>


###
### body
###

<!doctype html>
<html>

    <head>
        <title>${self.attr.page_title}</title>
 	<link rel="shortcut icon" href="static/radome.ico" type="image/x-icon" /> 
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <%include file="jquery.mako" args="all=True" />
        <%block name="extra_header_markup"/>

    </head>
    <body id="top_level">
        ${next.body()}
    </body>
    % if self.attr.page_id == "main-page":
        ${self.control_rpg.content()}
        ${self.control_rda.content()}
    % endif


</html>

