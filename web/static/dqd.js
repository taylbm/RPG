var now = new Date();
var then = new Date(now.getTime() - 182.5 * 24 * 3600 * 1e3);
var month = new Date(now.getTime() - (365/12) * 24 * 3600 * 1e3);
var sevenDays = new Date(now.getTime() - 7 * 24 * 3600 * 1e3);
var timeInterval = {
			'sevenDays':sevenDays/1000,
			'oneMonth':month/1000,
			'sixMonths':then/1000
};
var weights = [0.25,0.33,0.42] // IMPORTANT: DO NOT CHANGE ----> Weights for Rain, Snow, & Bragg methods, respectively
var summaryToolValues = {},
    dailyToolValues = {}
;

function median(arr) 
{

    arr.sort( function(a,b) {return a - b;} );

    var half = Math.floor(arr.length/2);

    if(arr.length % 2)
        return arr[half];
    else
        return (arr[half-1] + arr[half]) / 2.0;
}

function dBMeanWeighted(arr)
{
    var weightedLinearPow = 0;
    var weight = 0;
    for (var i in arr) {
        weightedLinearPow += weights[i]*Math.pow(10,(arr[i]/10))
        weight += weights[i]
    }
    var weightedLinearMean = weightedLinearPow/weight;
    var convertedBack = 10 * Math.log10(weightedLinearMean);
    return convertedBack;
}



function showTooltip(x, y, contents) {
    $('<div id="tooltip">' + contents + '</div>').css( {
        position: 'absolute',
        display: 'none',
        top: y + 5,
        left: x + 5,
        border: '1px solid #fdd',
        padding: '2px',
        'background-color': '#fee',
        opacity: 0.80
    }).appendTo("body").fadeIn(200);
}

function setSizes(event, ui, plotAdd)
{
    if (!SummaryData)
        return;
    var whichPage = ui.toPage.get(0).id,
        method = whichPage.replace('-page', ''),
        possibleChartName = method + '-container',
        pageMainName = method + '-main',
        chartContainer = $('#' + possibleChartName),
	name = 'median' + method.charAt(0).toUpperCase() + method.slice(1);
    ;
 	
    toolValues = {};
        
    if (chartContainer.length < 1)
        return;
    
    chartContainer.height('400').width($('#' + pageMainName).width() * 0.8).css('margin', 'auto');
    
    var belowDataToPlot = [],
        aboveDataToPlot = [],
	dailyPoints	= [],
	overTolerance	= []
    ;		
    if(redundant == "True"){
	var redundantChart = {"Chan1" : {'belowDataToPlot':[],'aboveDataToPlot':[],'dailyPoints':[],'overTolerance':[]}, 
			      "Chan2": {'belowDataToPlot':[],'aboveDataToPlot':[],'dailyPoints':[],'overTolerance':[]}
	}
	; 
        $.each(SummaryData, function (idx, obj) {	    
	    var channel = 'Chan' + obj.redundantMode
            redundantChart[channel]['belowDataToPlot'].push([obj.time * 1e3, obj[name] < 0 ? obj[name] : null]);
            redundantChart[channel]['aboveDataToPlot'].push([obj.time * 1e3, obj[name] >= 0 ? obj[name] : null]);
            redundantChart[channel]['overTolerance'].push([obj.time * 1e3, -0.50 > obj[name] || obj[name] > 0.50 ? 0.50 : null]);
            summaryToolValues[obj.time * 1e3] = [obj[name], channel];
        });
	$.each(DailyData, function(idx, obj) {
	    var channel = 'Chan' + obj.redundantMode
	    redundantChart[channel]['dailyPoints'].push([obj.time * 1e3, obj[name]]);
            dailyToolValues[obj.time * 1e3] = [obj[name],channel];
	});
    }
    else {
        $.each(SummaryData, function (idx, obj) {
            belowDataToPlot.push([obj.time * 1e3, obj[name] < 0 ? obj[name] : null]);
            aboveDataToPlot.push([obj.time * 1e3, obj[name] >= 0 ? obj[name] : null]);
            overTolerance.push([obj.time * 1e3, -0.50 > obj[name] || obj[name] > 0.50 ? 0.50 : null]);
            summaryToolValues[obj.time * 1e3] = [obj[name], false];            
        });
        $.each(DailyData, function(idx, obj) {
            dailyPoints.push([obj.time * 1e3, obj[name]]);
	    dailyToolValues[obj.time * 1e3] = [obj[name],false];
        });
    }
    var plotOpts =         
	[
            {
                id: 'topTolerance',
                data: [[then, 0.2], [now, 0.2]],
                lines:  {show: true, lineWidth: 0, fill: false}
            },
            {
                data: [[then, -0.2], [now, -0.2]],
                lines:  {
                    show: true,
                    lineWidth: 0,
                    fill: 0.2
                },
                color: 'rgb(128, 128, 255)',
                fillBetween: 'topTolerance'
            }
        ]
    if (redundant == "True"){
	for (var p = 0; p < plotAdd.length; p++){
            plotOpts.push(
		{
		    data: redundantChart[plotAdd[p]]['belowDataToPlot'],
		    lines:    {
			show: true,
			fill: true,
			fillColor:'rgb(0,0,128)'
		    }
		}
	    );
            plotOpts.push(
		{
		    data: redundantChart[plotAdd[p]]['aboveDataToPlot'],
		    lines:    {
			show: true,	
			fill: true,
			fillColor:'rgb(128,0,0)'
		    }
		}
	    );
            plotOpts.push(
                {
            	    data: redundantChart[plotAdd[p]]['dailyPoints'],
            	    color:'black',
            	    points: {
                        show: true,
                        symbol: plotAdd[p] == "Chan1" ? "circle" : "triangle",
                    }
                }
            );
            plotOpts.push(
                {
                    data: redundantChart[plotAdd[p]]['overTolerance'],
                    color: 'black',
                    points: {
                        show: true,
                        symbol: "square",
                    }
                }
            );


    	}
    }
    else{
	plotOpts.push(            
	    {
                data: belowDataToPlot,
                lines:   {
                    show: true,
                    fill:   true,
                    fillColor:  'rgb(0, 0, 128)'
                },
                points: {
                    show: false
                }
            }
	);
	plotOpts.push(
            {
                data: aboveDataToPlot,
                lines:   {
                    show: true,
                    fill:   true,
                    fillColor:  'rgb(128, 0, 0)'
                },
                points: {
                    show: false
                }
            }
	);
        plotOpts.push(
            {
                data:dailyPoints,
                color:'black',
                points: {
                    show: true,
                    symbol: "circle",
                }
            }
        );
        plotOpts.push(
            {
                data: overTolerance,
                color: 'black',
                points: {
                    show: true,
                    symbol: "square",
                }
            }
        );


    }
	
    $.plot(
        chartContainer,plotOpts, 
        {
	    grid: { hoverable: true },
            yaxis:  {
                min:    -0.5,
                max:    0.5,
                ticks:  [-0.5, -0.2, 0.0, 0.2, 0.5],
                tickFormatter:  function (v) { return v + ' dB'; }
            },
            xaxis: {
                mode: 'time', 
                timeformat: '%m/%d',
                min:    then,
                max:    now
            }
        }
    );
    
}

function normalizeToGage(val)
{
    return Math.max(0, Math.min(100, Math.round(val / 1.0 * 50 + 50)));
}

function determineOverview(time,chan)
{
    var tBragg = -99,
        tSnow = -99,
        tRain = -99,
	mBragg = [],
	mSnow = [],
	mRain = []
    ;
    if(redundant == "True"){
	rBragg = {'Chan1':[],'Chan2':[]};
        rSnow = {'Chan1':[],'Chan2':[]};
        rRain = {'Chan1':[],'Chan2':[]};
	
	if(time != 'latestVolume'){
            $.each(DailyData, function(idx,obj){
                if(timeInterval[time] <= obj.time){
		    var channel = 'Chan' + obj.redundantMode
                    rBragg[channel].push(obj.medianBragg);
                    rSnow[channel].push(obj.medianSnow);
                    rRain[channel].push(obj.medianRain);
                }
            });
            tRain = median(rRain[chan].filter(function(val) {return val !== null;}))
            tSnow = median(rSnow[chan].filter(function(val) {return val !== null;}))
            tBragg = median(rBragg[chan].filter(function(val) { return val !== null;}))  
        }
        else {
	    var copyData = JSON.parse(JSON.stringify(DailyData)).reverse()
	    $.each(copyData,function(idx,obj) {
		if (obj.redundantMode == chan.replace('Chan','')) {
                    tRain = obj.medianRain;
            	    tSnow = obj.medianSnow;
            	    tBragg = obj.medianBragg;
		    return false;
		}
	    });
	}
		    
    }
    else {
        if(time != 'latestVolume'){
            $.each(DailyData, function(idx,obj){
                if(timeInterval[time] <= obj.time){
                    mBragg.push(obj.medianBragg);
                    mSnow.push(obj.medianSnow);
                    mRain.push(obj.medianRain);
                }
            });
            tRain = median(mRain.filter(function(val) {return val !== null;}))
            tSnow = median(mSnow.filter(function(val) {return val !== null;}))
            tBragg = median(mBragg.filter(function(val) { return val !== null;}))
        }
        else
            tRain = DailyData[DailyData.length - 1].medianRain,
            tSnow = DailyData[DailyData.length - 1].medianSnow,
            tBragg = DailyData[DailyData.length - 1].medianBragg
        ;
    }
		    	
    var valsForOverview = [];
    
    $.each([tRain, tSnow, tBragg], function (ix, obj) {
        if (obj > -99.0 && obj != null) 
            valsForOverview.push(obj);
    });
    MainGage.refresh(dBMeanWeighted(valsForOverview));
    if (tRain == null || tRain == -99)
        RainGage.refresh('NaN');
    else
	RainGage.refresh(tRain);
    if (tSnow == null || tSnow == -99)
	SnowGage.refresh('NaN');
    else
        SnowGage.refresh(tSnow);
    if(tBragg == null || tBragg == -99)
	BraggGage.refresh('NaN');
    else
        BraggGage.refresh(tBragg);
}

function makeGages()
{
    MainGage = new JustGage({
        id:                     'main-gauge',
	value:			-99,
        min:                    -0.5,
        max:                    0.5,	
	decimals:		2,
	pointer:		true,
        title:                  'Overall ZDR data quality',
        levelColors:            ['#000000', '#ff0000', '#ffff00', '#00cc00','#00cc00','#ffff00', '#ff0000', '#000000'],
        levelColorsGradient:    true,
        label:                  'dB',
        showMinMax:             true
    });
    RainGage = new JustGage({
        id:                     'rain-gauge',
        value:                  -99,
        min:                    -0.5,
        max:                    0.5,
	decimals:		2,
	pointer:		true,
        title:                  'ZDR rain method',
        levelColors:            ['#000000', '#ff0000', '#ffff00', '#00cc00','#00cc00','#ffff00', '#ff0000', '#000000'],
        levelColorsGradient:    true,
        label:                  'dB',
        showMinMax:             true
    });
    SnowGage = new JustGage({
        id:                     'snow-gauge',
        value:                  -99,
        min:                    -0.5,
        max:                    0.5,
	decimals:		2,
	pointer:		true,
        title:                  'ZDR snow method',
        levelColors:            ['#000000', '#ff0000', '#ffff00', '#00cc00','#00cc00','#ffff00', '#ff0000', '#000000'],
        levelColorsGradient:    true,
        label:                  'dB',
        showMinMax:             true
    });
    BraggGage = new JustGage({
        id:                     'bragg-gauge',
        value:                  -99,
        min:                    -0.5,
        max:                    0.5,
	decimals:		2,
	pointer:		true,
        title:                  'ZDR Bragg method',
        levelColors:            ['#000000', '#ff0000', '#ffff00', '#00cc00','#00cc00','#ffff00', '#ff0000', '#000000'],
        levelColorsGradient:    true,
        label:                  'dB',
        showMinMax:             true
    });


}
