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
        <title>RPG Control/Status</title>
 	<link rel="shortcut icon" href="static/radome.ico" type="image/x-icon" /> 
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <%include file="jquery.mako" args="all=True" />
        <%block name="extra_header_markup" />

    </head>
           <div id="sails-form">
            <label for="select-choice-0" class="select sails-title">Number of SAILS cuts:</label>
            <select name="select-choice-0" id="select-choice-0">
            % for x in xrange(3):
                % if context.get('CFG_dict').get('max_sails') >= x+1:
                    <option value=${x+1}>${x+1}</option>
                % else:
                    <option value=${x+1} disabled=true>${x+1}</option>
                % endif
            % endfor
            </select>
        </div>
 
    <body id="top_level">
        ${next.body()}

    </body>
</html>

