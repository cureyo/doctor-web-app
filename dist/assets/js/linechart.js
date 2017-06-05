module.exports=function LineChart(Title,Values,MinValue,MaxValue,ChartNameID){
     //console.log("LineChart called",Title,Values,MinValue,MaxValue,ChartNameID);
    if (Title && Values && ChartNameID)
         { 
            
           if(Values) {
                dataLineChart = {
                labels: Title,
                series: [Values]
                                      };
                console.log("dataLineChart",dataLineChart);
                optionsLinechart = {
                lineSmooth: Chartist.Interpolation.cardinal
                ({tension: 0}),
                low: MinValue*0.9,
                high: MaxValue*1.2, 
                chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
                                          };
                //console.log("dataLineChart",dataLineChart);
               
                var LineChart;
               
                setTimeout(function() {
                LineChart = new Chartist.Line(
                                       '#' + ChartNameID, 
                                      dataLineChart,
                                      optionsLinechart
                                      );
                                   
               
                if(LineChart.container != null) {
                md.startAnimationForLineChart(LineChart);}
                }, 2000); 
         
              
        
               }
      //End Of Daily Charts Initialize
       } 
    //Main IF
       else {
             //alert("parameter is invalid or undefined in line chart");
       }
    return (ChartNameID);
} //end of bar chart;



//   var testArr=[{name:"Med1",freq:"1"},{name:"Med2",freq:"2"}];
//    var id= LineChart("medication title",testArr,110,"Medication Chart");
//          console.log("id is :",id);