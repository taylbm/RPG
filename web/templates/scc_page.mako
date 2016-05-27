###
### page.mako - this is a layout for pages
###

###
### see if we should include a full page layout
###




 
<%inherit file= "scc_layout.mako"/>
	

			

    ### just swallow this, we only care if it exists


###
### content
###

<div data-role="page" id="${self.attr.page_id}" class="${self.attr.page_classes}">
${next.body()}
</div>

