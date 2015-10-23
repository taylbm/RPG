
var check_url = "checkmark"
var x_url = "delete"
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
smonth=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec");
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

var RefractiveIndex = 1.21, EarthRadius = 6371.0;
function beamHeight(elevation, slantRange)
{
	return (slantRange * Math.sin(elevation * 3.14159 / 180.0) + (slantRange * slantRange) / (2 * RefractiveIndex * EarthRadius)) * 3280.84;
}

var TestRanges = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
var VcpData = {};
var vcps = []
var i;
var full_dataset = [];

$(document).ready(function(){
	$(".vcp-confirm").on("click", function(){
	    delete vcp 
	    vcp = $(this).attr("id")
	    $("#vcp-num").html(vcp)
	    $(".final-vcp-confirm").html(vcp)
	});
	$(".vcp-desc").on("click", function() {
	    $(".vcp-desc-title").html("VCP "+$(this).attr("id")+" Description") 
	});

	$(".vcp-button").on("click", function() {
	    vcp = $(this).attr("id")		
	    $("#TableContain").html($("#vcpTable-"+vcp).html())
	});
	$('#current-vcp').on("click", function() {
	    $.getJSON("/current_vcp", function(attr){
	        $('#vcp-def-link').click();
	        $("#TableContain").html($("#vcpTable-"+attr).html())
		$('.v'+attr).addClass('ui-btn-active');
    	    });
	});
	
	$('#restart-vcp-confirm').on("click",function() {
	    $.post('/send_cmd',{COM:'RESTART_VCP',INPUT:'NULL'});
	    var date0 = new Date();
            date0.setTime(date0.getTime()+900000)
            document.cookie = "RESTART_VCP="+timeStamp()+" >> Requesting the VCP to be restarted; expires="+date0.toUTCString();
	});
	$('.vcp-dload-confirm').on("click",function(){
            $.post('/send_cmd',{COM:'DLOAD_VCP',INPUT:$(".final-vcp-confirm").html()});
	    var date0 = new Date();
            date0.setTime(date0.getTime()+900000)
            document.cookie = "DLOAD_VCP="+timeStamp()+" >> Requesting the download of RPG VCP "+$(".final-vcp-confirm").html()+"; expires="+date0.toUTCString();
        });


    $(document).bind('IssuesReceived',IssuesReceived)
    $.getJSON("/list_vcps", function(attr){
        $.each(attr, function(i,field){
    	    vcps.push(field)
	    this_vcp = field.toString()
	    VcpData[this_vcp] = []
	});
	$(document).trigger('IssuesReceived');
    });
});
		function IssuesReceived(evt){

		    for (i in vcps){
			(function(i){len = vcps.length-1;
			    $.getJSON("/parse_vcps?VCP="+vcps[i], function(elev){
			    	full_dataset[i] = elev;	
			        if (vcps[i] == 212 || vcps[i] == 32){
				    if (vcps[i] == 212){other_vcp = 12}else{other_vcp = 31}
				    var pageTemplate = $("#pageTemplateMulti").html();
				    $("#top_level").append(pageTemplate.format(vcps[i],other_vcp)).trigger("create")
				}
				else{	
				    if (vcps[i] != 12 && vcps[i] != 31){var pageTemplate = $("#pageTemplateSingle").html();$("#top_level").append(pageTemplate.format(vcps[i])).trigger("create");
					}
				}

				


		var elevs = [];
                $.each(elev.Elev_attr, function(i, field){
		    elevs.push(field.elev_ang_deg);
                });
	        elevs.sort(function(a, b){return a-b});
	        elevs = elevs.filter(Number);

	        
                    $.each(elevs, function (zIdx, zVal) {
                        var lower = {
                            id:     'elev-' + zIdx + '-lower',
                            data:   [],
                            lines:  {
                                lineWidth:  0
                            }
                        };

                        
                        var upper = {
                            id:     'elev-' + zIdx,
                            data:   [],
                            lines:  {
                                lineWidth:  0,
                                fill:       0.5
                            },
                            fillBetween:    'elev-' + zIdx + '-lower'
                        };
                        
                        $.each(TestRanges, function (xIdx, xSlantRange) {
                            lower.data.push([xSlantRange, beamHeight(zVal - 0.5, xSlantRange)]);
                        }); 
                        
                        $.each(TestRanges, function (xIdx, xSlantRange) {
                            upper.data.push([xSlantRange, beamHeight(zVal + 0.5, xSlantRange)]);
                        }); 
			vcp = vcps[i]
			VcpData[vcp].push(lower);
			VcpData[vcp].push(upper);
                   
		     });
	            $(window).resize(function () {
                        var w = $(window).width() * 0.8;
                        $('.vcp-details').width(w).css('width', w + 'px');
			}).trigger("resize");
                        $.plot(
                            $('#vcp'+vcps[i].toString()+'-draw-details'), 
                            VcpData[vcps[i]],
                            {
                                xaxis:  {
				    label:        'km',
				    labelPos:	  'low',
                                    tickDecimals:   0,
                                    min:            0,
                                    max:            100,
                                    tickSize:       4,
                                },
                                yaxis:  {
			 	    label:	  'ft AGL',
				    labelPos:	  'high',
                                    min:            0,
                                    max:            50000,
                                    tickSize:       5000,
                                    tickDecimals:   0
                                }
                            }
                        )

                $.plot(
                    $('#vcp'+vcps[i].toString()+'-draw-overview'), 
                    VcpData[vcps[i]], 
                    {
                        xaxis:  {
                            show:           false,
                            min:            0,
                            max:            100
                        },
                        yaxis:  {
                            show:           false,
                            min:            0,
                            max:            50000
                        }
                    }
                );
		
	    });

	})(i);
    }
                $('#close').click(function(){
                        window.close();
                }); 

}

