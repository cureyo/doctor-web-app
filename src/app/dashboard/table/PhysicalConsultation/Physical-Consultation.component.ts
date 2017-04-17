import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder,Validators} from "@angular/forms";
import {AuthService} from "../../../services/firebaseauth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-PhysicalConsultation',
    moduleId: module.id,
    templateUrl: 'Physical-Consultation.component.html'
})

export class PhysicalConsultationComponent{
        @Input() timeInterval: any;
        @Input() dateInterval: any;
        @Input() patient:any;
        @Input() user:any;
    
    private physicalconsult: any;
    private currentItem: any;
    private currentDate: any;
      constructor(private _authService: AuthService) { }
    ngOnInit() {
        this._authService._findOnboardingReviewItemNext(this.patient.uid, 'Physical_Consultation', null)
            .subscribe(res => {
                if (res[0]) {
                      this.physicalconsult = res[0];
                console.log("response of physical consultation is :",res);
                console.log("physical consultation data test: ",this.physicalconsult);
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
