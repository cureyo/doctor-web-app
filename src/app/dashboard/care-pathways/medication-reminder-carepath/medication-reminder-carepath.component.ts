import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../services/firebaseauth.service";
import { FbService } from "../../../services/facebook.service";
import { MedReminder } from "../../../models/medReminder.interface";

@Component({
  selector: 'app-medication-reminder-carepath',
  templateUrl: './medication-reminder-carepath.component.html',
  //styleUrls: ['./medication-reminder-carepath.component.css']
})
export class MedicationReminderCareComponent implements OnInit {

  @Input() objectId: any;
  @Input() timeInterval: any;
  @Input() dateInterval: any;
  @Input() MedNames: any;
  public showDay: boolean = false;
  public showDate: boolean = false;
  public MedForm: FormGroup;
  private itemAdded2: boolean = false;
  private medData:any;
  constructor(
    private _fb: FormBuilder,
    private _fs: FbService,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router

  ) { }


  ngOnInit() {
       if(this.objectId){
          this.MedForm = this._fb.group({
              medicines: this._fb.array([
              this.initMedicines()
                              ])
                            });
          
     //here is the code to get the transaction data
    this._authService._getTransactionData(this.objectId)
    .subscribe(response=>{
            this.medData=response.MedicationReminder;
         console.log("response data based one the object Id:",response);
              
             if (this.medData){
               var index=0;
              this.MedForm = this._fb.group({
              medicines:this._fb.array([ 
              this.initMedicinesData(index)
                              ])
                            });
              for (var i=1;i<this.medData.length;i++){
                console.log("loop",i);
                 this.addMedicineData(i);
              }
             }  
    })
     
     }
     else{   
              this.MedForm = this._fb.group({
              medicines: this._fb.array([
              this.initMedicines()
                              ])
                            });
            }    
       
  }//end of ngOnInIt

  initMedicinesData(i) {
      return this._fb.group({
      name: [this.medData[i].MedName, Validators.required],
      frequency: [this.medData[i].MedFreq, Validators.required],
      day: [this.medData[i].MedDay],
      date: [this.medData[i].MedDate, Validators.required],
      timing: [this.medData[i].MedTiming, Validators.required],
    });
  }//iniMedicine's
  addMedicineData(i) {
    const control = <FormArray>this.MedForm.controls['medicines'];
    control.push(this.initMedicinesData(i));

  }//addMedicine


  initMedicines() {
    return this._fb.group({
      name: ['', Validators.required],
      frequency: ['', Validators.required],
      day: ['saturday'],
      date: ['2', Validators.required],
      timing: ['', Validators.required],
    });
  }//iniMedicine's
  addMedicine() {
    const control = <FormArray>this.MedForm.controls['medicines'];
    control.push(this.initMedicines());

  }//addMedicine

   switchDay = (event) => {
    let target = event.target || event.srcElement || event.currentTarget,
      mode = $(target).val(),
      medDays = $(target).parent().nextAll('.med_days'),
      medDate = $(target).parent().nextAll('.med_dates');
    //console.log(medDays);
    //console.log(medDate);
    //console.log(mode);
    //console.log(target);

    if (mode == 'daily') {
      medDate.addClass('hide');
      medDays.addClass('hide');
      this.showDay = false;
      this.showDate = false;
    } else {
      if (mode == 'weekly') {
        medDays.removeClass('hide');
        medDate.addClass('hide');
        this.showDay = true;
        this.showDate = false;
      } else {
        medDays.addClass('hide');
        medDate.removeClass('hide');
        this.showDay = false;
        this.showDate = true;
      }
    }//else

  }//switchDay()


  saveMed = (model) => {

    let job = model['value'];
    let medicines = job['medicines'],
      ctr = 0,
      flag;

    let reminders = {
      "Job_By": "#doctorId",
      "Job_For": "#patientId",
      "Job_Medicines": [],
      "Job_Type": "Medication Reminder",

    };
    let reviewData = [];

    for (let i = 0; i < medicines.length; i++) {

      reminders.Job_Medicines.push({
        "Job_Frequency": medicines[i].frequency,
        "Medicine_Name": [medicines[i].name.name],
        "Job_Time": medicines[i].timing,
        "Job_Day": medicines[i].day,
        "Job_Date": medicines[i].date
      });
      reviewData.push({
        "MedFreq": medicines[i].frequency,
        "MedName": medicines[i].name.name,
        "name": medicines[i].name.name,
        "MedTiming": medicines[i].timing,
        "MedDay": medicines[i].day,
        "MedDate": medicines[i].date,
      });

      for (let j = i + 1; j < medicines.length; j++) {
        flag = false;
        if (medicines[i].frequency == medicines[j].frequency && medicines[i].timing == medicines[j].timing) {
          if (medicines[j].frequency == 'daily') {

            flag = true;
          } else if (medicines[j].frequency == 'weekly') {
            if (medicines[i].day == medicines[j].day) {
              flag = true;
            }
          } else if (medicines[i].date == medicines[j].date) {
            flag = true;

          }//elseif

        }//if

        if (flag) {

          reminders['Job_Medicines'][ctr].Medicine_Name.push(medicines[j].name.name);
          medicines.splice(j, 1);
          j--;
        }//flag

      }//loop j
      ctr++;
    }//loop i

    this._authService._saveReminders(reminders)
      .then(

      data => {
        this.itemAdded2 = true;
        //console.log("Medication Reminder  data saved :",data);
      }
      );
    //console.log("the reminders value ",reminders);
    //  save data in onboarding Review
    var transTime = new Date();
    this._authService._saveTransactionData(reviewData, this.objectId, 'Medication Reminder/').then(
      res => {
        let d = res;
        this.itemAdded2 = true;
        //console.log("response of onboarding save is",d);
      });
  }//save


}
