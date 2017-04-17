import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators,FormArray} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/firebaseauth.service";
import {FbService} from "../../../services/facebook.service";
import {ReportRequires}  from"../../../models/reportRequires.interface";
import {PotentialRisk}  from "../../../models/potentialRisk.interface";
import {UnhealthyParameterData} from "../../../models/unhealthyparameter.interface";
@Component({
  selector: 'app-doc-review-jobs',
  templateUrl: './doc-review-jobs.component.html',
  styleUrls: ['./doc-review-jobs.component.css']
})
export class DocReviewJobsComponent implements OnInit {
      @Input() user:any;
      @Input() patient:any;
      @Input() caredonesDoctor:any;
      @Input () MedNames:any;
   public docReviewForm:FormGroup;
   private rflag:boolean=false;
   private pflag:boolean=false;
   private uflag:boolean=false;
   private itemAdded:boolean=false;
  constructor(private _fb: FormBuilder,
              private _fs: FbService,
              private route: ActivatedRoute,
              private _authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    console.log(this.user)
    this.docReviewForm = this._fb.group({
       sm_text:[''],
       reports: this._fb.array([
        this.initReports()
      ]),
      risks: this._fb.array([  
      this.initRisks()
      ]),
       unhealthyparameters: this._fb.array([  
      this.initUnhealthyParameters()
      ])
    });
  }
   
   initUnhealthyParameters(){
      return this._fb.group({
        pName: ['', Validators.required],
        cValue:['',Validators.required],
        tValue:['',Validators.required]
         
    });
  }//iniUnhealthyParameters
  addUnhealthyParameters(){
    const control = <FormArray>this.docReviewForm.controls['unhealthyparameters'];
    control.push(this.initUnhealthyParameters());

  }//addUnhealthyParameters
  initReports(){
      return this._fb.group({
        rr_Name: ['', Validators.required],
        rr_Comment:['',Validators.required]
         
    });
  }//iniReports
  addReports(){
    const control = <FormArray>this.docReviewForm.controls['reports'];
    control.push(this.initReports());

  }//addReports
  initRisks(){
      return this._fb.group({
        Risk: ['', Validators.required],
       P_Comment: ['',Validators.required]
         
    }); 
  }
   
    addRisk(){
    const control = <FormArray>this.docReviewForm.controls['risks'];
    control.push(this.initRisks());

  }//addMedicine
 saveDocReview = (model) => {
    console.log("in save daco review :", model.value.reports[0]);
    let job = model['value'];
       let risks =job['risks']
      let  reports = job['reports']
      let unhealthyparameters=  job['unhealthyparameters'],
      ctr = 0,
      flag;
      console.log("reports required", reports);
    let reminders = {}, commentData: any, potentialRisks = [], reportsReqd = [], unhealthyParams = [];
        reminders['Job_Type'] = "Doc Review";
        reminders['Job_By'] = this.user.uid;
        reminders['Job_For'] = this.patient.uid;
        reminders['Doctor_Name']=this.caredonesDoctor.firstName +" "+this.caredonesDoctor.lastName;
        reminders['Summary']=job['sm_text'];
        reminders['Reports']=job.reports;
        reminders['Potential Risk']=job.risks;
        reminders ['Unhealthy parameters'] =job.unhealthyparameters; 
        commentData = {OverallComments: job['sm_text'], drName: this.user.firstName +" "+ this.user.lastName, drImage:  this.user.avatar, drID: this.user.uid};
        potentialRisks = job.risks;
        //reportsReqd = job.reports;
        unhealthyParams = job.unhealthyparameters;
     console.log("Doceview reminders value ",reminders);

      //save data in onboarding Review
      var transTime = new Date();
      if (unhealthyParams[0].pName != '') {
        this._authService._saveOnboardingReview(unhealthyParams,this.patient.uid, 'UnhealthyParameter/' + transTime.getTime()).then(
        res =>{ 
              this.itemAdded=true;
              this.pflag=true;
              this.rflag=true;
              this.uflag=true;
          let d=res;
          console.log("response of onboarding save is",res);
      })
      }
      if (job.reports[0].rr_Name != '') {
        for(let i=0; i < job.reports.length; i++) {
      reportsReqd.push({
        "name" : job.reports[i].rr_Name.name,
       
        "comment" : job.reports[i].rr_Comment
        });}
        this._authService._saveOnboardingReview(reportsReqd,this.patient.uid, 'ReportsRequired/' + transTime.getTime()).then(
        res =>{ 
              this.itemAdded=true;
              this.pflag=true;
              this.rflag=true;
              this.uflag=true;
          let d=res;
          console.log("response of onboarding save is",res);
      })
      }
      if (potentialRisks[0].Risk != '') {
        this._authService._saveOnboardingReview(potentialRisks,this.patient.uid, 'PotentialRisks/' + transTime.getTime()).then(
        res =>{ 
              this.itemAdded=true;
              this.pflag=true;
              this.rflag=true;
              this.uflag=true;
          let d=res;
          console.log("response of onboarding save is",res);
      })
      }
      if (commentData.OverallComments != '') {

        this._authService._saveOnboardingReview(commentData,this.patient.uid, 'Summary/' + transTime.getTime()).then(

        res =>{ 
              this.itemAdded=true;
              this.pflag=true;
              this.rflag=true;
              this.uflag=true;
          let d=res;
          console.log("response of onboarding save is",res);
      })
      }
      // this._authService._saveOnboardingReview(reminders,this.patient.uid, 'Doc Review').then(
      //   res =>{ 
      //         this.itemAdded=true;
      //         this.pflag=true;
      //         this.rflag=true;
      //         this.uflag=true;
      //     let d=res;
      //     console.log("response of onboarding save is",res);
      // })

      

  }//saveDocReview

}
