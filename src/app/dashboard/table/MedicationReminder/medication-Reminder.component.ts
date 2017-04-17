import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../services/firebaseauth.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-MedicationReminder',
    moduleId: module.id,
    templateUrl: 'medication-Reminder.component.html'
})

export class MedicationReminderComponent{
        @Input() timeInterval: any;
        @Input() dateInterval: any;
        @Input() patient:any;
        @Input() user:any;
       

    private itemDetails: any;
    private suggestedMeds: any;
    private currentItem: any;
    private currentDate: any;
      constructor(private _authService: AuthService) { }
    ngOnInit() {
        var transTime = new Date();
        console.log(this.patient.uid)
        this._authService._findOnboardingReviewItemNext(this.patient.uid, 'Medication Reminder', null )
            .subscribe(res => {
                console.log(res);
                console.log(res[0]);
                console.log(res[1]);
               
                console.log("medication remidner data test: ",this.suggestedMeds);
  
                console.log("current item check is :",this.currentItem);
                //console.log(this.currentItem);
                if(res[0]) {
                this.suggestedMeds = res[0];
                this.currentItem = res[0].$key;
                var time = new Date().getTime();
                time = parseInt(this.currentItem);
                var date = new Date(time);
                this.currentDate = date.toString();
                }
                console.log("medication remidner data test: ",this.suggestedMeds);
  
                console.log("current item check is :",this.currentItem);

            });

    }

    fetchNext(next) {
        this._authService._findOnboardingReviewItemNext(this.patient.uid, 'Medication Reminder', next)
            .subscribe(res => {
                console.log("res[0]");
                console.log(res);
                console.log(res[0]);
                console.log(res[1]);
                if(res[0]) {
                this.suggestedMeds = res[0];
                this.currentItem = res[0].$key;
                var time = new Date().getTime();
                time = parseInt(this.currentItem);
                var date = new Date(time);
                this.currentDate = date.toString();
                }
                

            });

    }
        fetchPrev(next) {
        this._authService._findOnboardingReviewItemPrev(this.patient.uid, 'Medication Reminder', next)
            .subscribe(res => {
                console.log("res[0]");
                console.log(res);
                console.log(res[0]);
                console.log(res[1]);
                if(res[0]) {
                this.suggestedMeds = res[0];
                this.currentItem = res[0].$key;
                var time = new Date().getTime();
                time = parseInt(this.currentItem);
                var date = new Date(time);
                this.currentDate = date.toString();
                }
                

            });

    }
}
