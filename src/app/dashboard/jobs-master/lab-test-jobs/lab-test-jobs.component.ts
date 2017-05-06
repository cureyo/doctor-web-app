import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators,FormArray} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/firebaseauth.service";
import {FbService} from "../../../services/facebook.service";

@Component({
  selector: 'app-lab-test-jobs',
  templateUrl: './lab-test-jobs.component.html',
  styleUrls: ['./lab-test-jobs.component.css']
})
export class LabTestJobsComponent implements OnInit {
      @Input() user:any;
      @Input() patient:any;
      @Input() timeInterval:any;
      @Input() dateInterval:any;
      @Input () MedNames:any;
       
   public stForm: FormGroup;
   private itemAdded3: boolean = false;
 constructor(
              private _fb: FormBuilder,
              private _fs: FbService,
              private route: ActivatedRoute,
              private _authService: AuthService,
              private router: Router

   ) {}

  ngOnInit() {
    //  //console.log("input val of user :",this.user);
    //  //console.log("input val of patient :",this.patient);
    //  //console.log("input val of time :",this.timeInterval);
    //  //console.log("input val of date :",this.dateInterval);

    this.stForm = this._fb.group({
      labtests: this._fb.array([
        this.initLabTest()
      ])
    });
  }
  initLabTest(){
      return this._fb.group({
        name: ['', Validators.required],
        frequency: ['', Validators.required],
        day: ['Saturday'],
        date: ['2',Validators.required],
        timing: ['10:00 AM', Validators.required],
    });
  }//initLabTest's
  addLabTest(){
    const control = <FormArray>this.stForm.controls['labtests'];
    control.push(this.initLabTest());

  }//addLabTest

    save_stForm= (model) =>{
   let job = model['value'],
        labtests = job['labtests'],
        ctr = 0,
        flag;
    let reminders = {
        "Job_By" : this.user,
        "Job_For" : this.patient.uid,
        "Job_Type" : "Lab Test",
        "Job_Tests": []
      };
    let reviewData = [];

    for(let i=0; i < labtests.length; i++) {
      reminders.Job_Tests.push({
        "Job_Frequency" : labtests[i].frequency,
        "Test_Name" : [labtests[i].name.name],
        "Job_Time" : labtests[i].timing,
         "Job_Day" : labtests[i].day,
        "Job_Date" : labtests[i].date,
      });
       reviewData.push({
        "TestFreq" : labtests[i].frequency,
        "name" : labtests[i].name.name,
        "TestName" : labtests[i].name.name,
        "TestTime" : labtests[i].timing,
         "TestDay" : labtests[i].day,
        "TestDate" : labtests[i].date,
        
      });
    
        for (let j = i + 1; j < labtests.length; j++) {
          flag = false;
          if (labtests[i].frequency == labtests[j].frequency && labtests[i].timing == labtests[j].timing) {
              if (labtests[j].frequency == 'monthly') {
                flag = true;
              }else if(labtests[j].frequency == '2months'){
                  if (labtests[i].day == labtests[j].day) {
                    flag =true;
                  }
              }else if(labtests[i].date == labtests[j].date) {
                  flag = true;
              }//elseif

          }//if
          //console.log("labtests is", labtests)
          if(flag) {
             //console.log("labtests[j].name.name",labtests[j].name.name);
            reminders['Job_Tests'][ctr].Test_Name.push(labtests[j].name.name);// here is the bug
            labtests.splice(j, 1);
            j--;
          }//flag

        }//loop j
      ctr++;
    }//loop i
    //console.log("the reminders value ",reminders);

    this._authService._saveReminders(reminders)
      .then(
        data => {
          this.itemAdded3 = true;
            //console.log("lab test data saved :",data);
        }
      );
      //console.log("the reminders value ",labtests);
    // //  save data in onboarding Review
    var transTime = new Date();
      this._authService._saveOnboardingReview(reviewData,this.patient.uid, 'Lab Test/' + transTime.getTime()).then(
        res =>{
          let d=res;
          this.itemAdded3 = true;
          //console.log("response of onboarding save is",d);
      })
      
  }//save

}
