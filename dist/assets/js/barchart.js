module.exports=function BarChart(Title,Values,MaxValue,ChartNameID){
                 console.log("BarChart called",Title,Values,MaxValue,ChartNameID);
                if (Title && Values && MaxValue){
                    
                    if (Title) {
                    var dataBarChart = {
                    labels: Title,
                    series: [Values]
                    };
                    var optionsBarChart = {
                        axisX: {
                            showGrid: false
                        },
                        low: 0,
                        high: MaxValue,
                        chartPadding: { top: 0, right: 5, bottom: 5, left: 0}
                    };
                    var responsiveOptions = [
                    ['screen and (max-width: 640px)', {
                        seriesBarDistance: 5,
                        axisX: {
                        labelInterpolationFnc: function (value) {
                            return value[0];
                        }
                        }
                    }]
                    ];
                    
                    setTimeout(function() {
                    var BarChart = Chartist.Bar(
                         '#' + ChartNameID,
                          dataBarChart,
                          optionsBarChart,
                         responsiveOptions);
                    
                    //console.log(BarChart.container);
                    if(BarChart.container != null) {
                        md.startAnimationForBarChart(BarChart);
                    }
                    
                    }, 2000); 
                    //start animation for the Emails Subscription Chart
                
                } 
            } 
            else{
                alert("parameter is invalid in bar chart:")    ;
            }
 
     return ChartNameID;
}