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
  @Input() Prescription: boolean;
  @Input() doctorId: any;
  @Input() patientId: any;
  @Input() prescriptionId: any;

  public showDay: boolean = false;
  public showDate: boolean = false;
  public MedForm: FormGroup;
  private itemAdded2: boolean = false;
  private medData: any;
  constructor(
    private _fb: FormBuilder,
    private _fs: FbService,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router

  ) { }


  ngOnInit() {
    console.log(this.objectId);
    console.log("MedName as input is", this.MedNames);
    this._authService._getMedicineNames()
      .subscribe(data => {
        //console.log("patholodical test details data :", data);
        this.MedNames = data;
        //this._cacheService.set('medNames', { 'data': this.MedNames }, { expires: Date.now() + 1000 * 60 * 60 });
        console.log("the med names is :", this.MedNames);
      })
    if (this.objectId) {
      this.MedForm = this._fb.group({
        medicines: this._fb.array([
          this.initMedicines()
        ])
      });

      //here is the code to get the transaction data
      this._authService._getTransactionData(this.objectId)
        .subscribe(response => {
          this.medData = response.MedicationReminder;
          console.log("response data based one the object Id:", response);

          if (this.medData) {
            console.log("its called wid", this.medData)
            var index = 0;
            this.MedForm = this._fb.group({
              medicines: this._fb.array([
                this.initMedicinesData(index)
              ])
            });
            for (var i = 1; i < this.medData.length; i++) {
              console.log("loop", i);
              this.addMedicineData(i);
            }
          }
        })

    }
    else {
      this.MedForm = this._fb.group({
        medicines: this._fb.array([
          this.initMedicines()
        ])
      });
    }

  }//end of ngOnInIt

  initMedicinesData(i) {
    console.log("initmedicineData test:", this.medData[i].MedName);
    if (this.Prescription) {
      return this._fb.group({
        name: [this.medData[i].MedName, Validators.required],
        instructions: [this.medData[i].nstructions, Validators.required]
      });
    }
    else {


      return this._fb.group({
        name: [this.medData[i].MedName, Validators.required],
        frequency: [this.medData[i].MedFreq, Validators.required],
        day: [this.medData[i].MedDay],
        date: [this.medData[i].MedDate, Validators.required],
        timing: [this.medData[i].MedTiming, Validators.required],
      });
    }
  }//iniMedicine's
  addMedicineData(i) {
    const control = <FormArray>this.MedForm.controls['medicines'];
    control.push(this.initMedicinesData(i));

  }//addMedicine


  initMedicines() {
    if (this.Prescription) {
      return this._fb.group({
        name: [, Validators.required],
        instructions: [, Validators.required]
      });
    }
    else {
      return this._fb.group({
        name: ['', Validators.required],
        frequency: ['', Validators.required],
        day: ['saturday'],
        date: ['2', Validators.required],
        timing: ['', Validators.required],
      });
    }
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


  saveMed(model) {
    let job = model['value'];
    console.log("this is medication job", Object.keys(job));
    if (this.Prescription) {
      console.log(job);
      console.log(job.medicines);
      let presList = [], cnt = 0;
      for (let item of job.medicines) {
        console.log(item);
        presList[cnt] = {name: item['name'].name, instructions: item['instructions'] };
        cnt++;
      }
      this._authService._savePrescription(presList, this.doctorId, this.patientId, this.prescriptionId, 'Medication').then(
        res => {
          let d = res;
          console.log(res);
          this.itemAdded2 = true;
          //console.log("response of onboarding save is",d);
        });
    }
    else {
      // console.log("this is medication job",Object.values(job.medication[Object.keys(job.medication)]));
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
        console.log(medicines[i].name);
        console.log(medicines[i])
        let medNam, medId
        if (medicines[i].name.name) {
          medNam = medicines[i].name.name;
          medId = medicines[i].name.id;
        }
        else {
          medNam = medicines[i].name;
          medId = medicines[i].name;
        }

        reminders.Job_Medicines.push({
          "Job_Frequency": medicines[i].frequency,
          "Medicine_Name": [medicines[i].name],
          "Job_Time": medicines[i].timing,
          "Job_Day": medicines[i].day,
          "Job_Date": medicines[i].date
        });
        reviewData.push({
          "MedFreq": medicines[i].frequency,
          "MedName": medNam,
          "name": medId,
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
      console.log("reminder value  test:", reminders);
      console.log("review data is :", reviewData[0]);
      // this._authService._saveReminders(reminders)
      //   .then(

      //   data => {
      //     this.itemAdded2 = true;
      //     //console.log("Medication Reminder  data saved :",data);
      //   }
      //   );
      console.log("the objectID value ", this.objectId);
      console.log(reviewData[0]['MedName']);
      console.log(reviewData[0]['name']);
      //  save data in onboarding Review
      var transTime = new Date();
      var self = this;
      setTimeout(
        function () {
          self._authService._saveTransactionData(reviewData, self.objectId, 'MedicationReminder/').then(
            res => {
              let d = res;
              self.itemAdded2 = true;
              //console.log("response of onboarding save is",d);
            });
        }, 200
      )
    }
  }//save


}
