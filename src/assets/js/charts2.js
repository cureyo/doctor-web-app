if ('undefined' !== typeof module) {

    module.exports =  
    function initPlancharts(unPara1, unPara1CV, unPara1TV, unPara2, unPara2CV, unPara2TV, unPara3, unPara3CV, unPara3TV) {
          /* ----------==========     Emails Subscription Chart initialization    ==========---------- */
console.log("creating chart");
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

        //start animation for the Emails Subscription Chart
        md.startAnimationForBarChart(unhealthyChart1);

            /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

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

        //start animation for the Emails Subscription Chart
        md.startAnimationForBarChart(unhealthyChart2);

            /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

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

        //start animation for the Emails Subscription Chart
        md.startAnimationForBarChart(unhealthyChart3);

        
    }
}
