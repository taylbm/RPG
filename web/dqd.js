function setSizes(event, ui)
{
    if (!SummaryData)
        return;
    
    var whichPage = ui.toPage.get(0).id;
    var method = whichPage.replace('-page', '');
    var possibleChartName = method + '-container';
    var pageMainName = method + '-main';
    var chartContainer = $('#' + possibleChartName);
    var now = new Date();
    var then = new Date(now.getTime() - 182.5 * 24 * 3600 * 1e3);
    var sevenDays = 24 * 3600 * 1e3 * 7;
        
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
                color: 'rgb(128, 128, 255)', 
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
                timeformat: '%Y/%m/%d',
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

function determineOverview()
{
    var latestBragg = null,
        latestSnow = null,
        latestRain = null
    ;
    
    latestRain = SummaryData[SummaryData.length - 1].medianRain;
    latestSnow = SummaryData[SummaryData.length - 1].medianSnow;
    latestBragg = SummaryData[SummaryData.length - 1].medianBragg;
    
    var valsForOverview = [];
    
    $.each([latestRain, latestSnow, latestBragg], function (ix, obj) {
        if (obj > -99.0)
            valsForOverview.push(obj);
    });
    
    if (valsForOverview.length == 3)
        MainGage.refresh(valsForOverview.sort()[1]);
    else if (valsForOverview.length == 2)
        MainGage.refresh((valsForOverview[0] + valsForOverview[1]) / 2.0);
    else if (valsForOverview.length == 1)
        MainGage.refresh(valsForOverview[0]);
    
    RainGage.refresh(latestRain);
    SnowGage.refresh(latestSnow);
    BraggGage.refresh(latestBragg);
}

function makeGages()
{
    MainGage = new JustGage({
        id:                     'main-gauge',
        value:                  0.0,
        min:                    -0.5,
        max:                    0.5,
        title:                  'Overall ZDR data quality',
        levelColors:            ['#000000', '#ff0000', '#ffff00', '#00cc00', '#ffff00', '#ff0000', '#000000'],
        levelColorsGradient:    true,
        label:                  'dB',
        showMinMax:             true
    });
    RainGage = new JustGage({
        id:                     'rain-gauge',
        value:                  0.0,
        min:                    -0.5,
        max:                    0.5,
        title:                  'ZDR rain method',
        levelColors:            ['#000000', '#ff0000', '#ffff00', '#00cc00', '#ffff00', '#ff0000', '#000000'],
        levelColorsGradient:    true,
        label:                  'dB',
        showMinMax:             true
    });
    SnowGage = new JustGage({
        id:                     'snow-gauge',
        value:                  0.0,
        min:                    -0.5,
        max:                    0.5,
        title:                  'ZDR snow method',
        levelColors:            ['#000000', '#ff0000', '#ffff00', '#00cc00', '#ffff00', '#ff0000', '#000000'],
        levelColorsGradient:    true,
        label:                  'dB',
        showMinMax:             true
    });
    BraggGage = new JustGage({
        id:                     'bragg-gauge',
        value:                  0.0,
        min:                    -0.5,
        max:                    0.5,
        title:                  'ZDR Bragg method',
        levelColors:            ['#000000', '#ff0000', '#ffff00', '#00cc00', '#ffff00', '#ff0000', '#000000'],
        levelColorsGradient:    true,
        label:                  'dB',
        showMinMax:             true
    });
}
