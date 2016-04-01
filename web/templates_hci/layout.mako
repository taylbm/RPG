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
    % if self.attr.page_id == "main-page":
        <div data-role="none" id="sails-form">
            <label for="select-choice-0" class="select sails-title">Number of SAILS cuts:</label>
            <select name="select-choice-0" id="select-choice-0">
            % for x in xrange(4):
            % if context.get('CFG_dict').get('max_sails') >= x:
                <option value=${x}>${x}</option>
            % else:
                <option value=${x} disabled=true>${x}</option>
            % endif
            % endfor
            </select>
        </div>

    % endif


    <body id="top_level">
        ${next.body()}
    </body>
    % if self.attr.page_id == "main-page":
        ${self.control_rpg.content()}
        ${self.control_rda.content()}
    % endif


</html>

