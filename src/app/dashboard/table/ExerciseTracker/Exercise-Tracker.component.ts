import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder,Validators} from "@angular/forms";
import {AuthService} from "../../../services/firebaseauth.service";
import {ActivatedRoute, Router} from "@angular/router";
@Component({
    selector: 'app-ExerciseTracker',
    moduleId: module.id,
    templateUrl: 'Exercise-Tracker.component.html'
})

export class ExerciseTrackerComponent{
        @Input() timeInterval: any;
        @Input() dateInterval: any;
        @Input() patient:any;
        @Input() user:any;
    
    private exerciseTracker: any;
    private currentItem: any;
    private currentDate: any;
      constructor(private _authService: AuthService) { }
    ngOnInit() {
        this._authService._findOnboardingReviewItemNext(this.patient.uid, 'Exercise_Tracker', null)
            .subscribe(res => {
                if (res[0]) {
                this.exerciseTracker = res[0];
                console.log("response of exerciseTracker is :",res);
                console.log("exerciseTracker data test: ",this.exerciseTracker);
                this.currentItem = res[0].$key;
                console.log("current item check is :",this.currentItem);
                console.log(this.currentItem);
                var time = new Date().getTime();
                time = parseInt(this.currentItem);
                var date = new Date(time);
                this.currentDate = date.toString();
                }


            });

    }   
}
