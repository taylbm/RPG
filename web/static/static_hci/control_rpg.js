$(document).ready(function(){
    $(".control-item").css('background-color','#1F497D','color','#FFFFFF');
    $(".nav-item").css('background-color','#002060');
    $("#MRPG :input").click(function(){
	command = $(this).val()
        $.post('/mrpg',{COM:command});
    }); 
	    var non_rapid = new EventSource('/update_s');
	    non_rapid.addEventListener('RPG_dict',function(e) {
		var RPG = JSON.parse(e.data)
	        $('#RPG_state').html(RPG['RPG_state']);
                $('#RPG_oper').html(RPG['RPG_op'].split(',')[0])
                switch (RPG['RPG_op'].split(',')[0]){
                case 'CMDSHDN':
                        $('#RPG_oper').attr('class','minor-alarm bar-border2')
                        break;
                case 'LOADSHED': case 'MAR':
                        $('#RPG_oper').attr('class','minor-alarm bar-border2')
                        $('#grid2').attr('class','minor-alarm-grid')
                        $('#Alarms').attr('class','minor-alarm')
                        break;
                case 'MAM':
                        $('#RPG_oper').attr('class','major-alarm bar-border2')
                        $('#grid2').attr('class','major-alarm-grid')
                        $('#Alarms').attr('class','major-alarm');
                        break;
                case 'ONLINE':
                        if(RPG['RPG_alarms'] == 'NONE'){$('#grid2').attr('class','normal-ops-grid')}
                        $('#RPG_oper').attr('class','normal-ops bar-border2')
                        break;
                default:
                        $('#RPG_oper').attr('class','inop-indicator bar-border2')
                        $('#grid2').attr('class','normal-ops-grid')
                };
                switch(RPG['RPG_state']){
                    case 'OPER': case 'STANDBY':
                        $('#RPG_state').attr('class','bar-border2 normal-ops');
                        break;
                    case 'RESTART':
                        $('#RPG_state').attr('class','bar-border2 inop-indicator');
                        break;
                    case 'TEST':
                        $('#RPG_state').attr('class','bar-border2 minor-alarm');
                        break;
                    case 'SHUTDOWN':
                        $('#RPG_state').attr('class','bar-border2 inop-indicator')
                        break;
                };

	
		
	    });

	$('#refreshPage').click(function(){
		location.reload()
	});
	$('#perf_check_time').click(function(){
		$.get("/button?id=hci_rdc_orda");
	});
	$('#Mode_Conflict_contain').click(function(){
		$.get("/button?id=hci_mode_status");
	});
	$('#prf_control').click(function(){
		$.get("/button?id=hci_prf");
	});	

	$('#enviro_data').click(function(){
		$.get("/button?id=hci_wind");
	});
	$('#Precip_contain').click(function(){
		$.get("/button?id=hci_precip_status")
	});
	$('#vcp-button').click(function(){
		window.open("http://localhost:3142","_blank","width= 1024, height = 720, scrollbars=yes");
	});
	$('#RDA_Messages').val("on").slider("refresh")
	$('#close').click(function(){
		window.close();
	});
		
    });
	
