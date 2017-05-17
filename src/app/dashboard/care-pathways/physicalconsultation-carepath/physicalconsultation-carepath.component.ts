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
      
      if(this.objectId){
                     this.pctForm = this._fb.group({
                      frequency: ['monthly', [Validators.required]],
                      date: ['1', [Validators.required]],
                      timing: ['10:00 AM', [Validators.required]],
                              });
        this._authService._getTransactionData(477872276)
        .subscribe(response=>{
            var id=this.consultantId;
                this.physicalData=response.id;
            console.log("response data based one the object Id:",response);
                  
                if (this.physicalData){
                       console.log("inside the data") ;
                      this.pctForm = this._fb.group({
                      frequency: [this.physicalData.Job_Frequency, [Validators.required]],
                      date: [this.physicalData.Job_Date, [Validators.required]],
                      timing: [this.physicalData.Job_Time, [Validators.required]],
                           });
                }
        });
      }
      else{
          this.pctForm = this._fb.group({
          frequency: ['monthly', [Validators.required]],
          date: ['1', [Validators.required]],
          timing: ['10:00 AM', [Validators.required]],
                      });
      }

  } //ngOnInIt

  savePCT = (model) => {
    let reminder = {}, reviewData = {},
      job = model['value']
      ;
    this._authService._getPartner(this.doctorId)
      .subscribe(
      partnerData => {
        
        reminder['Job_By'] = this.doctorId;
        reminder['Job_For'] = "#patientId";
        reminder['Job_Frequency'] = job['frequency'];
        reminder['Job_Time'] = job['timing'];
        reminder['Job_Date'] = job['date'];
        reminder['Job_Type'] = "Physical_Consultation";
        reminder['ConsultantId'] = this.consultantId;
        reminder['ConsultDrName'] = partnerData['consultant'][this.consultantId].name;
        reminder['ConsultFee'] = partnerData['consultant'][this.consultantId].fee;
        //console.log("reminder value test :",reminder);
        //save data in scheduled job

        

        this._authService._saveTransactionData(reminder, this.objectId, this.consultantId).then(
          res => {
            this.itemAdded7 = true;
            let d = res;
            //console.log("response of onboarding save is",d);
          })
      }
      )


  }//savePCT
}
