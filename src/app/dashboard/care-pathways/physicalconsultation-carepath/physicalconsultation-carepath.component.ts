import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../services/firebaseauth.service";
// import { MedReminder } from "../models/medReminder.interface";
import { FbService } from "../../../services/facebook.service";
import { Http } from '@angular/http';
import { AppConfig } from "../../../config/app.config";

@Component({
  selector: 'app-physicalconsultation-carepath',
  templateUrl: './physicalconsultation-carepath.component.html',
  //styleUrls: ['./physicalconsultation-carepath.component.css']
})
export class PhysicalconsultationCareComponent implements OnInit {
  @Input() objectId: any;
  @Input() doctorId: any;
  @Input() timeInterval: any;
  @Input() dateInterval: any;
  @Input() consultantId: any;
  public  pctForm: FormGroup;
  private itemAdded7: boolean = false;
  private address: Object = null;
  private pctDrName: string = '';
  private physicalData:any;
  constructor(
    private _fb: FormBuilder,
    private _fs: FbService,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router,
    private http: Http
    
  ) { }

  ngOnInit() {
      var ConstID=this.consultantId;
      if(this.objectId){
              console.log("if called",this.objectId)
                     this.pctForm = this._fb.group({
                      frequency: ['', [Validators.required]],
                      date: [this.dateInterval, [Validators.required]],
                      timing: ['', [Validators.required]],
                              });
        this._authService._getTransactionData(this.objectId)
        .subscribe(response=>{
            var id=this.consultantId;
                this.physicalData=response[ConstID];              
                if (this.physicalData){
                     console.log("this.physiclData",this.physicalData);
                      this.pctForm = this._fb.group({
                      frequency: [this.physicalData.Job_Frequency, [Validators.required]],
                      date: [this.physicalData.Job_Date, [Validators.required]],
                      timing: [this.physicalData.Job_Time, [Validators.required]],
                           });
                }
        });
      }
      else{
        console.log("else called ",this.objectId);
          this.pctForm = this._fb.group({
          frequency: ['monthly', [Validators.required]],
          date: [this.dateInterval, [Validators.required]],
          timing: ['10:00 AM', [Validators.required]],
                      });
      }

  } //ngOnInIt

  savePCT = (model) => {
    let reminder = {}, reviewData = {},
      job = model['value'];
      console.log("job values test:",job);
      var self=this;
    this._authService._getPartner(this.doctorId)
      .subscribe(
      partnerData => {
        console.log("this is the fee test",this.physicalData,this.physicalData.ConsultDrName);
        
        reminder['Job_By'] = this.doctorId;
        reminder['Job_For'] = "#patientId";
        reminder['Job_Frequency'] = job['frequency'];
        reminder['Job_Time'] = job['timing'];
        reminder['Job_Date'] = job['date'];
        reminder['Job_Type'] = "Physical_Consultation";
        reminder['ConsultantId'] = this.consultantId;
        reminder['ConsultDrName'] = self.physicalData.ConsultDrName;
        reminder['ConsultDrName'] =job['consultant'] ;
        reminder['ConsultFee'] = this.physicalData.ConsultFee;
        console.log("reminder value test :",reminder);
        //save data in scheduled job

        

      //   this._authService._saveTransactionData(reminder, this.objectId, this.consultantId).then(
      //     res => {
      //       this.itemAdded7 = true;
      //       let d = res;
      //       //console.log("response of onboarding save is",d);
      //     })
      }
      )


  }//savePCT
}
