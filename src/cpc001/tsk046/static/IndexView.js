
    tday=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
    tmonth=new Array("January","February","March","April","May","June","July","August","September","October","November","December");
    smonth=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec");
    function GetClock(){
        var d=new Date();
        var nday=d.getUTCDay(),nmonth=d.getUTCMonth(),ndate=d.getUTCDate(),nyear=d.getUTCFullYear();
        if(nyear<1000) nyear+=1900;
        var d=new Date();
        var nhour=d.getUTCHours(),nmin=d.getUTCMinutes(),nsec=d.getUTCSeconds();
        if(nmin<=9) nmin="0"+nmin
        if(nsec<=9) nsec="0"+nsec;
        $('#clockbox-date').html(""+tday[nday]+" "+tmonth[nmonth]+" "+ndate+", "+nyear);
        $('#clockbox-time').html(""+nhour+":"+nmin+":"+nsec+" "+"UT");
        $('#VCP_start_date').html("VCP START: "+smonth[nmonth]+" "+ndate+", "+nyear+'&nbsp');
    }
    function timeStamp(){
        var d=new Date();
        var nday=d.getUTCDay(),nmonth=d.getUTCMonth(),ndate=d.getUTCDate(),nyear=d.getUTCFullYear();
        if(nyear<1000) nyear+=1900;
        var d=new Date();
        var nhour=d.getUTCHours(),nmin=d.getUTCMinutes(),nsec=d.getUTCSeconds();
        if(nmin<=9) nmin="0"+nmin
        if(nsec<=9) nsec="0"+nsec;
       return smonth[nmonth]+" "+ndate+","+nyear%100+" "+"["+nhour+":"+nmin+":"+nsec+"]";
    }

    function toRadians(deg) {
        return deg * Math.PI / 180
    }	
    function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'static/hci_cfg.json', true); // Replace 'my_data' with the path to your file
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
function getCookie(cname,truthSwitch) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
	while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
        	if (truthSwitch){
                        if (c.substring(name.length,c.length) == "on") return true 
                        else return false
                }
                else{
                        return c.substring(name.length,c.length)
                }
	 }
    }
    return "NULL";
}


function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
    	var cookie = cookies[i];
    	var eqPos = cookie.indexOf("=");
    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    	document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
function closest(array,num){
    var i=0;
    var minDiff=1000;
    var ans;
    for(i in array){
         var m=Math.abs(num-array[i]);
         if(m<minDiff){ 
                minDiff=m; 
                ans=array[i]; 
            }
      }
    return ans;
}
function anim(action){
	var i;
        var j;
        for (i = 1; i<9; i++){
		var group = document.getElementsByName("squaresWaveG_long_"+i)
		for(j = 0; j<group.length; j++){
                	group[j].style.animationPlayState = action
                }
        }
}    
init();
window.onload=function(){
    GetClock();
    setInterval(GetClock,DATA.clockInterval);
}

    var actionflag = {}
    var cookieRaid = {}
    var rpgStatusMsgs = {'new':0} 
    var stopCheck = {'action':0}

$(document).ready(function(){
		function toggleHandler(attr,switchval){	
		switch(switchval){
		case 1:	
		if(attr.controlname == 'AVSET_Exception'){attr.controlname = 'RS_AVSET'}
		switch(attr.controlname){
		case 'RPG_SAILS': case 'SAILS_Exception':
		if (attr.newVal.confirmation == "on"){
		$.post('/sails',{NUM_CUTS:attr.num_cuts});
		delete actionflag.SAILS
		}
		else{
		$.post('/sails',{NUM_CUTS:0});
		delete actionflag.SAILS
		}
		break;
		case 'RS_AVSET': case 'AVSET_Exception': case 'RS_CMD': case 'RS_SUPER_RES':
		if (attr.controlname == 'RS_AVSET' || attr.controlname =='AVSET_Exception'){flag = 0}else{flag=1}
		if (attr.newVal.confirmation == "on"){
		$.post('/send_cmd',{COM:attr.controlname+'_ENABLE',FLAG:flag});
		}
		else{
			$.post('/send_cmd',{COM:attr.controlname+'_DISABLE',FLAG:flag});
		}
		break;
		case 'Model_Update': case 'VAD_Update':
		if(attr.newVal.confirmation == "on"){
			$.post('/set_flag',{TYPE:'hci_set_'+attr.controlname.toLowerCase()+'_flag',FLAG:1});
		}
		else{
			$.post('/set_flag',{TYPE:'hci_set_'+attr.controlname.toLowerCase()+'_flag',FLAG:0});
		}
		break;
		}   
		if (attr.displayname=="AVSET" || attr.displayname=="AVSET-Exception"){
			if (attr.newVal.confirmation=="on"){
				$('#RS_AVSET').val('on').slider('refresh')
					$('#AVSET_Exception').val('on').slider('refresh')
					$('#AVSET_Exception_contain').addClass('hide')
			}
			else{
				$('#AVSET_Exception_contain .ui-slider .ui-slider-label-b').text('PENDING')
					$('#RS_AVSET_contain .ui-slider .ui-slider-label-b').text('PENDING')
					$('#RS_AVSET').val('off').slider('refresh')
					$('#AVSET_Exception').val('off').slider('refresh')
					$('#AVSET_Exception_contain').removeClass('hide')
			}
		}
		if(attr.displayname == 'CMD' || attr.displayname == 'Super-Res'){
			$("#"+attr.controlname).val(attr.newVal.confirmation).slider('refresh')
		}
		if(attr.displayname.split('-')[0] == "AVSET"){
			document.cookie = "AVSET"+"="+attr.current+"; expires="+attr.date0.toUTCString();
		}
		else{
			document.cookie = attr.controlname+"="+attr.current+"; expires="+attr.date0.toUTCString();
		}
		break;
		case 2:
		$('#'+attr.controlname).val(attr.newVal.cancel).slider('refresh');
		break;
		case 3:
		if(attr.title == 'flag'){
			$.post('/set_flag',{TYPE:'hci_set_'+attr.controlname.toLowerCase()+'_flag',FLAG:1});
		}
		$("#"+attr.controlname).val(attr.newVal.confirmation).slider('refresh')
			$('#'+attr.controlname+'_status').addClass('hide')
			document.cookie = attr.controlname+"="+attr.current+"; expires="+attr.date0.toUTCString();
		break;
		case 4:
		if(attr.title == 'flag'){
			$.post('/set_flag',{TYPE:'hci_set_'+attr.controlname.toLowerCase()+'_flag',FLAG:0});
		}
		$("#"+attr.controlname).val(attr.newVal.cancel).slider('refresh')
			break;	
		}
		}
		var animcheck = document.getElementById("squaresWaveG_long_1")
			animcheck.style.animationPlayState = "running"

			$(".control-item").css('background-color','#1F497D','color','#FFFFFF');
		$(".nav-item").css('background-color','#002060');
		var canvas=document.getElementById("radome");
		var maincircle=canvas.getContext("2d");
		maincircle.fillStyle="white";maincircle.arc(150,150,135,0,2*Math.PI);maincircle.fill();
		maincircle.beginPath();maincircle.arc(150,150,135,0,2*Math.PI);maincircle.lineWidth=3;maincircle.strokeStyle="black";maincircle.stroke();
		maincircle.lineTo(150,150);
		maincircle.closePath();
		maincircle.fill();
		maincircle.fillStyle="white";maincircle.beginPath();maincircle.arc(150,150,120,0,2*Math.PI);maincircle.fill();
		maincircle.fillStyle="#FFFFFF";
		maincircle.strokeRect(60,290,180,54)
		maincircle.strokeRect(60,344,180,54)
		maincircle.beginPath();
		maincircle.moveTo(60,290)
		maincircle.lineTo(240,344)
		maincircle.moveTo(60,344)
		maincircle.lineTo(240,290)
		maincircle.moveTo(60,344)
		maincircle.lineTo(240,398)
		maincircle.moveTo(60,398)
		maincircle.lineTo(240,344)
		maincircle.fillStyle = '#5B575B';
		maincircle.fillRect(115, 329, 70, 30);
		maincircle.strokeRect(115, 329, 70, 30);
		maincircle.fillStyle = 'black';
		maincircle.font = "bold 18px Helvetica";
		maincircle.fillText("SAILS:",50,160)
		maincircle.fillText("AVSET:",50,210)
		maincircle.shadowColor = "black"; 
		maincircle.shadowOffsetX = 2;
		maincircle.shadowOffsetY = 2; 
		maincircle.shadowBlur = 5;
		maincircle.fillStyle = 'white';
		maincircle.stroke();
		maincircle.beginPath();
		maincircle.lineWidth = 5;
		maincircle.moveTo(150,358)
		maincircle.lineTo(150,400)
		maincircle.moveTo(150,285)
		maincircle.lineTo(150,330)
		maincircle.shadowColor = "transparent"
		maincircle.lineWidth = 4;
		maincircle.moveTo(240,393)
		maincircle.lineTo(300,393)
		maincircle.stroke();
		document.getElementById("radome").style.zIndex = 1;
		$.getJSON("/update",function(data){
				cookieRaid['initial'] = data['RPG_dict']['ORPGVST']
				});

		$(".toggle").on('slidestop',function(){
				$('#popupDialog').popup('open')
				var controlname = $(this).attr("id")
				var title = $(this).attr("title")
				var displayname = $(this).attr("alt")
				var current = $(this).val();
				var date0 = new Date();
				date0.setTime(date0.getTime()+DATA.rdaCommandStickyToggleTimeout)		
				if(displayname.split('-')[0] == "SAILS"){
				$.getJSON("/update",function(data){
					actionflag['SAILS'] = data['RPG_dict']['ORPGVST']
					});
				}
				else if(displayname.split('-')[0] == "AVSET"){
				$.getJSON("/update",function(data){
					actionflag['AVSET'] = data['RPG_dict']['ORPGVST']
					});
				}
				else{
				$.getJSON("/update",function(data){
					actionflag[controlname] = data['RPG_dict']['ORPGVST']
					});

				}
		if (current=="on"){newVal = {cancel:"off",confirmation:"on"}}else{newVal = {cancel:"on",confirmation:"off"}}
		attr = {title:title,controlname:controlname,displayname:displayname,date0:date0,newVal:newVal,current:current}
		if (controlname == "PRF_Mode"){
			$("#prf_control").click();
		}
		else {
			$("#sails-insert").html('')
				if (['SAILS','AVSET','CMD','Super-Res','SAILS-Exception','AVSET-Exception'].indexOf(displayname) >=0){
					var child1 = $(this).find("option:first-child").html()
						if (current=="on"){
							$("#id-confirm").html('You are about to enable '+displayname+'. Change will not take effect until the next start of volume scan. Do you want to continue?')
								if(displayname == 'SAILS' || displayname == 'SAILS-Exception'){
									$("#sails-insert").html($('#sails-form').html())
										$('#popupDialog').trigger('create')
										attr['num_cuts'] = $('#select-choice-0').val()		    
								}
						}
						else{
							$("#id-confirm").html('Are you sure you want to change '+displayname+' to '+child1+' ?')
						}

					$("#pop-cancel").bind('click',{attr},function(event){
							toggleHandler(event.data.attr,2);
							$('#pop-cancel').unbind()
							$('#pop-confirm').unbind()
							});


					$('#pop-confirm').bind('click',{attr},function(event){
							toggleHandler(event.data.attr,1);
							$('#pop-confirm').unbind()
							$('#pop-cancel').unbind()
							});
				}
				else{
					var child1 = $(this).find("option:first-child").html()
						var child2 = $(this).find("option:last-child").html()
						if (current=="on"){
							$("#id-confirm").html('Are you sure you want to change '+displayname +' to '+child2+' ?')
						}
						else{
							$("#id-confirm").html('Are you sure you want to change '+displayname+' to '+child2+' ?')
						}
					$("#pop-cancel").bind('click',{attr},function(event){
							toggleHandler(event.data.attr,4);
							$('#pop-confirm').unbind()
							$('#pop-cancel').unbind()
							});			
					$("#pop-confirm").bind('click',{attr},function(event){
							toggleHandler(event.data.attr,3);
							$('#pop-confirm').unbind()
							$('#pop-cancel').unbind()
							});
				}
		}


		});
		var link = $('#squaresWaveG_long').html()
			var item = ['RS_SUPER_RES','RS_CMD','RS_AVSET'];

		$.getJSON("/update",function(data){
				maincircle.fillText(data['ADAPT']['ICAO'],125,350)
				});
		setInterval(function (){	
				$.getJSON("/update",function(data){
					$('#marq-insert').html($('#marq-form').html())
					maincircle.clearRect(0,0,canvas.width,285)
					maincircle.fillStyle="white";maincircle.beginPath();maincircle.arc(150,150,135,0,2*Math.PI);maincircle.fill();maincircle.closePath();
					maincircle.beginPath();maincircle.arc(150,150,135,0,2*Math.PI);maincircle.lineWidth=3;maincircle.strokeStyle="black";maincircle.stroke();maincircle.closePath();
					maincircle.font = "bold 80px Helvetica";
					maincircle.fillStyle = 'black';
					maincircle.fillStyle="black";maincircle.beginPath();maincircle.moveTo(150,150);maincircle.arc(150,150,135,-Math.PI / 2 + toRadians(data['RS_dict']['radome_update']['start_az']/10),-Math.PI / 2 + toRadians(data['RS_dict']['radome_update']['az']/10));
					maincircle.lineTo(150,150);
					maincircle.closePath();
					maincircle.fill();
					maincircle.fillStyle="white";maincircle.beginPath();maincircle.arc(150,150,120,0,2*Math.PI);maincircle.fill();maincircle.closePath();
					maincircle.fillStyle="black";
					if(data['RS_dict']['radome_update']['last_elev']){
					maincircle.font = "bold 30px Helvetica";maincircle.fillText('LAST',115,132)
					}
					if(data['RS_dict']['radome_update']['sails_seq']>0){ 
					maincircle.font = "bold 30px Helvetica";maincircle.fillText(DATA.sails_seq[data['RS_dict']['radome_update']['sails_seq']],85,132)
					}

					try {
						var elevation = data['RS_dict']['radome_update']['el'] / 10
							if(data['RS_dict']['radome_update']['super_res'] > 0){
								maincircle.font = "bold 50px Helvetica";maincircle.fillText('SR',120,260)
							}
					}
					catch(err){
						var elevation = 0.0
					}
					maincircle.font = "bold 80px Helvetica";	
					if (elevation < 10){var elevx = 95;var elevy = 105;}
					else{var elevx = 70; var elevy = 105;} 
					if(elevation % 1 == 0){
						maincircle.fillText(elevation.toFixed(1),elevx,elevy);
					}
					else{
						maincircle.fillText(elevation,elevx,elevy);
					}
					maincircle.font = "bold 18px Helvetica";
					maincircle.fillText("SAILS:",50,160)
						maincircle.fillText("AVSET:",50,210)

						var flags = Object.keys(actionflag)
						for (flag in flags){
							if(actionflag[flags[flag]] != data['RPG_dict']['ORPGVST']){
								delete actionflag[flags[flag]]
							}
						}
					if(cookieRaid['initial'] != data['RPG_dict']['ORPGVST']){
						deleteAllCookies();
						cookieRaid['initial'] = data['RPG_dict']['ORPGVST']
					}
					if(data['RS_dict']['latest_alarm']['valid']){
						if(data['RS_dict']['latest_alarm']['precedence']){
							if (data['RS_dict']['latest_alarm']['alarm_status']){
								$('#Alarms').html(data['RS_dict']['latest_alarm']['timestamp']+' >> RDA ALARM ACTIVATED: '+data['RS_dict']['latest_alarm']['text']).attr('class','bar-border minor-alarm')
							}
							else{
								$('#Alarms').html(data['RS_dict']['latest_alarm']['timestamp']+' >> RDA ALARM CLEARED: '+data['RS_dict']['latest_alarm']['text']).attr('class','bar-border normal-ops')
							}
						}
						else{
							$('#Alarms').html(data['RPG_dict']['RPG_alarm_suppl']).attr('class','bar-border normal-ops')
						}
					}
					else{
						$('#Alarms').html(data['RPG_dict']['RPG_alarm_suppl'])
							if(data['RPG_dict']['RPG_alarm_suppl'] == ''){
								$('#Alarms').attr('class','bar-border null-ops')
							}
							else{	
								$('#Alarms').attr('class','bar-border normal-ops')		
							}
					}
					var cts = Math.round((new Date()).getTime() / 1000);	
			if(cts - data['RPG_dict']['RPG_status_ts'] == DATA.noSystemChangeTimeout){
			    rpgStatusMsgs['new'] = timeStamp() + ' >> No System Status Change in the last 5 minutes'
			}
			if(cts - data['RPG_dict']['RPG_status_ts'] > DATA.noSystemChangeTimeout){
			    $('#Status').html(rpgStatusMsgs['new'])
			}
			else{ 
			    $('#Status').html(data['RPG_dict']['RPG_status'])
			}
			$('#VCP_start_time').html(" "+data['RPG_dict']['ORPGVST'])
			exception_list = ['Model_Update','VAD_Update','mode_A_auto_switch','mode_B_auto_switch']
			for (e in exception_list){
				var exception = exception_list[e]
				if(Object.keys(actionflag).indexOf(exception) <0){
					var cookieCheck = getCookie(exception,1)
					if (exception == "Model_Update" || exception == "VAD_Update"){var d = 'PMD_dict'}else{var d = 'RPG_dict'}
					if(data[d][exception]){
                                        	$('#'+exception).val('on').slider('refresh');
                                        	$('#'+exception+'_status').addClass('hide')
                                	}
                                	else{
                                        	$('#'+exception).val('off').slider('refresh');
                                        	$('#'+exception+'_status').removeClass('hide')
                                	}


				}
			}
			if(data['PMD_dict']['mode_trans']){
			    $("#Mode_Conflict_contain").html('TRANS').removeClass('normal-ops').addClass('minor-alarm');
                            $("#Mode_Conflict_status").removeClass('hide')
			}
			else{
                            if(data['PMD_dict']['mode_conflict']){
				$("#Mode_Conflict_contain").html('YES').removeClass('normal-ops').addClass('minor-alarm');
				$("#Mode_Conflict_status").removeClass('hide')
			    }
                            else{
				$("#Mode_Conflict_contain").html('NO').removeClass('minor-alarm').addClass('normal-ops');
				$("#Mode_Conflict_status").addClass('hide')
			    }
			}
			var state = Object.keys(data['RS_dict']['RDA_static']);
			if (getCookie('FEEDBACK') != "NULL"){
			    $('#Feedback').html(getCookie('FEEDBACK'))
			}
			if (Object.keys(actionflag).indexOf('SAILS') < 0){
			    if(data['RPG_dict']['RPG_SAILS']){
			        $('#RPG_SAILS').val('on').slider('refresh');
                                $('#SAILS_Exception').val('on').slider('refresh');
                                $('#SAILS_Exception_contain').addClass('hide');
			        if(data['RPG_dict']['sails_allowed']){
		 	            $('#RPG_SAILS_contain .ui-slider .ui-slider-label-a').text('ACTIVE/'+data['RPG_dict']['sails_cuts'])	
			        }
			        else{
			  	    $('#RPG_SAILS_contain .ui-slider .ui-slider-label-a').text('INACTIVE')
			        }
			    }
			    else{
			        $('#RPG_SAILS').val('off').slider('refresh');
                                $('#SAILS_Exception').val('off').slider('refresh');
                                $('#SAILS_Exception_contain').removeClass('hide');
			    }
			}	
		
			if (Object.keys(actionflag).indexOf('AVSET') < 0){
				var cookieCheck = getCookie('AVSET',0)
				if(cookieCheck == "NULL"){cookieCheck = data['RS_dict']['RDA_static']['LOOKUP']['RS_AVSET'][data['RS_dict']['RS_AVSET']]}
				$('#AVSET_Exception').val(cookieCheck).slider('refresh')
				if(cookieCheck  =='on'){
					$('#AVSET_Exception_contain').addClass('hide')
				}
				else{
					$('#AVSET_Exception_contain').removeClass('hide')
				}
				

			}	
			for (i in item){
				var value = item[i]
				var val = data['RS_dict']['RDA_static']['LOOKUP'][value][data['RS_dict'][value]]
				if (val == 'on'){var retrieved = true}else{var retrieved = false}
				if (value == "RS_AVSET"){
					if (Object.keys(actionflag).indexOf('AVSET') < 0){
						var cookieCheck = getCookie('AVSET',0)
						if(cookieCheck != "NULL"){
							val = cookieCheck
							if(val == "off"){
                                                        	$('#RS_AVSET_contain .ui-slider .ui-slider-label-a').text('ENABLED')
                                                	}
						}
						else{
							$('#RS_AVSET_contain .ui-slider .ui-slider-label-a').text('ENABLED')
						}
						$("#RS_AVSET").val(val).slider('refresh')
					}
						
						
				}		
				else{	
					var cookieCheck = getCookie(value,1)
					if(cookieCheck != "NULL" && Object.keys(actionflag).indexOf(value) < 0){
						if(cookieCheck){
							$("#"+value+"_status").addClass('hide');
                                                	$("#"+value+"_contain .ui-slider-label-a").text('ENABLED')
						}
						else{
							$("#"+value+"_status").removeClass('hide');
                                                	$("#"+value).val('off').slider("refresh")
                                                	$('#'+value+'_contain .ui-slider .ui-slider-label-b').text('PENDING')
						}
					}
					else{
						if(retrieved){
							$("#"+value+"_status").addClass('hide');
							$("#"+value).val('on').slider("refresh")
						}
						else{
							$("#"+value+"_status").removeClass('hide');
							$("#"+value).val('off').slider("refresh")	
						}
					}
				}
			}
			
			for (b in state){
				var value2 = state[b];
				$("#"+value2).html(data['RS_dict']['RDA_static'][value2])
				switch (data['RS_dict']['RDA_static'][value2]){
					case 'OPERATE': case 'ONLINE': case 'OK': case 'STARTUP':
						$("#"+value2).attr('class','normal-ops bar-border2');
						$('#'+value2+'_label').attr('class','bar-border1 show');	
						$('#grid1').attr('class','normal-ops-grid');
						$('#grid1title').attr('class','normal-ops-grid');
						break;
					case 'NOT_INSTALLED':
						$('#'+value2).attr('class','bar-border2 hide');$('#'+value2+'_label').attr('class','bar-border1 hide');
						break;
					case 'MAINTENANCE_MAN':
						$("#grid1").attr('class','major-alarm-grid');
						$('#grid1title').attr('class','major-alarm-grid');
						$("#"+value2).attr('class','bar-border2 major-alarm');
						break;
					case 'MAINTENANCE_REQ':
						$("#grid1").attr('class','minor-alarm-grid');
						$('#grid1title').attr('class','minor-alarm-grid');
						$("#"+value2).attr('class','bar-border2 minor-alarm');
						$('#Alarms').attr('class','minor-alarm');
						break;
					case 'UNKNOWN':
						$("#"+value2).attr('class','bar-border2 inop-indicator');
						break;
					case 'INOPERABLE,-9999':
						$("#"+value2).html('INOPERABLE')
						$('#'+value2).attr('class','bar-border2 inop-indicator');
						$('#grid1').attr('class','inop-grid');
						$('#grid1title').attr('class','inop-grid');
						break;
					case 'N/A':
						$('#'+value2).html('N/A');
						break;
				}
			}
			var all_alarms = data['RS_dict']['RDA_alarms_all']
			for (a in all_alarms){
                                $('#'+all_alarms[a]).addClass('hide')
                        };
			var current_alarms = data['RS_dict']['RDA_static']['RS_RDA_ALARM_SUMMARY_LIST'].split('<br>') 
			for (alarm in current_alarms){
				$('#'+current_alarms[alarm]).removeClass('hide')
				var i = all_alarms.indexOf(alarm);
				if (i != -1) { 
					all_alarms.splice(i,1);
				}
			}
			switch(data['ADAPT']['ZR_mult']){
				case DATA.zrCats.CONVECTIVE:
					$('#Z-R').html('CONVECTIVE')
					break;
				case DATA.zrCats.TROPICAL:
					$('#Z-R').html('TROPICAL')
					break;
				case DATA.zrCats.MARSHALL-PALMER:
					$('#Z-R').html('MARSHALL-PALMER')
                                        break;
                                case DATA.zrCats.EAST-COOL-STRATIFORM:
                                        $('#Z-R').html('EAST-COOL STRATIFORM')
                                        break;
                                case DATA.zrCats.WEST-COOL-STRATIFORM:
                                        $('#Z-R').html('WEST-COOL STRATIFORM')
                                        break;
			}
			switch(data['RS_dict']['RDA_static']['CONTROL_STATUS']){
				case 'RPG_REMOTE':	
					$('#CONTROL_STATUS').html('RPG')
					break;
				case 'LOCAL_ONLY':
					$('#CONTROL_STATUS').html('RDA')
					break;
                                case 'EITHER':
                                        $('#CONTROL_STATUS').html('EITHER')
					break;
			}
			switch(data['PMD_dict']['prf']){
				case 'CELL_BASED': case 'STORM_BASED':
					$('#PRF_Mode_contain .ui-slider .ui-slider-label-a').text('MULTI')
					$('#PRF_Mode').val('on').slider('refresh')
					$('#PRF_Mode_block').attr('class','hide')
					break;
				case 'AUTO_PRF':
                                        $('#PRF_Mode_contain .ui-slider .ui-slider-label-a').text('AUTO')
                                        $('#PRF_Mode').val('on').slider('refresh')
					$('#PRF_Mode_block').attr('class','hide')
					break;
				case 'MANUAL_PRF':
					$('#PRF_Mode').val('off').slider('refresh')
					$('#PRF_Mode_block').attr('class','show')
					break;
			}
			if(data['RS_dict']['RDA_static']['RS_RDA_ALARM_SUMMARY_LIST'] == 'NO_ALARM'){$('#grid1').addClass('normal-ops-forest')}
			var gen_list = data['RS_dict']['RDA_static']['AUX_GEN_LIST'].split('<br>')
			if (gen_list[gen_list.length-1]=='false'){$('#gen_state').addClass('hide')}
			$("#gen_level").attr('value',data['PMD_dict']['cnvrtd_gnrtr_fuel_lvl'])	
			$("#gen_level_num").html(data['PMD_dict']['cnvrtd_gnrtr_fuel_lvl']+'%')
			$("#RS_VCP_NUMBER").html(data['RS_dict']['RS_VCP_NUMBER'])
			$("#perf_check_time").html(data['PMD_dict']['perf_check_time'][0]).css('background-color',data['PMD_dict']['perf_check_time'][1])
			$('#RPG_state').html(data['RPG_dict']['RPG_state'])
			$('#RPG_oper').html(data['RPG_dict']['RPG_op'].split(',')[0])	
			$('#Z-ZDR').html(data['ADAPT']['ptype'])
			switch (data['RPG_dict']['RPG_op'].split(',')[0]){
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
					if(data['RPG_dict']['RPG_alarms'] == 'NONE'){$('#grid2').attr('class','normal-ops-grid')}
					$('#RPG_oper').attr('class','normal-ops bar-border2')
					break;
				default:
					$('#RPG_oper').attr('class','inop-indicator bar-border2')
					$('#grid2').attr('class','normal-ops-grid')
			}
			switch(data['RPG_dict']['RPG_state']){
			
				case 'OPER': 
					$('#RPG_state').attr('class','bar-border2 normal-ops');
					break;
				case 'RESTART': case 'STANDBY': 
					$('#RPG_state').attr('class','bar-border2 inop-indicator');
					break;
				case 'TEST':
					$('#RPG_state').attr('class','bar-border2 minor-alarm');
					break;
				case 'SHUTDOWN':
					$('#RPG_state').addClass('inop-indicator')
					$('#RDA_STATE').html('UNKNOWN').attr('class','bar-border2 inop-indicator')
                                        $('#OPERABILITY_LIST').html('UNKNOWN').attr('class','bar-border2 inop-indicator')      	
					$('#AVSET_Exception_contain').removeClass('hide')
					var unk_list = ['AVSET_Exception','RS_AVSET','RS_CMD','RS_SUPER_RES']
					for (unk in unk_list){
					    $('#'+unk_list[unk]).val('off').slider('refresh')
					    $('#'+unk_list[unk]+'_contain .ui-slider .ui-slider-label-b').text('????')
					    $('#'+unk_list[unk]+'_status').removeClass('hide')

					}
					break;		
			};
			switch(data['RPG_dict']['narrowband']){
			    case 'NB_HAS_NO_CONNECTIONS': case 'NB_HAS_FAILED_CONNECTIONS':
				$('.nblink-status').html('').removeClass('normal-ops').addClass('null-ops')
			        break;
			    case 'NB_HAS_CONNECTIONS':
				$('nblink-status').html(link).removeClass('null-ops').addClass('normal-ops')
				break;
			}
			    
			if (data['RS_dict']['RDA_static']['WIDEBAND'] == "CONNECTED"){
				if ($('#squaresWaveG_long').html() != link && data['RS_dict']['active_moments'] == []){
					var links = data['RS_dict']['moments']
					for (l in links){
						var letter = links[l]
						$('.link-status'+letter).removeClass('major-alarm');
						$('.link-status'+letter).removeClass('minor-alarm');
						$('.link-status'+letter).html(link).addClass('normal-ops');
						$('#link_'+letter).html(letter).attr('class','link-status-sq normal-ops');
					}
				 }
				 else{
					var letter = data['RS_dict']['moments']
                                        for (l in DATA.moments){
						var mom = DATA.moments[l]
						if(letter.indexOf(mom) < 0){
                                                	$('.link-status'+mom).html('').removeClass('normal-ops').addClass('null-ops');
                                                	$('#link_'+mom).html(mom).removeClass('normal-ops').addClass('null-ops');
						}
					}
					for (j in DATA.moments){
						var mom = DATA.moments[j]
						if($('.link-status'+mom).html() == '' && letter.indexOf(mom) >= 0 ){
							$('.link-status'+mom).html(link).removeClass('null-ops').addClass('normal-ops');
							$('#link_'+mom).html(mom).removeClass('null-ops').addClass('normal-ops');
							var yank = $('#link').html()
							$('#link').html(yank)
						}
					}
								
                                    }
			}
			else{
				switch (data['RS_dict']['RDA_static']['WIDEBAND']){
					case 'WBFAILURE': case 'DOWN': case 'NOT_IMPLEMENTED':
						var word = data['RS_dict']['RDA_static']['WIDEBAND'].split('_')
						var word_l = word.length-1
						for (w = 0;w < 4; w++){
							if(w > word_l){$('.status'+w).html('').addClass('major-alarm')}
							else{$('.status'+w).html(word[w]).addClass('major-alarm')}
						}
						$('.link-status-sq').html('X').addClass('major-alarm')
					case 'CONNECT_PENDING': case 'DISCONNECTED_CM': case 'DISCONNECTED_HC': case 'DISCONNECTED_RMS': case 'DISCONNECT_PENDING': case 'DISCONNECTED_SHUTDOWN':
						var word = data['RS_dict']['RDA_static']['WIDEBAND'].split('_')
						var word_l = word.length-1
						for (w = 0;w < 4; w++){
							if(w > word_l){$('.status'+w).html('').addClass('minor-alarm')}
							else{$('.status'+w).html(word[w]).addClass('minor-alarm')}
						}
						$('.link-status-sq').html('X').addClass('minor-alarm')
				}
			}
	
			if(stopCheck['action'] != data['RS_dict']['radome_update']['az']){
                            anim("running")
                        }
			else{
                            anim("paused")
			}
			stopCheck['action'] = data['RS_dict']['radome_update']['az']
			if(data['PMD_dict']['h_delta_dbz0'] >= 1.5){$('#h_delta_dbz0').addClass('minor-alarm')}
			else{$('#h_delta_dbz0').addClass('normal-ops')}
			if(data['PMD_dict']['v_delta_dbz0'] >= 1.5){$('#v_delta_dbz0').addClass('minor-alarm')}
			else{$('#v_delta_dbz0').addClass('normal-ops')}
			$('#h_delta_dbz0').html(data['PMD_dict']['h_delta_dbz0']+'dB')			
			$('#v_delta_dbz0').html(data['PMD_dict']['v_delta_dbz0']+'dB')
			var loadshed_cats = Object.keys(data['RPG_dict']['loadshed'])
			$('#Load_Shed_contain').html('NORMAL')
			$('#Load_Shed_status').addClass('hide')
			for (lshd in loadshed_cats){
			    if(data['RPG_dict']['loadshed'][loadshed_cats[lshd]] != 'NONE'){	
				$('#Load_Shed_contain').html(data['RPG_dict']['loadshed'][lshd])	
				$('#Load_Shed_status').removeClass('hide')
				if(data['RPG_dict']['loadshed'][lshd] == 'ALARM'){
                                    $('#Load_Shed_contain').attr('style','font-size:14px;background-color:blue')                       
                                }
			    }
			}

		   

		    		
		});
	
		
	},1000);


	$('#refreshPage').click(function(){
		location.reload()
	});
	$('#Mode_Conflict_contain').click(function(){
		$.get("/button?id=hci_mode_status")
	});
	$('#link').click(function(){
		$.get("/button?id=hci_rda_link")
	});
	$('#rda_control').click(function(){
		$.get("/button?id=hci_rdc_orda")
	});
	$('#perf_check_time').click(function(){
		$.get("/button?id=hci_rdc_orda")
	});
	$('#rda_alarms').click(function(){
		$.get("/button?id=hci_rda_orda")
	});	
	$('#rpg_control').click(function(){
		$.get("/button?id=hci_rpc")
	});	
	$('#rpg_status').click(function(){
		$.get("/button?id=hci_status")
	});	
	$('#user_comms').click(function(){
		$.get("/button?id=hci_nb")
	});	
	$('#prf_control').click(function(){
		$.get("/button?id=hci_prf")
	});	
	$('#enviro_data').click(function(){
		$.get("/button?id=hci_wind")
	});
	$('#rpg_misc').click(function(){
		$.get("/button?id=hci_misc")
	});
	$('#88D-ops').click(function(){
                window.open("/operations","_blank","width = 1024, height = 380");
        }); 	
	$('#shift-change').click(function(){
                window.open("http://0.0.0.0:4235","_blank","width= 1024, height = 1024, scrollbars=yes");
        });

});

