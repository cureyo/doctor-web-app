import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder,Validators} from "@angular/forms";
import {AuthService} from "../../../services/firebaseauth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-OnlineConsultation',
    moduleId: module.id,
    templateUrl: 'Online-Consultation.component.html'
})

export class OnlineConsultationComponent{
        @Input() timeInterval: any;
        @Input() dateInterval: any;
        @Input() patient:any;
        @Input() user:any;
    
    private onlineconsult: any;
    private currentItem: any;
    private currentDate: any;
      constructor(private _authService: AuthService) { }
    ngOnInit() {
        this._authService._findOnboardingReviewItemNext(this.patient.uid, 'Online_Consultation', null)
            .subscribe(res => {
                if (res[0]) {
                     this.onlineconsult = res[0];
                //console.log("response of online consultation is :",res);
                //console.log("online consultation data test: ",this.onlineconsult);
                this.currentItem = res[0].$key;
                //console.log("current item check is :",this.currentItem);
                //console.log(this.currentItem);
                var time = new Date().getTime();
                time = parseInt(this.currentItem);
                var date = new Date(time);
                this.currentDate = date.toString();
                }
               

            });

    }

    
}
