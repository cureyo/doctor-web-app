import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response } from '@angular/http';
import { AuthService } from "../../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
declare var $: any
@Component({
  selector: 'app-existing-path-ways',
  templateUrl: './existing-path-ways.component.html',
  styleUrls: ['./existing-path-ways.component.css']
})
export class ExistingPathWaysComponent implements OnInit {
  private caredone: any;
  private existingPathWays: FormGroup;
  private carePathwayForm: FormGroup;
  private selectDrDomain: boolean = false;
  private newPath: boolean = false;
  private caredOneId: any;
  private displayDrDomain: boolean = false;
  private array: any;
  private routeparam: any;
  private checkTypes: any = [];
  private objectIdVal: any = [];
  public days: any = [];
  private partnerList: any = [];
  private times: any = [];
  public timeInterval: any = [];
  public dateInterval: any = [];
  private findCarePaths: FormGroup;
  private carePathsAvlbl: any;
  private MedNames: any;
  private TestNames: any;
  private doctorId: any;
  private consultant: any = [];
  private consultantSelected: any = [];
  private DATA:any;


  private dataloaded:boolean=false;


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

        this.existingPathWays = this._fb.group({
              name: ['', Validators.required],
              objectId: [this.objectIdVal, Validators.required],
              consultant:[],
              checkPoints: this._fb.array([
                    //  this.initializeCheckPoints(this.DATA,0)
              ])
        });

   


  }
   updateDays() {
            var i = 0;
            //console.log("day pushed")
            for (i = 0; i < 200; i++) {
            this.days[i] = i;
           
           }

            //.log("Days is:",this.days);
      }
      updateTimes() {
            var  i = 0;
            //console.log("time pushed", i)
            for ( i = 0; i < 24; i++) {
                  if (i < 10) {
                  this.times[i] = '0' + i + '00 hrs';
                  }
                  else {
                  this.times[i] = i + '00 hrs';
                  }

            }
             //.log("times pushed", this.times)
      }

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
     ////.log("date interval",this.dateInterval);


  }//setTimeInterval


  loadCarePath(data) {
          //console.log.log("loadCarePath called:",data);
          this.objectIdVal = data.objectId;
          this.existingPathWays = this._fb.group({
            name: [data.name, Validators.required],
            objectId: [data.objectId, Validators.required],
            checkPoints: this._fb.array([
              this.initializeCheckPoints(data.checkPoints[0], 0)
            ])
          });
        const control = <FormArray>this.existingPathWays.controls['checkPoints'];
        let ctr = 1;
        for (let each in data.checkPoints) {
          if (each != '$key' && each != '$value' && each != '$exists' && each != '0') {
            control.push(this.initializeCheckPoints(data.checkPoints[each], ctr));
            ctr++;
          }
        }

    //console.log.log(this.existingPathWays);
    var self = this;
    setTimeout(function () {
      //console.log.log("showing form now")
    }, 2000)
  }
  
   initCheckPoints() {
    return this._fb.group({
      day: ['', Validators.required],
      time: ['', Validators.required],
      messageText: ['', Validators.required],
      checkType: ['', Validators.required],
      consultant: [],
      options: this._fb.array([
        this.initializeOptions(this.DATA)
      ])
    });
  }

 addCheckPoints() {
    const control = <FormArray>this.existingPathWays.controls['checkPoints'];
    control.push(this.initCheckPoints());

  }
  

  showCarePath(model) {
    //console.log.log("showing model",model) 
   // this.newPath = false;
    this._authService._getCarePath(model.carePath)
      .subscribe(
      data => {
        this.DATA=data;
        //console.log.log("shoe care path data is",data);
        if (data){
                this.dataloaded=true;    
                this.loadCarePath(data);
        }
      }
      )
  }


   initializeOptions(data) {
     //console.log.log("initializeOptions click wid data",data);
    return this._fb.group({
      value: [data.value, Validators.required]
    });
  }


   initializeCheckPoints(data, check) {
     //console.log.log("intitializecheckPoints",data,check);
      let control = this._fb.group({
      day: [data.day, Validators.required],
      time: [data.time, Validators.required],
      messageText: [data.messageText, Validators.required],
      checkType: [data.checkType, Validators.required],
      consultant: [data.consultant],
      options: this._fb.array([
        this.initializeOptions(data.options[0])
      ])
    });
      //console.log.log("find out the control value:",control);
    const control2 = <FormArray>control.controls['options'];

    this.checkTypes[check] = data.checkType;
    if (data.consultant) {
      this.consultant[check] = data.consultant;
      this.consultantSelected[check] = true;
    }

    //console.log.log("this.checkTypes",this.checkTypes)

    //console.log.log("data.options",data.options);
    for (let each in data.options) {
      if (each != '$key' && each != '$value' && each != '$exists' && each != '0') {
        control2.push(this.initializeOptions(data.options[each]));

      }
    }
    //console.log.log("control 2 data:",control2);
    return control;

  }


     checkTypeSelect(type, i) {
       console.log("checktype is called:",type,i)
    if (type == "med-reminder") {
      // this.setIntervals();
      this._authService._getMedicineNames()
        .subscribe(data => {
          ////console.log.log("patholodical test details data :",data);
          this.MedNames = data;
          this._cacheService.set('medNames', { 'data': this.MedNames }, { expires: Date.now() + 1000 * 60 * 60 });

          this.checkTypes[i] = type;

          //console.log("the med names is :",this.MedNames);
        })
    } else if (type == "test-reminder") {
      // this.setIntervals();
      this._authService._getPathologicalTests()
        .subscribe(data => {
          //console.log("patholodical test details data :",data);
          this.TestNames = data;

          this._cacheService.set('testNames', { 'data': this.TestNames }, { expires: Date.now() + 1000 * 60 * 60 });
          this.checkTypes[i] = type;
          //console.log("the med names is :",this.TestNames);
        })
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


}
