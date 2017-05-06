import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../services/firebaseauth.service";
import { ActivatedRoute, Router } from "@angular/router";
import {TableComponent} from '../table.component'


@Component({
    selector: 'app-SuggestedMedReminder',
    moduleId: module.id,
    templateUrl: 'Suggested-Med-Reminder.component.html'
})

export class SuggestedMedReminderComponent implements OnInit {
    @Input() timeInterval: any;
    @Input() dateInterval: any;
    @Input() patient: any;
    @Input() user: any;


    private itemDetails: any;
    private suggestedTests: any;
    private currentItem: any;
    private currentDate: any;
constructor(
        //private _fs: FbService, here is the error 
        private table: TableComponent,
        private _authService: AuthService,

    ) { }

    ngOnInit() {
        var chkTime = new Date()
        this._authService._findOnboardingReviewItemNext(this.patient.uid, 'Lab Test', null)
            .subscribe(res => {
                //console.log(res);
                //console.log(res[0]);
                //console.log(res[1]);
                if (res[0]) {
                     this.suggestedTests = res[0];
                this.currentItem = res[0].$key;
                
                //console.log(this.currentItem);
                var time = new Date().getTime();
                time = parseInt(this.currentItem);
                var date = new Date(time);
                this.currentDate = date.toString();
                }
               

            });

    }

    fetchNext(next) {
        this._authService._findOnboardingReviewItemNext(this.patient.uid, 'Lab Test', next)
            .subscribe(res => {
                //console.log("res[0]");
                //console.log(res);
                //console.log(res[0]);
                //console.log(res[1]);
                if(res[0]) {
                this.suggestedTests = res[0];
                this.currentItem = res[0].$key;
                var time = new Date().getTime();
                time = parseInt(this.currentItem);
                var date = new Date(time);
                this.currentDate = date.toString();
                }
                

            });

    }
        fetchPrev(next) {
        this._authService._findOnboardingReviewItemPrev(this.patient.uid, 'Lab Test', next)
            .subscribe(res => {
                //console.log("res[0]");
                //console.log(res);
                //console.log(res[0]);
                //console.log(res[1]);
                if(res[0]) {
                this.suggestedTests = res[0];
                this.currentItem = res[0].$key;
                var time = new Date().getTime();
                time = parseInt(this.currentItem);
                var date = new Date(time);
                this.currentDate = date.toString();
                }
                

            });

    }
}
