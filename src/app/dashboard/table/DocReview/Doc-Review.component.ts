'use strict';

import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder,Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import initDemo = require('../../../../assets/js/charts.js');
import {TableComponent} from '../table.component'
import {AuthService} from "../../../services/firebaseauth.service";



@Component({
    selector: 'app-DocReview',
    moduleId: module.id,
    templateUrl: 'Doc-Review.component.html'
})

export class DocReviewComponent{

        @Input() timeInterval: any;
        @Input() dateInterval: any;
        @Input() patient:any;
        @Input() user:any;
        @Input() doctor: any;
        private potentialrisk: any;
        private report:any;
        private unhealthyreport:any;
        private summary:any;
        private pcurrentItem: any;
        private pcurrentDate: any;
        private rcurrentItem: any;
        private rcurrentDate: any;
        private ucurrentItem: any;
        private ucurrentDate: any;
        private unhealthyRepReady: boolean = false;

            
    constructor (private table: TableComponent,private _authService: AuthService){}
       
private chartName: any = ['unhealthyChart1', 'unhealthyChart2', 'unhealthyChart3'];


  ngAfterViewInit() {
       let labTitles, labValues, exerTitles, exerValues, exerMax, medTitles, medValues, bsTitles, bsValues, bsMax,bpTitles, bpValuesSys,bpValuesDias, bpMax;
            
            console.log("calling chart");
            
            if (this.unhealthyRepReady) {
                //  initDemo(labTitles, labValues, exerTitles, exerValues, exerMax, medTitles, medValues, bsTitles, bsValues, bsMax,bpTitles, bpValuesSys,bpValuesDias, bpMax, this.onboardingReview.UnhealthyParameter[0].Name, this.onboardingReview.UnhealthyParameter[0].CurrentVal, this.onboardingReview.UnhealthyParameter[0].TargetVal, this.onboardingReview.UnhealthyParameter[1].Name, this.onboardingReview.UnhealthyParameter[1].CurrentVal, this.onboardingReview.UnhealthyParameter[1].TargetVal, this.onboardingReview.UnhealthyParameter[2].Name, this.onboardingReview.UnhealthyParameter[2].CurrentVal, this.onboardingReview.UnhealthyParameter[2].TargetVal)
                  
   
                  
            }
           
  }
       
    
    
     
    ngOnInit() {
        //potential risk code 
        this._authService._findOnboardingReviewItemNext(this.patient.uid, 'PotentialRisks', null)
            .subscribe(res => {
                this.potentialrisk = res[0];
                 this.pcurrentItem = res[0].$key;
                var time = new Date().getTime();
                time = parseInt(this.pcurrentItem);
                var date = new Date(time);
                this.pcurrentDate = date.toString();

            });//potential risk code 
            //report required code 
            this._authService._findOnboardingReviewItemNext(this.patient.uid, 'ReportsRequired', null)
            .subscribe(res => {
                if(res[0]) {
                this.report = res[0];
                this.rcurrentItem = res[0].$key;
                var time = new Date().getTime();
                time = parseInt(this.rcurrentItem);
                var date = new Date(time);
                this.rcurrentDate = date.toString();
                }
            });//report required
            //unhealthy reports
            this._authService._findOnboardingReviewItemNext(this.patient.uid, 'UnhealthyParameter',null)
            .subscribe(res => {
                let unhealthyR = [];
                console.log("unhealthy res", res)
                if(res[0]) {
                    let ctr = 0;
                    console.log("unhealthy res", res[0])
                    for (let item in res[0]) {
                        console.log(res[0][item].pName);
                        if (item != '$exists' && item !='$key') {
                            unhealthyR[item] = {pName: res[0][item].pName, cValue: res[0][item].cValue,tValue: res[0][item].tValue};
                    ctr++;
                    console.log("this.unhealthyreport[ctr]",unhealthyR[item])
                    this.unhealthyRepReady = false;
                        }
                             
                        
                   
                    }
                this.unhealthyreport = unhealthyR;
                this.unhealthyRepReady = true;
                console.log("unhealthy report", this.unhealthyreport)
                this.ucurrentItem = res[0].$key;
                var time = new Date().getTime();
                time = parseInt(this.ucurrentItem);
                var date = new Date(time);
                this.ucurrentDate = date.toString();
                console.log("unhealthy data & time ",this.unhealthyreport ,this.ucurrentDate);
                }
            });
            //end of unhealthy reports
            //summary code 
            this._authService._findOnboardingReviewItemNext(this.patient.uid, 'Summary', null)
            .subscribe(res => {
                if(res[0]) {
                this.summary = res[0];
                }
            });
            //end of summary 

            

    }  //ngOnInIt 

    //for potential risk 
    fetchNextPotentialRisk(next) {
        this._authService._findOnboardingReviewItemNext(this.patient.uid, 'PotentialRisks', next)
            .subscribe(res => {
                if(res[0]) {
                this.potentialrisk = res[0];
                this.pcurrentItem = res[0].$key;
                var time = new Date().getTime();
                time = parseInt(this.pcurrentItem);
                var date = new Date(time);
                this.pcurrentDate = date.toString();
                }
            });

    }
        fetchPrevPotentialRisk(next) {
        this._authService._findOnboardingReviewItemPrev(this.patient.uid, 'PotentialRisks', next)
            .subscribe(res => {
                if(res[0]) {
                this.potentialrisk = res[0];
                this.pcurrentItem = res[0].$key;
                var time = new Date().getTime();
                time = parseInt(this.pcurrentItem);
                var date = new Date(time);
                this.pcurrentDate = date.toString();
                }
            });

    }
    //end of potential risk 

    //required report part

    fetchNextReports(next) {
        this._authService._findOnboardingReviewItemNext(this.patient.uid, 'ReportsRequired', next)
            .subscribe(res => {
                if(res[0]) {
                this.report = res[0];
                this.rcurrentItem = res[0].$key;
                var time = new Date().getTime();
                time = parseInt(this.rcurrentItem);
                var date = new Date(time);
                this.rcurrentDate = date.toString();
                }
            });

    }
        fetchPrevReports(next) {
        this._authService._findOnboardingReviewItemPrev(this.patient.uid, 'ReportsRequired', next)
            .subscribe(res => {
                if(res[0]) {
                this.report = res[0];
                this.rcurrentItem = res[0].$key;
                var time = new Date().getTime();
                time = parseInt(this.rcurrentItem);
                var date = new Date(time);
                this.rcurrentDate = date.toString();
                }
                

            });

    }
    //end of report required part
    //unhealthy reports
    fetchNextUnhealthy(next) {
        this._authService._findOnboardingReviewItemNext(this.patient.uid, 'UnhealthyParameter', next)
            .subscribe(res => {
                if(res[0]) {
                this.unhealthyreport = res[0];
                this.ucurrentItem = res[0].$key;
                var time = new Date().getTime();
                time = parseInt(this.ucurrentItem);
                var date = new Date(time);
                this.ucurrentDate = date.toString();
                }
                

            });

    }
        fetchPrevUnhealthy(next) {
        this._authService._findOnboardingReviewItemPrev(this.patient.uid, 'UnhealthyParameter', next)
            .subscribe(res => {
                if(res[0]) {
                this.unhealthyreport = res[0];
                this.ucurrentItem = res[0].$key;
                var time = new Date().getTime();
                time = parseInt(this.ucurrentItem);
                var date = new Date(time);
                this.ucurrentDate = date.toString();
                }
                

            });

    }
    //end of unhealthy reports

}
