import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder,Validators} from "@angular/forms";
import {AuthService} from "../../../services/firebaseauth.service";
import {ActivatedRoute, Router} from "@angular/router";
@Component({
    selector: 'app-BloodSugarTracker',
    moduleId: module.id,
    templateUrl: 'Blood-Sugar-Tracker.component.html'
})

export class BloodSugarTrackerComponent{
    @Input() timeInterval: any;
        @Input() dateInterval: any;
        @Input() patient:any;
        @Input() user:any;
    
    private bloodsugarTracker: any;
    private bloodpressureTracker:any;
    private sugarcurrentItem: any;
    private sugarcurrentDate: any;
    private pressurecurrentItem: any;
    private pressurecurrentDate: any;
      constructor(private _authService: AuthService) { }
    ngOnInit() {
        this._authService._findOnboardingReviewItemNext(this.patient.uid, 'BloodSugar',null)
            .subscribe(res => {
                this.bloodsugarTracker = res[1];
                console.log("response of bloodsugarTracker is :",res);
                console.log("bloodsugarTracker data test: ",this.bloodsugarTracker);
                this.sugarcurrentItem = res[1].$key;
                console.log("current item check is :",this.sugarcurrentItem);
                console.log(this.sugarcurrentItem);
                var time = new Date().getTime();
                time = parseInt(this.sugarcurrentItem);
                var date = new Date(time);
                this.sugarcurrentDate = date.toString();
                console.log("the current time for bsugar",this.sugarcurrentDate);

            });


            this._authService._findOnboardingReviewItemNext(this.patient.uid, 'BloodPressure', null)
            .subscribe(res => {
                this.bloodpressureTracker = res[0];
                console.log("response of bloodpressureTracker is :",res);
                console.log("bloodpressureTracker data test: ",this.bloodpressureTracker);
                this.pressurecurrentItem = res[0].$key;
                console.log("current item check is :",this.pressurecurrentItem);
                console.log(this.pressurecurrentItem);
                var time = new Date().getTime();
                time = parseInt(this.pressurecurrentItem);
                var date = new Date(time);
                this.pressurecurrentDate = date.toString();

            });





    }   
    
}
