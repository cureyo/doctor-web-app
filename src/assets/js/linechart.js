module.exports=function LineChart(Title,Values,MinValue,MaxValue,ChartNameID){
     console.log("LineChart called",Title,Values,ChartNameID);
    if (Title && Values && ChartNameID)
         { 
            //     for(var i=0;i<Values.length;i++)
            //       {
            //             console.log("values print",i,typeof Values,Values[i])
            //       }
        
           if(Values) {
                dataLineChart = {
                labels: Title,
                series: [Values]
                                      };
                console.log("dataLineChart",dataLineChart);
                optionsLinechart = {
                lineSmooth: Chartist.Interpolation.cardinal
                ({tension: 0}),
                low: MinValue,
                high: MaxValue+1000, 
                chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
                                          };
                console.log("dataLineChart",dataLineChart);
               
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
             alert("parameter is invalid or undefined in line chart");
       }
    return (ChartNameID);
} //end of bar chart;



//   var testArr=[{name:"Med1",freq:"1"},{name:"Med2",freq:"2"}];
//    var id= LineChart("medication title",testArr,110,"Medication Chart");
//          console.log("id is :",id);