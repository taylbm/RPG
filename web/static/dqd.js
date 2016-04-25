var now = new Date();
var then = new Date(now.getTime() - 182.5 * 24 * 3600 * 1e3);
var month = new Date(now.getTime() - (365/12) * 24 * 3600 * 1e3);
var sevenDays = new Date(now.getTime() - 7 * 24 * 3600 * 1e3);
var timeInterval = {
			'7Days':sevenDays/1000,
			'1Month':month/1000,
			'6Months':then/1000
};
var weights = [0.25,0.33,0.42] // IMPORTANT: DO NOT CHANGE ----> Weights for Rain, Snow, & Bragg methods, respectively
var storeValues = {};
function mean(arr)
{
    var i,
        sum = 0,
	len = arr.length;
    for (i=0; i < len; i++) {
	sum += arr[i];
    }
    return sum / len;
}

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
    var whichPage = ui.toPage.get(0).id;
    var method = whichPage.replace('-page', '');
    var possibleChartName = method + '-container';
    var pageMainName = method + '-main';
    var chartContainer = $('#' + possibleChartName);
    storeValues = {}
        
    if (chartContainer.length < 1)
        return;
    
    chartContainer.height('400').width($('#' + pageMainName).width() * 0.8).css('margin', 'auto');
    
    var belowDataToPlot = [],
        aboveDataToPlot = [],
	dailyPoints	= [],
	overTolerance	= []
    ;
    if(redundant == "True"){
	var chan1 = {'belowDataToPlot':[],'aboveDataToPlot':[]}	
	    chan2 = {'belowDataToPlot':[],'aboveDataToPlot':[]}
	; 
        if (method == 'bragg'){
            $.each(SummaryData, function (idx, obj) {
		    var channel = 'chan' + RedundantData[idx]
                    eval(channel)['belowDataToPlot'].push([obj.time * 1e3, obj.medianBragg < 0 ? obj.medianBragg : null]);
                    eval(channel)['aboveDataToPlot'].push([obj.time * 1e3, obj.medianBragg >= 0 ? obj.medianBragg : null]);
		    overTolerance.push([obj.time * 1e3, -0.50 > obj.medianBragg || obj.medianBragg > 0.50 ? obj.medianBragg : null]);
                    storeValues[obj.time * 1e3] = obj.medianBragg;
            });
	    $.each(DailyData, function(idx, obj) {
	        dailyPoints.push([obj.time * 1e3, obj.medianBragg]);
	    });
        } 	
	else if (method == 'rain'){
	    $.each(SummaryData, function (idx, obj) {
                    var channel = 'chan' + RedundantData[idx]
                    eval(channel)['belowDataToPlot'].push([obj.time * 1e3, obj.medianRain < 0 ? obj.medianRain : null]);
                    eval(channel)['aboveDataToPlot'].push([obj.time * 1e3, obj.medianRain >= 0 ? obj.medianRain : null]);
                    overTolerance.push([obj.time * 1e3, -0.50 > obj.medianRain || obj.medianRain > 0.50 ? 0.50 : null]);
                    storeValues[obj.time * 1e3] = obj.medianRain;            
	    });
	    $.each(DailyData, function(idx, obj) {
		dailyPoints.push([obj.time * 1e3, obj.medianRain]);
	    });
	}
	else if (method == 'snow'){
	    $.each(SummaryData, function (idx, obj) {
                    var channel = 'chan' + RedundantData[idx]
                    eval(channel)['belowDataToPlot'].push([obj.time * 1e3, obj.medianSnow < 0 ? obj.medianSnow : null]);
                    eval(channel)['aboveDataToPlot'].push([obj.time * 1e3, obj.medianSnow >= 0 ? obj.medianSnow : null]);
                    overTolerance.push([obj.time * 1e3, -0.50 > obj.medianSnow || obj.medianSnow > 0.50 ? 0.50 : null]);
                    storeValues[obj.time * 1e3] = obj.medianSnow;
	    });
	    $.each(DailyData, function(idx, obj) {
	        dailyPoints.push([obj.time * 1e3, obj.medianSnow]);
	    });
	}
    }
    else {
        if (method == 'bragg'){
            $.each(SummaryData, function (idx, obj) {
                    belowDataToPlot.push([obj.time * 1e3, obj.medianBragg < 0 ? obj.medianBragg : null]);
                    aboveDataToPlot.push([obj.time * 1e3, obj.medianBragg >= 0 ? obj.medianBragg : null]);
                    overTolerance.push([obj.time * 1e3, -0.50 > obj.medianBragg || obj.medianBragg > 0.50 ? 0.50 : null]);
                    storeValues[obj.time * 1e3] = obj.medianBragg;            
            });
            $.each(DailyData, function(idx, obj) {
                dailyPoints.push([obj.time * 1e3, obj.medianBragg]);
            });
        }
        else if (method == 'rain'){
            $.each(SummaryData, function (idx, obj) {
                    belowDataToPlot.push([obj.time * 1e3, obj.medianRain < 0 ? obj.medianRain : null]);
                    aboveDataToPlot.push([obj.time * 1e3, obj.medianRain >= 0 ? obj.medianRain : null]);
		    overTolerance.push([obj.time * 1e3, -0.50 > obj.medianRain || obj.medianRain > 0.50 ? 0.50 : null]);
		    storeValues[obj.time * 1e3] = obj.medianRain; 
            });
            $.each(DailyData, function(idx, obj) {
                dailyPoints.push([obj.time * 1e3, obj.medianRain]);
            });
        }
        else if (method == 'snow'){
            $.each(SummaryData, function (idx, obj) {
                    belowDataToPlot.push([obj.time * 1e3, obj.medianSnow < 0 ? obj.medianSnow : null]);
                    aboveDataToPlot.push([obj.time * 1e3, obj.medianSnow >= 0 ? obj.medianSnow : null]);
                    overTolerance.push([obj.time * 1e3, -0.50 > obj.medianSnow || obj.medianSnow > 0.50 ? 0.50 : null]);
                    storeValues[obj.time * 1e3] = obj.medianSnow;

            });
            $.each(DailyData, function(idx, obj) {
                dailyPoints.push([obj.time * 1e3, obj.medianSnow]);
            });
        }
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
	for (p in plotAdd){
            plotOpts.push(
		{
		    data: eval(plotAdd[p])['belowDataToPlot'],
		    lines:    {
			show: true,
			fill: true,
			fillColor:'rgb(0,0,128)'
		    }
		}
	    );
            plotOpts.push(
		{
		    data: eval(plotAdd[p])['aboveDataToPlot'],
		    lines:    {
			show: true,	
			fill: true,
			fillColor:'rgb(128,0,0)'
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
    }

    plotOpts.push(
        {
            data:dailyPoints,
            color:'black',
            points: {
                show: true,
                symbol: "cross",
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
	rBragg = {'chan1':[],'chan2':[]};
        rSnow = {'chan1':[],'chan2':[]};
        rRain = {'chan1':[],'chan2':[]};
	
	if(time != 'MostRecent'){
            $.each(DailyData, function(idx,obj){
                if(timeInterval[time] <= obj.time){
		    var channel = 'chan' + RedundantData[idx]
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
		if (RedundantData[idx] == chan.replace('chan','')) {
                    tRain = obj.medianRain;
            	    tSnow = obj.medianSnow;
            	    tBragg = obj.medianBragg;
		    return false;
		}
	    });
	}
		    
    }
    else {
        if(time != 'MostRecent'){
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
