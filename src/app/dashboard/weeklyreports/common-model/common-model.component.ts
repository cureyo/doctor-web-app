import { Component, OnInit, AfterViewInit, ViewContainerRef, Input, ChangeDetectorRef, EventEmitter, Output, ComponentFactoryResolver } from '@angular/core';
import { AuthService } from "../../../services/firebaseauth.service";
import { WeeklyReportComponent } from "../../weeklyreports/weeklyreports.component";
declare var $:any;
@Component({
  selector: 'app-common-model',
  templateUrl: './common-model.component.html',
  styleUrls: ['./common-model.component.css']
})
export class CommonModelComponent implements OnInit {
  @Input() caredOneId: any;
  @Input() jobType: any;

  private caredonejob: any;
  private schedJobType: any;
  private caredOneJobs: any = [];

  private TestName: any = [];
  private MedName: any = [];
  private jobFreq: any = [];
  private jobDay: any = [];
  private jobTime: any = [];
  private bloodPressure: any = [];
  private bloodSugar: any = [];
  private messageList: any = [];
  private itemsPresent: boolean = false;
  private jobReading: any;
  private exerciseTracker: any = [];
  private physicalConsultation: any = [];
  constructor(private _authService: AuthService, private weekly: WeeklyReportComponent) {
    
   }


  ngOnInit() {
    this.messageList = [];
   // this.TestName = this.MedName = this.bloodPressure = this.bloodSugar = this.physicalConsultation = this.exerciseTracker = null;
    this._authService._getCaredOneJobs(this.caredOneId)
      .subscribe(res => {

        var ctr = 0;
        if (this.jobType == "Blood Presssure" || this.jobType == "Blood Sugar" ) {
          this.schedJobType = "Device_Readings";
        } else {
          this.schedJobType = this.jobType;
        }

        for (let job of res) {
          /*  *****************************************************************/
          //preparing the array of cared Component
          if (job.Job_Type == this.schedJobType || (job.Job_Type == "Device_Readings" && job.Reading_Type == this.jobType)) {
            this.caredOneJobs[ctr] = job;
            //console.log("cared ones job :", this.caredOneJobs[ctr]);
            ctr++;
          }// cared one array is prepared
        }
        //console.log(this.caredOneJobs);
        
          /*  *****************************************************************/
          // preparing array for Lab Test 
          if (this.schedJobType == 'Lab Test') {
            for (let job_TestName of this.caredOneJobs) {
              // if(job_TestName.Job_Type=='Lab Test'){
              for (let i = 0; i < job_TestName.Job_Tests.length; i++) {
                //console.log("the length is :", i);
                for (let j = 0; j < job_TestName.Job_Tests[i].Test_Name.length; j++) {
                  var lastRem
                  if (job_TestName.Job_Tests[i].lastReminder != null) {
                    lastRem = 'sent on ' + job_TestName.Job_Tests[i].lastReminder;
                  } else {
                    lastRem = 'Not sent yet';
                  }
                  
                  this.messageList[j] = job_TestName.Job_Tests[i].Test_Name[j]
                    + " recommended " + job_TestName.Job_Tests[i].Job_Frequency + ". Last reminder: " + lastRem;
                  //console.log("test name", job_TestName.Job_Tests[i].Test_Name[j]);
                }
              }
            } // end of loop lab test
            // }// end of if
          } // Lab Test array data is prepared
          /*  *****************************************************************/
          //preparing array for Exercise Tracker 
          else if (this.schedJobType == 'Exercise Tracker') {
            let i = 0;
            for (let job_exerciseTracker of this.caredOneJobs) {
              if (job_exerciseTracker.Job_Type == 'Exercise Tracker') {
                this.messageList[i] = "Walk " + job_exerciseTracker.Job_Frequency + " for "
                  + job_exerciseTracker.Target_Distance + " Km";
                i++;
                //console.log("exercise tracker value :", this.exerciseTracker);
              }
            }//end of if
          }  //Exercise Tracker array data is prepared
          /*  *****************************************************************/
          //preparing array for Physical_Consultation 
          else if (this.schedJobType == 'Physical_Consultation') {
            let i = 0;
            for (let job_physcialconsult of this.caredOneJobs) {
              if (job_physcialconsult.Job_Type == 'Physical_Consultation') {
                 var lastRem
                  if (job_physcialconsult.lastReminder != null) {
                    lastRem = 'sent on ' + job_physcialconsult.lastReminder;
                  } else {
                    lastRem = 'Not sent yet';
                  }
                this.messageList[i] = "Consultation with " + job_physcialconsult.Doctor_Name + ", " + job_physcialconsult.Job_Frequency + " on " + job_physcialconsult.Job_Date + " at " + job_physcialconsult.Job_Time + ", in " + job_physcialconsult.Doctor_Area + ". Last reminder: " + lastRem;
                i++;
                //console.log("PhysicalConsultattion value :", this.physicalConsultation);
              }
            }//end of if
          }
          // //Physical_Consultation array data is prepared
          /*  *****************************************************************/
          else if (this.schedJobType == 'Medication Reminder') {
            for (let job_MedName of this.caredOneJobs) {
              //  if(job_MedName.Job_Type=='Medication Reminder'){
              for (let l = 0; l < job_MedName.Job_Medicines.length; l++) {
                //console.log("the length is :", l);
                for (let n = 0; n < job_MedName.Job_Medicines[l].Medicine_Name.length; n++) {
                  var lastRem
                  if (job_MedName.Job_Medicines[l].lastReminder != null) {
                    lastRem = 'sent on ' + job_MedName.Job_Medicines[l].lastReminder;
                  } else {
                    lastRem = 'Not sent yet';
                  }
                  
                  this.messageList[n] = "Reminder for " + job_MedName.Job_Medicines[l].Medicine_Name[n]
                    + " " + job_MedName.Job_Medicines[l].Job_Frequency + " " + job_MedName.Job_Medicines[l].Job_Time + ". Last reminder: " + lastRem;
                  //console.log("Meds name", job_MedName.Job_Medicines[l].Medicine_Name[n]);
                }
              }

            } // end of loop Med test
            //  }//end of if
          } // end of else if 
          /*  *****************************************************************/
          // preparing  array data  for Device Readings
          else if (this.schedJobType == 'Device_Readings') {

            let i = 0, j = 0;
            //console.log("its called", this.jobType);
            for (let job_deviceReading of this.caredOneJobs) {
              // this.jobReading='Blood Pressure';
              // prepared data for Blood Pressure
              if (job_deviceReading.Reading_Type == this.jobType) {
                // this.bloodPressure=this.jobReading;
                var lastRem
                  if (job_deviceReading.lastReminder != null) {
                    lastRem = 'sent on ' + job_deviceReading.lastReminder;
                  } else {
                    lastRem = 'Not sent yet';
                  }
                this.messageList[i] = "Check " + job_deviceReading.Reading_Type + " " + job_deviceReading.Job_Frequency + " at " +
                job_deviceReading.Job_Time + ". Last reminder: " + lastRem;;
                i++;
                //console.log("blood Pressure data:", this.bloodPressure);
              }// end of if
           
            }
          }
          // Device Readings array data is prepared
          /* ******************************************************************** */
          if (this.messageList[0]) {
            this.itemsPresent = true;
          } else {
            this.itemsPresent = false;
          }
        //}// end of loop

      }); // end of firebase service call


  }

  closeModal() {
  this.TestName = this.MedName = this.bloodPressure = this.bloodSugar = this.physicalConsultation = this.exerciseTracker = null;
  $('#reportModal').modal('hide');
  $('#reportContent').css({ position: "" });
  this.itemsPresent = false;
  this.weekly.refreshModal();

}


}
