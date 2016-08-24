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
DEFAULTS = {}
    function GetClock(){
    var d=new Date();
    var nday=d.getUTCDay(),nmonth=d.getUTCMonth(),ndate=d.getUTCDate(),nyear=d.getUTCFullYear();
    if(nyear<1000) nyear+=1900;
    var d=new Date();
    var nhour=d.getUTCHours(),nmin=d.getUTCMinutes(),nsec=d.getUTCSeconds();
    if(nmin<=9) nmin="0"+nmin
    if(nsec<=9) nsec="0"+nsec;

    $('#clockbox-date').html(""+DATA.calendar.tday[nday]+", "+DATA.calendar.tmonth[nmonth]+" "+ndate+", "+nyear);
    $('#clockbox-time').html(""+nhour+":"+nmin+":"+nsec+" "+"UT");
    }
    function perfCheck(end){
        setInterval(function(){
            var remaining = end*1000-Date.parse(new Date())
            if(remaining < DATA.perfCheckYellow){
                $('#perf_check_time').css('background-color','#FCFC23')
            }
            else{
                $('#perf_check_time').css('background-color','white')
            }
            var d = new Date(end*1000-Date.parse(new Date()))
            var nhour=d.getUTCHours(),nmin=d.getUTCMinutes(),nsec=d.getUTCSeconds();
            $('#perf_check_time').html(nhour+'h '+nmin+'m '+nsec+'s')
            if(remaining < 0){
                $('#perf_check_time').html('PENDING').css('background-color','#51FF22')
            }
        },1000);
    }
    function buildSAILS() {
        var innerHTML = '<label for="sailsCuts" class="select sails-title">Number of SAILS cuts:</label><select name="sailsCuts" id="sailsCuts">'
            for (i=0;i<=ADAPT['max_sails'];i++)
                innerHTML += '<option value='+i.toString()+'>'+i.toString()+'</option>'
            innerHTML += '</select>'
        return innerHTML
    }
    function buildMRLE() {
        var innerHTML = '<label for="mrleCuts" class="select mrle-title">Number of MRLE cuts:</label><select name="mrleCuts" id="mrleCuts">'
            for (i=0;i<=ADAPT['max_mrle'];i++)
                innerHTML += '<option value='+i.toString()+'>'+i.toString()+'</option>'
            innerHTML += '</select>'
        return innerHTML
    }
    window.onload=function(){
    GetClock();
    setInterval(GetClock,DATA.clockInterval);
    }

    var PMD = {}
    var RPG = {}
    var RS = {}
    var ADAPT = {}
    $(document).ready(function(){
	$(".control-item").css('background-color','#1F497D','color','#FFFFFF');
	$(".nav-item").css('background-color','#002060');
        $('#PRF_Mode').on('slidestop',function() {
            $('#prf_control').click()
            value = $(this).val() == "on" ? "off" : "on";
            $(this).val(value).slider('refresh');
        });
        $('#AVSET_Exception').on('slidestop',function() {
            var val = $(this).val() == "on"
            $("#popupDialog").popup('open');
            $("#popupDialog").attr('alt','AVSET');
            $("#pop-title").html(DATA.popTitle)
            $("#optional-insert").html('');
            if (val){
                $("#id-confirm").html(DATA.hardCommandConfirm[0]+"AVSET"+DATA.hardCommandConfirm[1])
            }
            else{
                $("#id-confirm").html(DATA.softCommandConfirm[0]+"AVSET"+DATA.softCommandConfirm[1]+"DISABLED"+DATA.softCommandConfirm[2])
            }
            $('#popupDialog').trigger('create');
            $('#pop-confirm').attr("value",val ? "ENABLE" : "DISABLE");
            $('#pop-cancel').attr("value",val ? "off" : "on");
            $('#pop-cancel').attr("alt",$(this).attr("id"));
        });
        $('#RS_CMD').on('slidestop',function() {
            var val = $(this).val() == "on"
            $("#popupDialog").popup('open');
            $("#popupDialog").attr('alt','CMD');
            $("#pop-title").html(DATA.popTitle)
            $("#optional-insert").html('');
            if (val){
                $("#id-confirm").html(DATA.hardCommandConfirm[0]+"CMD"+DATA.hardCommandConfirm[1])
            }
            else{
                $("#id-confirm").html(DATA.softCommandConfirm[0]+"CMD"+DATA.softCommandConfirm[1]+"DISABLED"+DATA.softCommandConfirm[2])
            }
            $('#popupDialog').trigger('create');
            $('#pop-confirm').attr("value",val ? "ENABLE" : "DISABLE");
            $('#pop-cancel').attr("value",val ? "off" : "on");
            $('#pop-cancel').attr("alt",$(this).attr("id"));
        });
        $('#SAILS_Exception').on('slidestop',function() {
            $("#popupDialog").popup('open');
            $("#popupDialog").attr('alt','SAILS');
            $("#pop-title").html(DATA.popTitleSAILS);
            $("#optional-insert").html(buildSAILS());
            $("#id-confirm").html(DATA.SAILSDialog);
            $('#popupDialog').trigger('create');
            $('#pop-cancel').attr("value",$(this).val() == "on" ? "off" : "on");
            $('#pop-cancel').attr("alt",$(this).attr("id"));
        });
        $('#MRLE_Exception').on('slidestop',function() {
            $("#popupDialog").popup('open');
            $("#popupDialog").attr('alt','MRLE');
            $("#pop-title").html(DATA.popTitleMRLE);
            $("#optional-insert").html(buildMRLE());
            $("#id-confirm").html(DATA.MRLEDialog);
            $('#popupDialog').trigger('create');
            $('#pop-cancel').attr("value",$(this).val() == "on" ? "off" : "on");
            $('#pop-cancel').attr("alt",$(this).attr("id"));
        });

 
	$(".default-select").on('click',function(){
            $("#popupDialog").attr('alt','defaults');
	    var element = $(this);
	    var value = element.attr('value');
	    var id = element.parent().attr('id');
	    switch(id) {
		case 'default_wx_mode':	
		    $('#id-confirm').html(DATA.defaults.Pre+DATA.defaults.defWx+' '+value+' ?');
		    break;
		case 'default_mode_A':
                    $('#pop-confirm').attr("alt","A");
                    $('#id-confirm').html(DATA.defaults.Pre+DATA.defaults.defModeA+' '+value+' ?');
		    break;
		case 'default_mode_B':	
		    $('#pop-confirm').attr("alt","B");
                    $('#id-confirm').html(DATA.defaults.Pre+DATA.defaults.defModeB+' '+value+' ?');
		    break;
	    };
	    $('#pop-cancel').attr("value",id);
	    $('#pop-confirm').attr("value",value);
            $("#pop-title").html(DATA.popTitle);	
	    $("#popupDialog").popup('open');
	});
        $('.flag').on('slidestop',function() {
            $("#popupDialog").popup('open');
            $("#popupDialog").attr('alt','FLAG');
            $("#pop-title").html(DATA.popTitle); 
            id = $(this).attr('id');
            display = $(this).attr('alt');
            value = $(this).val();
            val = id == 'Model_Update' || id == 'VAD_Update' ? ["OFF","ON"] : ["MANUAL","AUTO"] 
            if ( value == "off")
                $("#id-confirm").html(DATA.softCommandConfirm[0]+display+DATA.softCommandConfirm[1]+val[0]+DATA.softCommandConfirm[2])      
            else
                $("#id-confirm").html(DATA.softCommandConfirm[0]+display+DATA.softCommandConfirm[1]+val[1]+DATA.softCommandConfirm[2])
            $('#pop-confirm').attr("value",id);
            $('#pop-confirm').attr("alt",value == "on" ? 1 : 0);
            $('#pop-cancel').attr("value",value == "on" ? "off" : "on");
            $('#pop-cancel').attr("alt",id);
        });
	$("#pop-confirm").on('click',function(){
	    var command = $(this).attr('value');
            var mode = $(this).attr('alt');
            var type = $('#popupDialog').attr('alt');
            switch(type) { 
                case 'defaults':
	            if($.isNumeric(command))
	                $.post('/deau_set',{SET:command,FLAG:1,MODE:mode});
	            else 
                        $.post('/deau_set',{SET:command,FLAG:0});
                    break;
                case 'SAILS':
                    num_cuts = $('#optional-insert #sailsCuts').val();
                    $.post('/sails',{NUM_CUTS:num_cuts}); 
                    break;
                case 'MRLE':
                    num_cuts = $('#optional-insert #mrleCuts').val();
                    $.post('/mrle',{NUM_CUTS:num_cuts});
                    break;
                case 'AVSET':
                    $.post('/send_rda_cmd',{COM:"RS_AVSET_"+command,FLAG:1});
                    break; 
                case 'CMD':
                    $.post('/send_rda_cmd',{COM:"RS_CMD_"+command,FLAG:1});
                    break;
                case 'FLAG':
                    $.post('/set_flag',{TYPE:'hci_set_'+command.toLowerCase()+'_flag',FLAG:mode}); 
                    break;
            }
	});
	$("#pop-cancel").on('click',function(){
	    var val = $(this).attr('value');
            var type = $('#popupDialog').attr('alt');
            var id = $(this).attr('alt'); 
            if (type == 'defaults') {
		$("#"+val).val(DEFAULTS[val]).selectmenu("refresh");
            }
            else {
                $('#'+id).val(val).slider('refresh');
            }        
	});
        $("#pass-protect").click(function(){
            $('#popupDialogPass').popup('open')
        });
        $('#pop-submit').on('click', function(event){
            user = $(":radio:checked").attr('id')
            $.ajax
                 ({
                        type:'GET',
                        url:'/auth',
                        dataType:'json',
                        async: true,
                        headers: {
                                "Authorization": "Basic " + btoa(user+":"+$('#password').val())
                        },
                        success: function (data) {
                            if ($("#pass-protect").attr("value") == "locked") {
                                $("#pass-protect").attr("class","ui-btn ui-icon-edit ui-btn-icon-left control-item control-shadow")
                                $("#pass-protect").attr("value","unlocked").html("Unlocked")
                                $("#default-contain :input").not(":button").selectmenu('enable');
                            }
                            else {
                                $("#pass-protect").attr("class","ui-btn ui-icon-lock ui-btn-icon-left control-item control-shadow")
                                $("#pass-protect").attr("value","locked").html("Locked")
				$("#default-contain :input").not(":button").selectmenu('disable');
                            }
			    $('#password').val('')
                        },
                        error: function(xhr,status,error) {
                            if (error == "Unauthorized") {
                                alert('Incorrect Password')
                            }
			    $('#password').val('')
                        }
                 });
        });
        
	    var non_rapid = new EventSource('/update_s');
	    non_rapid.addEventListener('RPG_dict',function(e) {
		RPG = JSON.parse(e.data)
                if (RPG["RPG_CMD"]){
                    if (RS["RS_CMD_STATUS"] == "ENABLED")
                        $('#RS_CMD_contain .ui-slider .ui-slider-label-a').text('ENABLED');
                    else
                        $('#RS_CMD_contain .ui-slider .ui-slider-label-a').text('PENDING');
                    $("#RS_CMD").val('on').slider('refresh');
                }
                else{
                    if (RS["RS_CMD_STATUS"] == "DISABLED")
                        $('#RS_CMD_contain .ui-slider .ui-slider-label-b').text('DISABLED');
                    else
                        $('#RS_CMD_contain .ui-slider .ui-slider-label-b').text('PENDING');
                    $("#RS_CMD").val('off').slider('refresh');
                }

                if (RPG["RPG_AVSET"]){
                    if (RS["RS_AVSET_STATUS"] == "ENABLED")
                        $('#AVSET_Exception_contain .ui-slider .ui-slider-label-a').text('ENABLED');
                    else
                        $('#AVSET_Exception_contain .ui-slider .ui-slider-label-a').text('PENDING');
                    $('#AVSET_Exception').val('on').slider('refresh');
                }
                else{
                    if (RS["RS_AVSET_STATUS"] == "ENABLED")
                        $('#AVSET_Exception_contain .ui-slider .ui-slider-label-b').text('PENDING');
                    else
                        $('#AVSET_Exception_contain .ui-slider .ui-slider-label-b').text('DISABLED');
                    $('#AVSET_Exception').val('off').slider('refresh');
                }
                if( RPG['RPG_SAILS'] ){
                    $('#SAILS_Exception').val('on').slider('refresh');
                    if( RPG['sails_status'] == 'ACTIVE' )
                        $('#SAILS_Exception_contain .ui-slider .ui-slider-label-a').text('ACTIVE/'+RPG['sails_cuts']);
                    else
                        $('#SAILS_Exception_contain .ui-slider .ui-slider-label-a').text('INACTIVE');
                }
                else{
                    $('#SAILS_Exception').val('off').slider('refresh');
                    $('#SAILS_Exception_contain .ui-slider .ui-slider-label-a').text(RPG['sails_status'])
                }
                if( RPG['RPG_MRLE'] ){
                    $('#MRLE_Exception').val('on').slider('refresh');
                    if( RPG['mrle_status'] == 'ACTIVE' )
                        $('#MRLE_Exception_contain .ui-slider .ui-slider-label-a').text('ACTIVE/'+RPG['mrle_cuts'])
                    else
                        $('#MRLE_Exception_contain .ui-slider .ui-slider-label-a').text('INACTIVE')
                }
                else{
                    $('#MRLE_Exception').val('off').slider('refresh');
                }
                if(RPG['RPG_state'] == "SHUTDOWN"){
                    var unk_list = ['AVSET_Exception','RS_CMD']
                    for (unk in unk_list){
                        $('#'+unk_list[unk]).val('off').slider('refresh')
                        $('#'+unk_list[unk]+'_contain .ui-slider .ui-slider-label-b').text('????')
                        $('#'+unk_list[unk]+'_status').removeClass('hide')
                    }
                }

	    });
	    non_rapid.addEventListener('PMD_dict',function(e) {
		var PMD_current = JSON.parse(e.data)
                if ( PMD_current['perf_check_time'] != PMD['perf_check_time'] )
                    perfCheck(PMD_current['perf_check_time']);
                if ( PMD_current['prf'] != PMD['prf'] ) {
                    switch(PMD_current['prf']){
                      case 'CELL_BASED': case 'STORM_BASED':
                          $('#PRF_Mode_contain .ui-slider .ui-slider-label-a').text('MULTI')
                          $('#PRF_Mode').val('on').slider('refresh')
                          break;
                      case 'AUTO_PRF':
                          $('#PRF_Mode_contain .ui-slider .ui-slider-label-a').text('AUTO')
                          $('#PRF_Mode').val('on').slider('refresh')
                          break;
                      case 'MANUAL_PRF':
                          $('#PRF_Mode').val('off').slider('refresh')
                          break;
                    }
                }

		if(PMD['mode_trans']){
		    $("#Mode_Conflict_contain").html('TRANS').removeClass('normal-ops').addClass('minor-alarm');
		}
		else{
		    if(PMD['mode_conflict']){
		        $("#Mode_Conflict_contain").html('YES').removeClass('normal-ops').addClass('minor-alarm');
		    }
		    else{
			$("#Mode_Conflict_contain").html('NO').removeClass('minor-alarm').addClass('normal-ops');
		    }
		}

		if(PMD['mode_conflict']){$("#Mode_Conflict_contain").html('YES').addClass('minor-alarm')}
		else{$("#Mode_Conflict_contain").html('NO').addClass('normal-ops')}
		if(PMD['current_precip_status']){$('#Precip_contain').html('ACCUM')}
		else{$('#Precip_contain').html('NO ACCUM')}
                var loadshed_cats = Object.keys(PMD_current['loadshed'])
                $('#Load_Shed_contain').html('NORMAL')
                for (lshd in loadshed_cats){
                    if(PMD_current['loadshed'][loadshed_cats[lshd]] != 'NONE'){
                        $('#Load_Shed_contain').html(PMD_current['loadshed'][lshd])
                        if(PMD['loadshed'][lshd] == 'ALARM'){
                            $('#Load_Shed_contain').attr('style','font-size:14px;background-color:blue')
                        }
                    }
                }
                if ( PMD_current['loadshed'] != PMD['loadshed'] ) {
                    var loadshed_cats = Object.keys(PMD_current['loadshed'])
                    $('#Load_Shed_contain').html('NORMAL')
                    for (lshd in loadshed_cats){
                        if(PMD_current['loadshed'][loadshed_cats[lshd]] != 'NONE'){
                            $('#Load_Shed_contain').html(PMD_current['loadshed'][loadshed_cats[lshd]])
                            $('#Load_Shed_status').removeClass('hide')
                            $('#Alarms').attr('class','bar-border loadshed')
                            if(PMD_current['loadshed'][lshd] == 'ALARM'){
                                $('#Load_Shed_contain').attr('style','background-color:#00FFFF')
                            }
                        }    
                    }
                }
                PMD = JSON.parse(e.data);


	    });

	    non_rapid.addEventListener('ADAPT_dict',function(e) {
		ADAPT = JSON.parse(e.data)
                exception_list = ['Model_Update','VAD_Update','mode_A_auto_switch','mode_B_auto_switch']
                for (e in exception_list){
                    var exception = exception_list[e]
                        if(ADAPT[exception])
                            $('#'+exception).val('on').slider('refresh');
                        else
                            $('#'+exception).val('off').slider('refresh');
                }
		default_list = ['default_wx_mode','default_mode_A','default_mode_B']
		for (d in default_list) {
		    var def = default_list[d];
		    $('#'+def).val(ADAPT[def]).selectmenu('refresh');
		    DEFAULTS[def] = ADAPT[def];	
		}
		    
	    });

 	    non_rapid.addEventListener('RS_dict',function(e) {
                RS = JSON.parse(e.data)
                if (RS["RS_CMD_STATUS"] == "ENABLED"){
                    if (RPG["RPG_CMD"])
                        $('#RS_CMD_contain .ui-slider .ui-slider-label-a').text('ENABLED');
                    else
                        $('#RS_CMD_contain .ui-slider .ui-slider-label-a').text('PENDING');
                    $("#RS_CMD").val('on').slider('refresh');
                }
                else{
                    if (RPG["RPG_CMD"])
                        $('#RS_CMD_contain .ui-slider .ui-slider-label-b').text('DISABLED');
                    else
                        $('#RS_CMD_contain .ui-slider .ui-slider-label-b').text('PENDING');
                    $("#RS_CMD").val('off').slider('refresh');
                }
                if (RS["RS_AVSET_STATUS"] == "ENABLED"){
                    if (RPG["RPG_AVSET"])
                        $('#AVSET_Exception_contain .ui-slider .ui-slider-label-a').text('ENABLED');
                    else
                        $('#AVSET_Exception_contain .ui-slider .ui-slider-label-a').text('PENDING');
                    $('#AVSET_Exception').val('on').slider('refresh');
                }
                else{
                    if (RPG["RPG_AVSET"])
                        $('#AVSET_Exception_contain .ui-slider .ui-slider-label-b').text('PENDING');
                    else
                        $('#AVSET_Exception_contain .ui-slider .ui-slider-label-b').text('DISABLED');
                    $('#AVSET_Exception').val('off').slider('refresh');
                }


		$("#RS_VCP_NUMBER").html(RS['RS_VCP_NUMBER'])
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
                window.open("/vcp","_blank","width= 1024, height = 840, scrollbars=yes");
        });
	$('#RDA_Messages').val("on").slider("refresh")
	$('#close').click(function(){
		window.close();
	});	
    });
	
