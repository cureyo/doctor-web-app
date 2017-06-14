import { Component, OnInit, Inject, Input } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from "../../services/firebaseauth.service";
import BarChart = require('../../../assets/js/barchart.js');
declare var $: any

@Component({
    selector: 'care-timeline-cmp',
    moduleId: module.id,
    templateUrl: 'care-timeline.component.html',

    styleUrls: ['./care-timeline.component.css'],

})

export class CareTimelinesComponent implements OnInit {
    @Input() caredoneId: any;
    @Input() doctorId: any;
    //@Input() carePathId: any; 
    private updatesArray: any = [];
    private carePathArray: any = [];
    private modalsImage: any;
    private stakeHolderArray: any = [];
    private carePathExists: boolean = false;


    constructor(private _authService: AuthService) { }
    ngOnInit() {
        this._authService._getPatientUpdates(this.caredoneId)
            .subscribe(
            data => {
                this.updatesArray = data;
                if (this.updatesArray[0])
                this.carePathExists = true;
                if (this.carePathExists) {
                     this._authService._getCarePathway()
                    .subscribe(
                    pathData => {
                        this.carePathArray = pathData;
                        console.log(this.updatesArray);
                        console.log(this.carePathArray);
                        let temp = [];
                        for (let item of this.carePathArray) {
                            temp[item.$key] = item.path;
                        }
                        this.carePathArray = temp;
                        console.log(this.carePathArray);
                        
                        this._authService._getPartner(this.doctorId)
                            .subscribe(
                            pData => {
                                console.log(pData);
                                this.stakeHolderArray = [];
                                this._authService._findCaredOne(this.doctorId, this.caredoneId)
                                    .subscribe(
                                    cdData => {
                                        this.stakeHolderArray['patient'] = cdData.firstName;
                                        for (let each in pData.consult) {
                                            this.stakeHolderArray[each] = pData.consult[each].name
                                        }
                                        for (let each in pData.vendors) {
                                            this.stakeHolderArray[each] = pData.vendors[each].name
                                        }
                                        console.log(this.stakeHolderArray);
                                     
                                        for (let carepath in this.updatesArray) {
                                            
                                            for (let item in this.updatesArray[carepath]) {
                                                 console.log(item);
                                            if (this.updatesArray[carepath][item].chart) {
                                                console.log(this.updatesArray[carepath][item]);
                                                let tableVal = [], tableTitle = [], maxValue = this.updatesArray[carepath][item].chart.data[0].value, ctr = 0;
                                                for (let vals in this.updatesArray[carepath][item].chart.data) {
                                                    tableVal[ctr] = this.updatesArray[carepath][item].chart.data[vals].value;
                                                    tableTitle[ctr] = this.updatesArray[carepath][item].chart.data[vals].title;
                                                    if (tableVal[ctr] > tableVal[ctr -1]) 
                                                    maxValue = tableVal[ctr];
                                                    ctr++
                                                    
                                                }
                                                console.log(tableVal, tableTitle);
                                                setTimeout(
                                                    function () {
                                                        console.log(tableVal, tableTitle);
                                                        var ctLabels = tableTitle;
                                                        var ctSeries = tableVal;
                                                        var t = BarChart(ctLabels, ctSeries, maxValue, 'careChart' + item);
                                                        console.log("checkInChartId :", t);
                                                    }, 2000
                                                )
                                            }
                                            }
                                           

                                        }

                                    }
                                    )

                            }
                            )
                    }
                    )
                }
               
            }
            )
    }
    showImage(url2) {
        this.modalsImage = url2;
        $('#imageModal').modal('show');

    }
}