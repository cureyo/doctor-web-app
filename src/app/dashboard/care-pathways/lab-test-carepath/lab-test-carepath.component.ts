import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators,FormArray} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/firebaseauth.service";
import {FbService} from "../../../services/facebook.service";

@Component({
  selector: 'app-lab-test-carepath',
  templateUrl: './lab-test-carepath.component.html',
  //styleUrls: ['./lab-test-carepath.component.css']
})
export class LabTestCareComponent implements OnInit {
       @Input() objectId: any;
      @Input() timeInterval: any;
      @Input() dateInterval: any;
      @Input () MedNames: any;
       
   public stForm: FormGroup;
   private itemAdded3: boolean = false;
   private labData:any;
 constructor(
              private _fb: FormBuilder,
              private _fs: FbService,
              private route: ActivatedRoute,
              private _authService: AuthService,
              private router: Router

   ) {}

  ngOnInit() {
   if(this.objectId){
          this.stForm = this._fb.group({
              labtests: this._fb.array([
              this.initLabTest()
                              ])
                            });
          
     //here is the code to get the transaction data
    this._authService._getTransactionData(this.objectId)
    .subscribe(response=>{
            this.labData=response.LabTest;
         console.log("response data based one the object Id:",response);
              
             if (this.labData){
               var index=0;
              this.stForm = this._fb.group({
             labtests:this._fb.array([ 
              this.initLabTestData(index)
                              ])
                            });
              for (var i=1;i<this.labData.length;i++){
                console.log("loop",i);
                 this.addLabTestData(i);
              }
             }  
    })
     
     }
     else{   
              this.stForm = this._fb.group({
              labtests: this._fb.array([
              this.initLabTest()
                              ])
                            });
            }    
       
  }//end of ngOnInIt

  initLabTestData(i) {
      return this._fb.group({
      name: [this.labData[i].TestName, Validators.required],
      frequency: [this.labData[i].TestFreq, Validators.required],
      day: [this.labData[i].TestDay],
      date: [this.labData[i].TestDate, Validators.required],
      timing: [this.labData[i].TestTime, Validators.required],
    });
  }//iniMedicine's
  addLabTestData(i) {
    const control = <FormArray>this.stForm.controls['labtests'];
    control.push(this.initLabTestData(i));

  }//addMedicine
  initLabTest(){
      return this._fb.group({
        name: ['', Validators.required],
        frequency: ['', Validators.required],
        day: ['Saturday'],
        date: ['',Validators.required],
        timing: ['', Validators.required],
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
        "Job_By" : "#doctorId",
      "Job_For": "#patientId",
        "Job_Type" : "Lab Test",
        "Job_Tests": []
      };
    let reviewData = [];

    for(let i=0; i < labtests.length; i++) {
      reminders.Job_Tests.push({
        "Job_Frequency" : labtests[i].frequency,
        "Test_Name" : [labtests[i].name],
        "Job_Time" : labtests[i].timing,
         "Job_Day" : labtests[i].day,
        "Job_Date" : labtests[i].date,
      });
       reviewData.push({
        "TestFreq" : labtests[i].frequency,
        "name" : labtests[i].name.id,
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
            
            reminders['Job_Tests'][ctr].Test_Name.push(labtests[j].name.name);// here is the bug
            labtests.splice(j, 1);
            j--;
          }//flag

        }//loop j
      ctr++;
    }//loop i
    //console.log("the reminders value ",reminders);

    // this._authService._saveReminders(reminders)
    //   .then(
    //     data => {
    //       this.itemAdded3 = true;
    //         //console.log("lab test data saved :",data);
    //     }
    //   );
      //console.log("the reminders value ",labtests);
    // //  save data in onboarding Review
    var transTime = new Date();
    var self = this;
    setTimeout(
      function() {
        self._authService._saveTransactionData(reviewData,self.objectId,  'LabTest/').then(
        res =>{
          let d=res;
          self.itemAdded3 = true;
          //console.log("response of onboarding save is",d);
      })
      }, 200
    )
      
      
  }//save

}
