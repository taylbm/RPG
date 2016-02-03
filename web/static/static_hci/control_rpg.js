
    function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'static/static_hci/hci_cfg.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
    }
    
    var DATA = {}
    
    function init() {
        loadJSON(function(response) {
            // Parse JSON string into object
            DATA = JSON.parse(response);
        });
    }

init();


$(document).ready(function(){
    $(".control-item").css('background-color','#1F497D','color','#FFFFFF');
    $(".nav-item").css('background-color','#002060');
    $("#MRPG :input").click(function(){
        var command = $(this).val();
	$('#pop-confirm').attr("value",command);
	$.getJSON("/mrpg_state",function(data){
            var mrpg_state = data['MRPG_state']
	    switch(command) {
		case 'MRPG_STARTUP':
		    if( mrpg_state == 'MRPG_ST_STANDBY' || 
		        mrpg_state == 'MRPG_ST_SHUTDOWN'|| 
		        mrpg_state == 'MRPG_ST_OPERATING' ) {	
			$("#id-confirm").html(DATA.controlRPG.SUB[0]+DATA.controlRPG.MRPG_STARTUP[mrpg_state]+DATA.controlRPG.SUB[1])
			$("#popupDialog").popup('open');
		    }
		    else {
		        $("#popupAlert").popup('open');
			$("#id-info").html(DATA.controlRPG.MRPG_STARTUP.FAIL)
		    }
		    break;
		case 'MRPG_CLEANUP':
		    if( mrpg_state == 'MRPG_ST_STANDBY' || 
			mrpg_state == 'MRPG_ST_SHUTDOWN' || 
			mrpg_state == 'MRPG_ST_OPERATING' ) {
                        $("#id-confirm").html(DATA.controlRPG.MRPG_CLEANUP.SUCESS+DATA.controlRPG.SUB[1])
		        $("#popupDialog").popup('open');	
		    }
		    else { 
        	   	$("#popupAlert").popup('open');	
			$("#id-info").html(DATA.controlRPG.MRPG_CLEANUP.FAIL)
		    }
		    break;
		case 'MRPG_SHUTDOWN': case 'MRPG_STANDBY':
                    $("#id-confirm").html(DATA.controlRPG.SHUTDOWN+DATA.controlRPG.SUB[1])
	            $("#popupDialog").popup('open');    
                    break;
	    }       	 
        });
        $('#popupDialog').trigger('create')
    });
    $("#pop-confirm").click(function(){
	var command = $(this).attr("value")
	if (command != 'MRPG_CLEANUP')
            $.post('/mrpg',{COM:command});
	else
	    $.get("/mrpg_clean"); 
    });
    $("#pass-protect").click(function(){
	if ($(this).attr("value") == "locked") {
	    $("#pass-protect").attr("class","ui-btn ui-icon-edit ui-btn-icon-left control-item control-shadow")
	    $(this).attr("value","unlocked")
	    $(this).html("Unlocked")
	    $("input[type='checkbox']").checkboxradio('enable');	    
	}
	else {
	    $("#pass-protect").attr("class","ui-btn ui-icon-lock ui-btn-icon-left control-item control-shadow")
	    $(this).attr("value","locked")
	    $(this).html("Locked")
            $("input[type='checkbox']").checkboxradio('disable');   
	}
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
	
