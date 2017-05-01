if ('undefined' !== typeof module) {

    module.exports = function initDemo(labTitles, labValues, exerTitles, exerValues, exerMax, medTitles, medValues, bsTitles, bsValues, bsMax,bpTitles, bpValuesSys,bpValuesDias, bpMax, unPara1, unPara1CV, unPara1TV, unPara2, unPara2CV, unPara2TV, unPara3, unPara3CV, unPara3TV){
        
        /* ----------==========     Daily Sales Chart initialization    ==========---------- */
       console.log(labTitles);
        console.log("creating chart")
        if(exerValues) {
         
           dataDailySalesChart = {
            labels: exerTitles,
            series: [
                exerValues
            ]
        };

        optionsDailySalesChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: exerMax + 1, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
        };
        console.log("Creating Exercise Chart1");
         
        console.log(dataDailySalesChart);
        console.log(optionsDailySalesChart);
        var dailySalesChart;
        setTimeout(function() {
          dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);
          console.log(dailySalesChart);
          if(dailySalesChart.container != null) {
            md.startAnimationForLineChart(dailySalesChart);
          }
          
        }, 2000); 
         
         
        
        }


        /* ----------==========     Completed Tasks Chart initialization    ==========---------- */
        if (bsValues) {
        dataCompletedTasksChart = {
            labels: bsTitles,
            series: [
                bsValues
            ]
        };

        optionsCompletedTasksChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: bsMax, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
        }

        

        // start animation for the Completed Tasks Chart - Line Chart
        console.log("Creating Blood Sugar Chart");
        console.log(dataCompletedTasksChart);
        console.log(optionsCompletedTasksChart);
        
        setTimeout(function() {
          var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);
          console.log(completedTasksChart);
          if (completedTasksChart.container != null) {
            md.startAnimationForLineChart(completedTasksChart);
          }
            
        }, 2000); 
        
       
        } 
     /* ----------==========     Completed Tasks Chart initialization    ==========---------- */
        if(bpTitles) {
        dataCompletedTasksChart2 = {
            labels: bsTitles,
            series: [
                bpValuesSys,
                bpValuesDias
            ]
        };

        optionsCompletedTasksChart2 = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: bpMax, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
        }

        var completedTasksChart2 = new Chartist.Line('#completedTasksChart2', dataCompletedTasksChart2, optionsCompletedTasksChart2);
         console.log("Creating BP Chart");
        // start animation for the Completed Tasks Chart - Line Chart
        console.log(completedTasksChart2);
        if (dataCompletedTasksChart2.container != null) {
            md.startAnimationForLineChart(completedTasksChart2);
        }
      
        }
        /* ----------==========     Emails Subscription Chart initialization    ==========---------- */
        if (medTitles) {
          console.log(medTitles);
          console.log(medValues);
        var dataEmailsSubscriptionChart = {
          labels: medTitles,
          series: [
            medValues

          ]
        };
        var optionsEmailsSubscriptionChart = {
            axisX: {
                showGrid: false
            },
            low: 0,
            high: 110,
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
        
        console.log("Creating Medication Chart");
        console.log(dataEmailsSubscriptionChart);
        console.log(optionsEmailsSubscriptionChart);
        
        setTimeout(function() {
          var emailsSubscriptionChart = Chartist.Bar('#emailsSubscriptionChart', dataEmailsSubscriptionChart, optionsEmailsSubscriptionChart, responsiveOptions);
           
           console.log(emailsSubscriptionChart.container);
           if(emailsSubscriptionChart.container != null) {
             md.startAnimationForBarChart(emailsSubscriptionChart);
           }
           
        }, 2000); 
        //start animation for the Emails Subscription Chart
       
        }
           /* ----------==========     Emails Subscription Chart initialization    ==========---------- */
        console.log("labTitles", labTitles)
        if (labTitles) {
          
        var dataEmailsSubscriptionChart2 = {
          labels: labTitles,
          series: [
            labValues

          ]
        };
        var optionsEmailsSubscriptionChart2 = {
            axisX: {
                showGrid: false
            },
            low: 0,
            high: 110,
            chartPadding: { top: 0, right: 5, bottom: 5, left: 0}
        };
        var responsiveOptions2 = [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ];
       
        //start animation for the Emails Subscription Chart
        console.log("Creating Lab Charts");
        console.log(dataEmailsSubscriptionChart2);
        console.log(optionsEmailsSubscriptionChart2);
        
        setTimeout(function() {
          var emailsSubscriptionChart2 = Chartist.Bar('#emailsSubscriptionChart2', dataEmailsSubscriptionChart2, optionsEmailsSubscriptionChart2, responsiveOptions2);
          console.log(emailsSubscriptionChart2);
          if(emailsSubscriptionChart2.container != null) {
            md.startAnimationForBarChart(emailsSubscriptionChart2);
          }
           
        }, 2000); 
        
        }
        if (unPara1CV) {
          
          var dataEmailsSubscriptionChart1 = {
          labels: ['Current Value', 'Target Value'],
          series: [
            [unPara1CV, unPara1TV]

          ]
        };
        var optionsEmailsSubscriptionChart1 = {
            axisX: {
                showGrid: false
            },
            low: 0,
            high: 110,
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
        var unhealthyChart1 = Chartist.Bar('#unhealthyChart1', dataEmailsSubscriptionChart1, optionsEmailsSubscriptionChart1, responsiveOptions);
        console.log("Creating Unhealthy Chart1");
        //start animation for the Emails Subscription Chart
        if(unhealthyChart1.container != null) {
        md.startAnimationForBarChart(unhealthyChart1);
        }
        }
            /* ----------==========     Emails Subscription Chart initialization    ==========---------- */
        if (unPara2CV) {
        var dataEmailsSubscriptionChart2 = {
          labels: ['Current Value', 'Target Value'],
          series: [
            [unPara2CV, unPara2TV]

          ]
        };
        var optionsEmailsSubscriptionChart2 = {
            axisX: {
                showGrid: false
            },
            low: 0,
           
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
        var unhealthyChart2 = Chartist.Bar('#unhealthyChart2', dataEmailsSubscriptionChart2, optionsEmailsSubscriptionChart2, responsiveOptions);
         console.log("Creating Unhealthy Chart2");
        //start animation for the Emails Subscription Chart
        if(unhealthyChart2.container != null) {
        md.startAnimationForBarChart(unhealthyChart2);
        }
        }
            /* ----------==========     Emails Subscription Chart initialization    ==========---------- */
        if (unPara3CV) {
        var dataEmailsSubscriptionChart3 = {
          labels: ['Current Value', 'Target Value'],
          series: [
            [unPara3CV, unPara3TV]

          ]
        };
        var optionsEmailsSubscriptionChart3 = {
            axisX: {
                showGrid: false
            },
            low: 0,
            high: 110,
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
        var unhealthyChart3 = Chartist.Bar('#unhealthyChart3', dataEmailsSubscriptionChart3, optionsEmailsSubscriptionChart3, responsiveOptions);
         console.log("Creating Unhealthy Chart3");
        //start animation for the Emails Subscription Chart
        if(unhealthyChart3.container != null) {
        md.startAnimationForBarChart(unhealthyChart3);
        }
        }
        

        
    }
}
