###
### page.mako - this is a layout for pages
###

###
### see if we should include a full page layout
###




 
<%inherit file= "vcp.mako"/>
	

			

    ### just swallow this, we only care if it exists


###
### content
###

<div data-role="page" id="${self.attr.page_id}" class="${self.attr.page_classes}">


    <div role="main" class="ui-content">

        ${next.body()}
    </div>

</div>

