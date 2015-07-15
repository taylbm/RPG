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

    </body>
</html>

