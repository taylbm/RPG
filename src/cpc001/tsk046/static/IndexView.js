
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

window.onload=function(){
GetClock();
setInterval(GetClock,1000);
}




var moments = ['R','V','W','D'];
var current_wxstatus = new Array; current_wxstatus[1] = 'B'; current_wxstatus[2] = 'A';
var RS_SUPER_RES = new Array();RS_SUPER_RES[2] = 'on';RS_SUPER_RES[4] = 'off';
var RS_CMD = new Array();RS_CMD[0] = 'off';RS_CMD[1] = 'on';
var RS_AVSET = new Array(); RS_AVSET[2] = 'on';RS_AVSET[4] = 'off';
RS_TOGGLE = {'RS_SUPER_RES':RS_SUPER_RES,'RS_CMD':RS_CMD,'RS_AVSET':RS_AVSET};
var sails_seq = {1:'1st SAILS',2:'2nd SAILS',3:'3rd SAILS'}
var actionflag = {} 
var cookieRaid = {}
var stopCheck = {'action':0}
var rpgAlarms = {
	"CON":"Node Connectivity Failure",
	"RPGCTLFL":"RPG Control Failure",
	"DBFL":"Data Base Failure",
	"MEDIAFL":"Media Failure",
	"WBDLS":"Wideband Loadshedding",
	"PRDSTGLS":"Product Storage Loadshedding",
	"RDAWB":"RDA Wideband Alarm",
	"RPGRPGFL":"RPG/RPG Link Failure",
	"REDCHNER":"Redundant Channel Error",
	"FLACCFL":"File Access Failure",
	"RDAINLSRDA":"Radial Input Load Shed",
	"RPGINLSRPG":"Radial Input Load Shed",
	"RPGTSKFL":"RPG Task Failure",
	"DISTRI":"Product Distribution",
	"WBFAILRE":"Wideband Failure"
}
function toRadians(deg) {
return deg * Math.PI / 180
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
$(document).ready(function(){
	var animcheck = document.getElementById("squaresWaveG_long_1")
	animcheck.style.animationPlayState = "running"
	$.getJSON('static/rpg_alarms.json',function(data){
		console.log($.parseJSON(data))
	});
	
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
		var date0 = new Date();
		date0.setTime(date0.getTime()+900000)		
		var controlname = $(this).attr("id")
		var displayname = $(this).attr("alt")
		var current = $(this).val();
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
		var cancel;var confirmation;
		if (current=="on"){cancel = "off";confirmation = "on"}else{cancel="on";confirmation="off"}
		if (controlname == "PRF_Mode"){
                	$("#prf_control").click();
                }
		else {
			if (['SAILS','AVSET','CMD','Super-Res','SAILS-Exception','AVSET-Exception'].indexOf(displayname) >=0){
				var child1 = $(this).find("option:first-child").html()
				$('#popup-link').click();
				if (current=="on"){
                			$("#id-confirm").html('You are about to enable '+displayname+'. Change will not take effect until the next start of volume scan. Do you want to continue?')
                		}
                		else{
					$("#id-confirm").html('Are you sure you want to change '+displayname+' to '+child1+' ?')
				}
                		$("#pop-cancel").on('click',function(){	
					$('#'+displayname+'_Exception').val(cancel).slider('refresh');
                		});                     
                		$("#pop-confirm").on('click',function(){
					if (displayname=="SAILS" || displayname=="SAILS-Exception"){
						if (confirmation == "on"){
							$('#SAILS_Exception_contain .ui-slider .ui-slider-label-a').text('PENDING')
							$('#RPG_SAILS').val('on').slider('refresh')
							$('#SAILS_Exception').val('on').slider('refresh')
							$('#SAILS_Exception_contain').addClass('hide')
							$('#RPG_SAILS_contain .ui-slider .ui-slider-label-a').text('PENDING')	
						}	
						else{
                                                        $('#RPG_SAILS').val('off').slider('refresh')
                                                        $('#SAILS_Exception').val('off').slider('refresh')
                                                        $('#SAILS_Exception_contain').removeClass('hide')
						}
					}
					if (displayname=="AVSET" || displayname=="AVSET-Exception"){	
						if (confirmation=="on"){
                                        		$('#AVSET_Exception_contain .ui-slider .ui-slider-label-a').text('PENDING')
                                                	$('#RS_AVSET').val('on').slider('refresh')
                                                	$('#AVSET_Exception').val('on').slider('refresh')
                                                	$('#AVSET_Exception_contain').addClass('hide')
                                                	$('#RS_AVSET_contain .ui-slider .ui-slider-label-a').text('PENDING')        
                                        	}
						else{
							$('#RS_AVSET').val('off').slider('refresh')
                                                        $('#AVSET_Exception').val('off').slider('refresh')
                                                        $('#AVSET_Exception_contain').removeClass('hide')
                                                }
					}
					if(displayname.split('-')[0] == "SAILS"){
                        			document.cookie = "SAILS"+"="+current+"; expires="+date0.toUTCString();
		                	}
                			else if(displayname.split('-')[0] == "AVSET"){
                        			document.cookie = "AVSET"+"="+current+"; expires="+date0.toUTCString();
                			}
                			else{
                       	 			document.cookie = controlname+"="+current+"; expires="+date0.toUTCString();
                			}
				
					
                		});

			
			}
			else{
				$("#popup-link").click();
				var child1 = $(this).find("option:first-child").html()
				var child2 = $(this).find("option:last-child").html()
				if (current=="on"){
					$("#id-confirm").html('Are you sure you want to change '+displayname +' to '+child2+' ?')
				}
				else{
					$("#id-confirm").html('Are you sure you want to change '+displayname+' to '+child2+' ?')
				}
				$("#pop-cancel").on('click',function(){
					$("#"+controlname).val(cancel).slider('refresh')
				});			
				$("#pop-confirm").on('click',function(){
					$("#"+controlname).val(confirmation).slider('refresh')
					$('#'+controlname+'_status').addClass('hide')
					document.cookie = controlname+"="+current+"; expires="+date0.toUTCString();
				});
		    	}
		}


	});
	var link = $('#squaresWaveG_long').html()
	var item = Object.keys(RS_TOGGLE);
	$.getJSON("/update",function(data){
		maincircle.fillText(data['ADAPT']['ICAO'],125,350)
	});
	setInterval(function (){	
		$.getJSON("/update",function(data){
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
                                maincircle.font = "bold 30px Helvetica";maincircle.fillText(sails_seq[data['RS_dict']['radome_update']['sails_seq']],85,132)
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
				if (data['RS_dict']['latest_alarm']['alarm_status']){
					$('#marq3').html(data['RS_dict']['latest_alarm']['timestamp']+' >> RDA ALARM ACTIVATED: '+data['RS_dict']['latest_alarm']['text']).attr('class','bar-border minor-alarm')
				}
				else{
					$('#marq3').html(data['RS_dict']['latest_alarm']['timestamp']+' >> RDA ALARM CLEARED: '+data['RS_dict']['latest_alarm']['text']).attr('class','bar-border normal-ops')
				}
			}
			else{
				$('#marq3').html('').attr('style','background-color:white')
			}
			$('#VCP_start_time').html(" "+data['RPG_dict']['ORPGVST'])
			exception_list = ['Model_Update','VAD_Update','Precip_Switch','Clear_Air_Switch']
			for (e in exception_list){
				var exception = exception_list[e]
				if(Object.keys(actionflag).indexOf(exception) <0){
					var cookieCheck = getCookie(exception,1)
					if (exception == "Model_Update" || exception == "VAD_Update"){var d = 'PMD_dict'}else{var d = 'RPG_dict'}
					if(cookieCheck == "NULL"){cookieCheck = data[d][exception]}
					if(cookieCheck){
                                        	$('#'+exception).val('on').slider('refresh');
                                        	$('#'+exception+'_status').addClass('hide')
                                	}
                                	else{
                                        	$('#'+exception).val('off').slider('refresh');
                                        	$('#'+exception+'_status').removeClass('hide')
                                	}


				}
			}
                        if(data['PMD_dict']['mode_conflict']){
				$("#Mode_Conflict_contain").html('YES').removeClass('normal-ops').addClass('minor-alarm');
				$("#Mode_Conflict_status").removeClass('hide')
			}
                        else{
				$("#Mode_Conflict_contain").html('NO').removeClass('minor-alarm').addClass('normal-ops');
				$("#Mode_Conflict_status").addClass('hide')
			}
			var state = Object.keys(data['RS_dict']['RDA_static']);
			if (getCookie('DLOAD_VCP') != "NULL"){
			    $('#marq1').html(getCookie('DLOAD_VCP'))
			}
			if (getCookie('RESTART_VCP') != "NULL"){
			    $('#marq1').html(getCookie('RESTART_VCP'))
		   	}
			if (Object.keys(actionflag).indexOf('SAILS') < 0){
				var cookieCheck = getCookie('SAILS',1)
				if(cookieCheck == "NULL"){cookieCheck = data['RPG_dict']['RPG_SAILS']}
				if(data['RS_dict']['radome_update']['sails_seq']>0){
					if (cookieCheck){
						if(getCookie('SAILS',1) != "NULL"){
							$('#RPG_SAILS_contain .ui-slider .ui-slider-label-a').text('PENDING')
                                                }
                                                else{
							$('#RPG_SAILS_contain .ui-slider .ui-slider-label-a').text('ACTIVE/'+data['RPG_dict']['sails_cuts'])
						}	
						$('#RPG_SAILS').val('on').slider('refresh');
						$('#SAILS_Exception').val('on').slider('refresh');
						$('#SAILS_Exception_contain').addClass('hide');
					}
					else{
						$('#RPG_SAILS').val('off').slider('refresh');
						$('#SAILS_Exception').val('off').slider('refresh');
						$('#SAILS_Exception_contain').removeClass('hide');
					}
				}
				else{
					if(cookieCheck){
						if(getCookie('SAILS',1) != "NULL"){
							$('#RPG_SAILS_contain .ui-slider .ui-slider-label-a').text('PENDING')
						}
						else{
							$('#RPG_SAILS_contain .ui-slider .ui-slider-label-a').text('INACTIVE')
						}
						$('#RPG_SAILS').val('on').slider('refresh')
						$('#SAILS_Exception').val('on').slider('refresh');
                                       		$('#SAILS_Exception_contain').addClass('hide');
					}
					else{
						$('#RPG_SAILS').val('off').slider('refresh');
                                        	$('#SAILS_Exception').val('off').slider('refresh');
                                        	$('#SAILS_Exception_contain').addClass('hide');
					}
				}

			}	
		
			if (Object.keys(actionflag).indexOf('AVSET') < 0){
				var cookieCheck = getCookie('AVSET',0)
				if(cookieCheck == "NULL"){cookieCheck = RS_AVSET[data['RS_dict']['RS_AVSET']]}
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
				var val = RS_TOGGLE[value][data['RS_dict'][value]]
				if (val == 'on'){var retrieved = true}else{var retrieved = false}
				if (value == "RS_AVSET"){
					if (Object.keys(actionflag).indexOf('AVSET') < 0){
						var cookieCheck = getCookie('AVSET',0)
						if(cookieCheck != "NULL"){
							val = cookieCheck
							if(val == "on"){
                                                        	$('#RS_AVSET_contain .ui-slider .ui-slider-label-a').text('PENDING')
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
                                                	$("#"+value+"_contain .ui-slider-label-a").text('PENDING')
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
						$('#marq3').attr('class','major-alarm');
						break;
					case 'MAINTENANCE_REQ':
						$("#grid1").attr('class','minor-alarm-grid');
						$('#grid1title').attr('class','minor-alarm-grid');
						$("#"+value2).attr('class','bar-border2 minor-alarm');
						$('#marq3').attr('class','minor-alarm');
						break;
					case 'UNKNOWN':
						$("#"+value2).attr('class','bar-border2 inop-indicator');
						break;
					case 'INOPERABLE,-9999':
						$('#'+value2).attr('class','bar-border2 inop-indicator');
						$('#grid1').attr('class','inop-grid');
						$('#grid1title').attr('class','inop-grid');
						$('#marq3').attr('class','inop');
						break;
					case 'N/A':
						$('#'+value2).html('N/A');
						break;
				}
			}
			var all_alarms = data['RS_dict']['RDA_alarms_all']
			var current_alarms = data['RS_dict']['RDA_static']['RS_RDA_ALARM_SUMMARY_LIST'].split('<br>') 
			for (alarm in current_alarms){
				$('#'+current_alarms[alarm]).addClass('show')
				var i = all_alarms.indexOf(alarm);
				if (i != -1) { 
					all_alarms.splice(i,1);
				}
			}
			for (a in all_alarms){
				$('#'+all_alarms[a]).addClass('hide')
			};
			switch(data['ADAPT']['ZR_mult']){
				case 300.0:
					$('#Z-R').html('CONVECTIVE')
					break;
				case 250.0:
					$('#Z-R').html('TROPICAL')
					break;
				case 200.0:
					$('#Z-R').html('MARSHALL-PALMER')
                                        break;
                                case 130.0:
                                        $('#Z-R').html('EAST-COOL STRATIFORM')
                                        break;
                                case 75.0:
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
					break;
				case 'MAM':
					$('#RPG_oper').attr('class','major-alarm bar-border2')
					$('#grid2').attr('class','major-alarm-grid')
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
					break;		
			};
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
                                        for (l in moments){
						var mom = moments[l]
						if(letter.indexOf(mom) < 0){
                                                	$('.link-status'+mom).html('').removeClass('normal-ops').addClass('null-ops');
                                                	$('#link_'+mom).html(mom).removeClass('normal-ops').addClass('null-ops');
						}
					}
					for (j in moments){
						var mom = moments[j]
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
		});
	
		
	},500);


	$('#refreshPage').click(function(){
		location.reload()
	});
	$('#Mode_Conflict_contain').click(function(){
		window.open("/button?id=hci_mode_status","freeloader")
		window.open(" ","freeloader")
	});
	$('#link').click(function(){
		window.open("button?id=hci_rda_link","freeloader")
		window.open(" ","freeloader")
	});
	$('#rda_control').click(function(){
		window.open("/button?id=hci_rdc_orda","freeloader")
		window.open(" ","freeloader")
	});
	$('#perf_check_time').click(function(){
		window.open("/button?id=hci_rdc_orda","freeloader")
		window.open(" ","freeloader")
	});
	$('#rda_alarms').click(function(){
		window.open("/button?id=hci_rda_orda","freeloader")
		window.open(" ","freeloader")
	});	
	$('#rpg_control').click(function(){
		window.open("/button?id=hci_rpc","freeloader")
		window.open(" ","freeloader")
	});	
	$('#rpg_status').click(function(){
		window.open("/button?id=hci_status","freeloader")
		window.open(" ","freeloader")
	});	
	$('#user_comms').click(function(){
		window.open("/button?id=hci_nb","freeloader")
		window.open(" ","freeloader")
	});	
	$('#prf_control').click(function(){
		window.open("/button?id=hci_prf","freeloader")
		window.open(" ","freeloader")
	});	
	$('#enviro_data').click(function(){
		window.open("/button?id=hci_wind","freeloader")
		window.open(" ","freeloader")
	});
	$('#rpg_misc').click(function(){
		window.open("/button?id=hci_misc","freeloader")
		window.open(" ","freeloader")
	});
	$('#88D-ops').click(function(){
                window.open("/operations","_blank","width = 1024, height = 380");
        }); 	
	$('#vcp-button').click(function(){
		window.open("http://0.0.0.0:3142","_blank","width= 1024, height = 1024, scrollbars=yes");
	});
	$('#shift-change').click(function(){
                window.open("http://0.0.0.0:4235","_blank","width= 1024, height = 1024, scrollbars=yes");
        });

});

