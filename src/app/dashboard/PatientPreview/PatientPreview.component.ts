import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import { FbService } from "../../services/facebook.service";
import { AppConfig } from "../../config/app.config";
import { Caredone } from "../../models/caredone.interface";

import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';

 declare var $:any;
@Component({
  selector: 'app-PatientPreviewComponent',
  moduleId: module.id,
  templateUrl: 'PatientPreview.component.html',
  providers: [CacheService]
})

export class PatientPreviewComponent implements OnInit {


  private patientDetails: boolean = false;
  private prescriptionPad: boolean = false;
  private reportSection: boolean = false;
  private planSection: boolean = false;
  private caredone: any;
  
  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router,
    private http: Http,

  ) {
    // this.currentUser = this._authService._getCurrentUser();

  } //constructor

  ngOnInit() {
       this._authService._getUser()
      .subscribe(
      data => {
                  this.route.params.subscribe(
      params => {
        let param = params['id'];
        console.log("caredoneKey", param);
        this._authService._findCaredOne(data.user.uid, param)
          .subscribe(
          data => {
            this.caredone = data;
            console.log("caredone data:",this.caredone);
          })

      });


      });


  }

  profileButton() {
    this.patientDetails = true;
    this.prescriptionPad = false;
    this.reportSection = false;
    this.planSection = false;
    $('#profileButton2').addClass('btn-primary');
    $('#prescriptionButton2').removeClass('btn-primary');
    $('#planButton2').removeClass('btn-primary');
    $('#reportButton2').removeClass('btn-primary');
  }
  
    prescriptionButton() {
    this.patientDetails = false;
    this.prescriptionPad = true;
    this.reportSection = false;
    this.planSection = false;
    $('#prescriptionButton2').addClass('btn-primary');
    $('#profileButton2').removeClass('btn-primary');
    $('#planButton2').removeClass('btn-primary');
    $('#reportButton2').removeClass('btn-primary');
  }

    planButton() {
    this.patientDetails = false;
    this.prescriptionPad = false;
    this.reportSection = false;
    this.planSection = true;
    $('#planButton2').addClass('btn-primary');
    $('#profileButton2').removeClass('btn-primary');
    $('#prescriptionButton2').removeClass('btn-primary');
    $('#reportButton2').removeClass('btn-primary');
  }

    reportButton() {
    this.patientDetails = false;
    this.prescriptionPad = false;
    this.reportSection = true;
    this.planSection = false;
    $('#reportButton2').addClass('btn-primary')
    $('#planButton2').removeClass('btn-primary');
    $('#profileButton2').removeClass('btn-primary');
    $('#prescriptionButton2').removeClass('btn-primary');
  }


}
