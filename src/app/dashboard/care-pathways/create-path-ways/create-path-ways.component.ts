import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response } from '@angular/http';
import { AuthService } from "../../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
declare var $: any
@Component({
  selector: 'app-create-path-ways',
  templateUrl: './create-path-ways.component.html',
  styleUrls: ['./create-path-ways.component.css']
})
export class CreatePathWaysComponent implements OnInit {
  @Input() partnerList:any;
  @Input() doctorId:any;
  @Input() TestNames: any;
  @Input() MedNames: any;
  private caredone: any;
  private BloodSugar: any = "BloodSugar";
  private BloodPressure: any = "BloodPressure";
  private online: any = "Online";
  private physical: any = "Physical";
  private pathological: any = "Pathological";
  private radiological: any = "Radiological";
  private drDomain: FormGroup;
  private carePathwayForm: FormGroup;
  private selectDrDomain: boolean = false;
  private newPath:boolean=false;
  private caredOneId: any;
  private displayDrDomain: boolean = false;
  private array: any;
  private routeparam: any;
  private checkTypes: any = [];
  private objectIdVal: any = [];
  public days: any = [];
  //private partnerList: any = [];
  private times: any = [];
  public timeInterval: any = [];
  public dateInterval: any = [];
  private findCarePaths: FormGroup;
  private carePathsAvlbl: any;
  // private MedNames: any;
  // private TestNames: any;
  
  private consultant: any = [];
  private consultantSelected: any = [];


  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private http: Http,
    private _cacheService: CacheService) {
       

  }

  ngOnInit() {
        this.setIntervals();
        this.updateDays();
        this.updateTimes();
        

        this.objectIdVal = Math.floor((Math.random() * 1000000000) + 1);

        this.carePathwayForm = this._fb.group({
              name: ['', Validators.required],
              description: ['', Validators.required],
              duration: ['', Validators.required],
              objectId: [this.objectIdVal, Validators.required],
              checkPoints: this._fb.array([
              this.initCheckPoints()
              ]),
              queries: this._fb.array([
              this.initQueries()
              ]),
        });
  } //ng OninIt
   
      updateDays() {
         //   this.days[0] = "Repeat";
            var i = 1;
            //console.log("day pushed")
            for (let i = 1; i < 200; i++) {
            this.days[i] = i;
            // console.log("days pushed", i)
      }
      }
      updateTimes() {
       this.times[0] = "Repeat";
           
            let i = 0;
            //console.log("time pushed", i)
            for (let i = 0; i < 24; i++) {
                  if (i < 10) {
                  this.times[i + 1] = '0' + i + '00 hrs';
                  ////console.log("times pushed", i)
                  }
                  else {
                  this.times[i + 1] = i + '00 hrs';
                  }

            }
      }
    
    initOptions() {
    return this._fb.group({
      value: ['Option', Validators.required]
    });
  }


   initCheckPoints() {
    return this._fb.group({
      day: ['', Validators.required],
      time: ['', Validators.required],
      messageText: ['', Validators.required],
      checkType: ['', Validators.required],
      consultant: [],
      options: this._fb.array([
        this.initOptions()
      ])
    });
  }
       initQueries() {
    return this._fb.group({
      query: ['', Validators.required],
      response: ['', Validators.required]
      
    });
  }
    
     addCheckPoints() {
    const control = <FormArray>this.carePathwayForm.controls['checkPoints'];
    control.push(this.initCheckPoints());

    }
    addQueries() {
      const control = <FormArray>this.carePathwayForm.controls['queries'];
    control.push(this.initQueries());

    }
     

    addOptions(check, i) {

    const control = <FormArray>check.controls['options'];

    control.push(this.initOptions());
    //console.log(control);

  }
 

  
   checkTypeSelect(type, i) {
     //console.log("checkTypeSelect called");

    if (type == "med-reminder") {
      // this._cacheService.set('medNames', { 'data': this.MedNames }, { expires: Date.now() + 1000 * 60 * 60 });
          this.checkTypes[i] = type;
      // this.setIntervals();
      
    } else if (type == "test-reminder") {
          // this._cacheService.set('testNames', { 'data': this.TestNames }, { expires: Date.now() + 1000 * 60 * 60 });
          this.checkTypes[i] = type;
      // this.setIntervals();
      
    } else if (type == "consult-reminder") {
      this.checkTypes[i] = type;
      // this.setIntervals();

    }
    else {

      this.checkTypes[i] = type;
    }

    // if (type == 'mcq')
    //   this.checkTypes[i] = true;
    // else this.checkTypes[i] = false;
  }






  
  //set time interval for medicine timings
  setIntervals = () => {
    let hrs, md;

    for (let i = 5; i < 24; i++) {
      if (i == 12) {
        hrs = i;
      } else {
        hrs = i % 12;
      }
      if (hrs < 10) {
        hrs = "0" + hrs;
      }

      md = (i >= 12) ? ' PM' : ' AM';
      this.timeInterval.push(hrs + ":00" + md);
      this.timeInterval.push(hrs + ":30" + md);
    }

    for (let i = 1; i <= 31; i++) {
      this.dateInterval.push(i);
    }
     //console.log("date interval",this.dateInterval);


  }//setTimeInterval
  createPathways() {
    
        this.newPath=true;
        // this.carePathwayForm.reset();
        this.objectIdVal = Math.floor((Math.random() * 1000000000) + 1);
        this.carePathwayForm = this._fb.group({
          name: ['', Validators.required],
          description: ['', Validators.required],
          duration: ['', Validators.required],
          objectId: [this.objectIdVal, Validators.required],
          checkPoints: this._fb.array([
            this.initCheckPoints()
          ]),
          queries: this._fb.array([
              this.initQueries()
              ])
        });
    this.selectDrDomain = true;
    


  }
   onSubmit(model) {
            console.log(model);
            this._authService._getCarePathNames(model['name'])
            .subscribe(
                      data => {
                            //console.log(data);
                            if (data[0]) {
                                 alert("This Care Path already exisits. Please save using another name");
                             }
                            else {
                                  this._authService._saveCarePathway(model, model['name'])
                                  .then(data => {
                                        //console.log(data.path['o'][2]);
                                        this._authService._saveCarePathName(model['name'], data.path['o'][2]);
                                              this.carePathwayForm.reset();
                                              this.carePathwayForm = this._fb.group({
                                                    name: ['', Validators.required],
                                                    description: ['', Validators.required],
                                                    duration: ['', Validators.required],
                                                    checkPoints: this._fb.array([
                                                    this.initCheckPoints()
                                                    ])
                                              });
                                              $.notify({
                                                  icon: "notifications",
                                                  message: "Care Plan " + model['name'] + " has been saved."

                                              }, {
                                                  type: 'cureyo',
                                                  timer: 4000,
                                                  placement: {
                                                  from: 'top',
                                                  align: 'right'
                                              }
                                        });

                                  });
                            }

                      }
            )

  }
    
  consultantSelect(value, i) {
    console.log(value, i);
    this.consultant[i] = value;
    this.consultantSelected[i] = true;

  }


   
}
