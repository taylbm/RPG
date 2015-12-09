var now = new Date();
var then = new Date(now.getTime() - 182.5 * 24 * 3600 * 1e3);
var month = new Date(now.getTime() - (365/12) * 24 * 3600 * 1e3);
var sevenDays = new Date(now.getTime() - 7 * 24 * 3600 * 1e3);
var timeInterval = {
			'7Days':sevenDays/1000,
			'1Month':month/1000,
			'6Months':then/1000
};
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
function dBMean(arr) 
{
    var linearPow = arr.map(function(x) Math.pow(10,(x/10)));
    var linearMean = mean(linearPow);
    var convertedBack = 10 * Math.log10(linearMean);
    return convertedBack;
}
function setSizes(event, ui)
{
    if (!SummaryData)
        return;
 
    var whichPage = ui.toPage.get(0).id;
    var method = whichPage.replace('-page', '');
    var possibleChartName = method + '-container';
    var pageMainName = method + '-main';
    var chartContainer = $('#' + possibleChartName);
        
    if (chartContainer.length < 1)
        return;
    
    chartContainer.height('400').width($('#' + pageMainName).width() * 0.8).css('margin', 'auto');
    
    var belowDataToPlot = [],
        aboveDataToPlot = []
    ;
    
    if (method == 'bragg')        
        $.each(SummaryData, function (idx, obj) {
            belowDataToPlot.push([obj.time * 1e3, obj.medianBragg < 0 ? obj.medianBragg : null]);
            aboveDataToPlot.push([obj.time * 1e3, obj.medianBragg >= 0 ? obj.medianBragg : null]);
        });
    else if (method == 'rain')
        $.each(SummaryData, function (idx, obj) {
            belowDataToPlot.push([obj.time * 1e3, obj.medianRain < 0 ? obj.medianRain : null]);
            aboveDataToPlot.push([obj.time * 1e3, obj.medianRain >= 0 ? obj.medianRain : null]);
        });
    else if (method == 'snow')
        $.each(SummaryData, function (idx, obj) {
            belowDataToPlot.push([obj.time * 1e3, obj.medianSnow < 0 ? obj.medianSnow : null]);
            aboveDataToPlot.push([obj.time * 1e3, obj.medianSnow >= 0 ? obj.medianSnow : null]);
        });
    
    $.plot(
        chartContainer, 
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
                olor: 'rgb(128, 128, 255)', 
                fillBetween: 'topTolerance'
            }, 
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
            },
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
        ], 
        {
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

function determineOverview(flag,timePeriod)
{
    var tBragg = -99,
        tSnow = -99,
        tRain = -99,
	mBragg = [],
	mSnow = [],
	mRain = []
    ;
  
    if(flag){
        $.each(SummaryData, function(idx,obj){
    	    if(timeInterval[timePeriod] <= obj.time){
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
        tRain = SummaryData[SummaryData.length - 1].medianRain,
        tSnow = SummaryData[SummaryData.length - 1].medianSnow,
        tBragg = SummaryData[SummaryData.length - 1].medianBragg
    ;
		    	
    var valsForOverview = [];
    
    $.each([tRain, tSnow, tBragg], function (ix, obj) {
        if (obj > -99.0 && obj != null) 
            valsForOverview.push(obj);
    });
    if (valsForOverview.length == 1)
	MainGage.refresh(valsForOverview[0]);
    else 
        MainGage.refresh(dBMean(valsForOverview));
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
