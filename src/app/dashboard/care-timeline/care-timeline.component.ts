import { Component, OnInit, Inject, Input } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from "../../services/firebaseauth.service";
import BarChart = require('../../../assets/js/barchart.js');
import { ActivatedRoute, Router } from '@angular/router';
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
    private stakeHolderUIDs: any = [];


    constructor(private _authService: AuthService, private route: ActivatedRoute) { }
    ngOnInit() {
        console.log(this.caredoneId)
        this.route.params.subscribe(
            params => {
                if (params['id'])
                this.caredoneId = params['id'];
                
                this.updatesArray = [];
                this.carePathExists = false;
                this._authService._getPatientUpdates(this.caredoneId)
                    .subscribe(
                    data => {
                        console.log(data);
                        let updatesObject = data, pathCount = 0, tempUpdatesArray = [];
                        for (let updatePath in updatesObject) {
                            console.log(updatePath);
                            this.updatesArray[pathCount + 1] = [];
                            console.log(this.updatesArray[pathCount + 1]);
                            this.updatesArray[pathCount + 1]['$key'] = updatePath;
                            console.log(updatesObject[updatePath]['$key'])
                            if (updatesObject[updatePath]['$key'])
                                this.updatesArray[pathCount + 1]['$key'] = updatesObject[updatePath]['$key'];
                            else
                                this.updatesArray[pathCount + 1]['$key'] = updatePath;

                            let itemCount = 0;
                            for (let updateItem in updatesObject[updatePath]) {
                                console.log(updateItem);
                                if (updateItem != '$key' && updateItem != '$exists') {
                                    this.updatesArray[pathCount + 1][itemCount] = [];
                                    this.updatesArray[pathCount + 1][itemCount] = updatesObject[updatePath][updateItem];
                                    console.log(this.updatesArray[pathCount + 1][itemCount]);
                                    if (updatesObject[updatePath][updateItem]['$key'])
                                        this.updatesArray[pathCount + 1][itemCount]['$key'] = updatesObject[updatePath][updateItem]['$key'];
                                    else
                                        this.updatesArray[pathCount + 1][itemCount]['$key'] = updateItem;

                                    itemCount++;
                                }

                            }
                            this.updatesArray[pathCount + 1] = this.updatesArray[pathCount + 1].sort(function (a, b) { return (a.$key > b.$key) ? 1 : ((b.$key > a.$key) ? -1 : 0); });

                            console.log(this.updatesArray[pathCount + 1])
                            tempUpdatesArray = tempUpdatesArray.concat(this.updatesArray[pathCount + 1]);
                            pathCount++;
                        }
                        this.updatesArray[0] = tempUpdatesArray.sort(function (a, b) { return (a.$key > b.$key) ? 1 : ((b.$key > a.$key) ? -1 : 0); });
                        this.updatesArray[0]['$key'] = '-1';
                        console.log(this.updatesArray);
                        if (this.updatesArray[1])
                            this.carePathExists = true;

                        if (this.carePathExists) {
                            this._authService._getCarePathway()
                                .subscribe(
                                pathData => {
                                    this.carePathArray = pathData;
                                    console.log(this.updatesArray);
                                    console.log(this.carePathArray);
                                    let temp = [];
                                    temp['-1'] = "All Pathways";
                                    temp['unplanned'] = "Unplanned";
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
                                                    this.stakeHolderUIDs['patient'] = { messageType: "offline", uid: cdData.uid };
                                                    for (let each in pData.consult) {
                                                        var mType = "offline";
                                                        this.stakeHolderArray[each] = pData.consult[each].name;
                                                        if (pData.consult[each].uid)
                                                            mType = "online";
                                                        this.stakeHolderUIDs[each] = { messageType: mType, uid: pData.consult[each].uid };
                                                    }
                                                    for (let each in pData.vendors) {
                                                        this.stakeHolderArray[each] = pData.vendors[each].name;
                                                        if (pData.vendors[each].uid)
                                                            mType = "online";
                                                        this.stakeHolderUIDs[each] = { messageType: mType, uid: pData.vendors[each].uid };
                                                    }
                                                    console.log(this.stakeHolderArray);

                                                    for (let carepath in this.updatesArray) {

                                                        for (let item in this.updatesArray[carepath]) {
                                                            console.log(carepath, item, this.updatesArray[carepath][item]);
                                                            if (this.updatesArray[carepath][item].chart) {
                                                                console.log(this.updatesArray[carepath][item]);
                                                                let tableVal = [], tableTitle = [], maxValue = this.updatesArray[carepath][item].chart.data[0].value, ctr = 0;
                                                                for (let vals in this.updatesArray[carepath][item].chart.data) {
                                                                    tableVal[ctr] = this.updatesArray[carepath][item].chart.data[vals].value;
                                                                    tableTitle[ctr] = this.updatesArray[carepath][item].chart.data[vals].title;
                                                                    if (tableVal[ctr] > tableVal[ctr - 1])
                                                                        maxValue = tableVal[ctr];
                                                                    ctr++

                                                                }
                                                                console.log(tableVal, tableTitle);
                                                                var self = this;
                                                                setTimeout(
                                                                    function () {
                                                                        console.log(tableVal, tableTitle);
                                                                        var ctLabels = tableTitle;
                                                                        var ctSeries = tableVal;
                                                                        var chartName = 'careChart' + self.updatesArray[carepath]['$key'] + self.updatesArray[carepath][item]['$key'];
                                                                        var t = BarChart(ctLabels, ctSeries, maxValue, chartName);
                                                                        console.log(chartName);
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
            });
    }
    showImage(url2) {
        this.modalsImage = url2;
        $('#imageModal').modal('show');

    }
}