import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response } from '@angular/http';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';


declare var $: any


@Component({
  selector: 'patient-hx-form',
  templateUrl: 'Hx-Forms.component.html',
  moduleId: module.id
})

export class PatientHxFormComponent implements OnInit {
  [name: string]: any;

  private caredone: any;
  private section: any = "care";
  private drDomain: FormGroup;
  private carePathwayForm: FormGroup;
  private selectDrDomain: boolean = false;
  private newPath: boolean = false;
  private caredOneId: any;
  private displayDrDomain: boolean = false;
  private array: any;
  private routeparam: any;
  private checkTypes: any = [];
  private standardOps: any = [];
  private days: any = [];
  private times: any = [];
  private askIfs: any = [];
  private findCarePaths: FormGroup;
  private carePathsAvlbl: any;


  constructor(private _fb: FormBuilder, private _authService: AuthService, private router: Router, private http: Http) {


  }
   updateAskIfs(control) {
    let ctr = 0, asks = 0;
    for (let item of control) {
      ctr++
      console.log(control[item]);
      console.log(item);
      console.log(item.controls['checkType']);
      console.log(item.controls['messageText'])
      if (item.controls['checkType'].value == 'yes-no') {
        this.askIfs[asks] = {ques: item.controls['messageText']._value, quesNo: ctr}
        asks++;
      }
    }
  }
  updateDays() {
    let i = 0;
    //console.log("day pushed")
    for (let i = 0; i < 200; i++) {
      this.days[i] = i;
      ////console.log("days pushed", i)
    }
  }
  updateTimes() {
    let i = 0;
    //console.log("time pushed", i)
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        this.times[i] = '0' + i + '00 hrs';
        ////console.log("times pushed", i)
      }
      else {
        this.times[i] = i + '00 hrs';
      }

    }
  }
  ngOnInit() {
    this.updateDays();
    this.updateTimes();
    this.drDomain = this._fb.group({
      message: [''],
    });
    this.selectDrDomain = true;
    this.carePathwayForm = this._fb.group({
      name: ['', Validators.required],
      checkPoints: this._fb.array([
        this.initCheckPoints()
      ])
    });

    this.findCarePaths = this._fb.group({
      carePath: ''
    });

    ////console.log(this.ObserversForm);


    this._authService._getHxPathway()
      .subscribe(
      data => {
        //console.log(data);
        this.carePathsAvlbl = data;
        //console.log(this.carePathsAvlbl)
      }
      )
  }
  initCheckPoints() {
    return this._fb.group({
      // day: ['', Validators.required],
      // time: ['', Validators.required],
      askIf: ['Always', Validators.required],
      standard: ['', Validators.required],
      messageText: ['', Validators.required],
      checkType: ['', Validators.required],
      options: this._fb.array([
        this.initOptions()
      ])
    });
  }


  initializeCheckPoints(data, check) {
    let control = this._fb.group({
      // day: [data.day, Validators.required],
      // time: [data.time, Validators.required],
      askIf: [data.askIf, Validators.required],
       standard: [data.standard, Validators.required],
      messageText: [data.messageText, Validators.required],
      checkType: [data.checkType, Validators.required],
      options: this._fb.array([
        this.initializeOptions(data.options[0])
      ])
    });
    const control2 = <FormArray>control.controls['options'];
    if (data.checkType == "mcq") {
      this.checkTypes[check] = true;
      console.log(this.checkTypes)
    }
    console.log(data.options);
    for (let each in data.options) {
      if (each != '$key' && each != '$value' && each != '$exists' && each != '0') {
        control2.push(this.initializeOptions(data.options[each]));

      }
    }
    return control;

  }
  initializeOptions(data) {
    return this._fb.group({
      value: [data.value, Validators.required]
    });


  }
  loadCarePath(data) {
    console.log(data);
    this.carePathwayForm = this._fb.group({
      name: [data.name, Validators.required],
      checkPoints: this._fb.array([
        this.initializeCheckPoints(data.checkPoints[0], 0)
      ])
    });
    const control = <FormArray>this.carePathwayForm.controls['checkPoints'];
    let ctr = 1;
    for (let each in data.checkPoints) {
      if (each != '$key' && each != '$value' && each != '$exists' && each != '0') {
        control.push(this.initializeCheckPoints(data.checkPoints[each], ctr));
        ctr++;
      }
    }

    console.log(this.carePathwayForm);
    var self = this;
    setTimeout(function () {
      self.newPath = true;
      console.log("showing form now")
    }, 2000)
  }
  initOptions() {
    return this._fb.group({
      value: ['Option', Validators.required]
    });
  }
  addCheckPoints() {
    const control = <FormArray>this.carePathwayForm.controls['checkPoints'];
    console.log(control.controls);
    this.updateAskIfs(control.controls);
    control.push(this.initCheckPoints());

  }//addReports
  addOptions(check, i) {

    const control = <FormArray>check.controls['options'];

    control.push(this.initOptions());
    //console.log(control);
    this.updateStandard(check, 'mcq', i)
  }//addReports

  createPathways() {
    this.carePathwayForm.reset();
    this.newPath = false;
    this.carePathwayForm = this._fb.group({
      name: ['', Validators.required],
      checkPoints: this._fb.array([
        this.initCheckPoints()
      ])
    });
    this.selectDrDomain = true;
    setTimeout(
      () => {
        this.newPath = true;
      }, 2000
    )


  }
  selectDomainMenu() {

    this.selectDrDomain = true;
    //console.log("redirecting to ", "website")
    this.router.navigate(['website'])

  }
  updateStandard(check, type, i) {
      console.log(check);
    if (type == 'mcq') {
    
      let ctr =0, arr = [];
      console.log(check.controls['options'].controls);
      for (let item of check.controls['options'].controls) {
        arr[ctr] = item.controls.value.value;
        ctr++;
      }
      this.standardOps[i] = arr;
    }
      
    else if (type == 'yes-no') {
       this.standardOps[i] = ["Yes", "No"];
    
  } else if (type == 'value') {
       this.standardOps[i] = ["NA"]
   
  } 
  console.log(this.standardOps)
  }
  checkTypeSelect(check, type, i) {
    //console.log("check type is",type, " for ", i);
    ////console.log()
    this.updateStandard(check, type, i)
   console.log(check);
    if (type == 'mcq') {
      this.checkTypes[i] = true; 
      
    }
      
  else {
    this.checkTypes[i] = false;
  }
  console.log(this.standardOps)
  }
  searchDomain = (model) => {
    let job = model['value'];
    let reminder = {};
    this.routeparam = job['message'];
    reminder['message value'] = job['message'];
    //console.log("reminder value test ", reminder);
    //console.log("i am clicked to check domain name")

    this.getData(job['message']).subscribe(data => {
      //console.log(data);
      this.array = data;
      //console.log(this.array)
      this.displayDrDomain = true;

    });



  }
  getData(domainName) {

    const domainURL = "https://api.ote-godaddy.com/v1/domains/suggest?query=" + domainName + "&country=IN&city=bangalore&sources=CC_TLD%2CEXTENSION%2CKEYWORD_SPIN%2CPREMIUM%2Ccctld%2Cextension%2Ckeywordspin%2Cpremium&tlds=.com&lengthMax=15&lengthMin=5&limit=10&waitMs=6000";

    return this.http.get(domainURL)
      .map((res: Response) => res.json());

  }

  onSubmit(model) {
    let test = this._authService._getHxPathNames(model['name']);
    console.log(test);
    this._authService._getHxPathNames(model['name'])
      .subscribe(
      data => {
        console.log(data);
        if (data[0]) {
          alert("This Patient History Form Name exists. Please save using another name");
        } else {
          this._authService._saveHxPathway(model, model['name'])
            .then(data => {
              console.log(data.path['o'][2]);
              this._authService._saveHxPathName(model['name'], data.path['o'][2]);
              this.carePathwayForm.reset();
              this.carePathwayForm = this._fb.group({
                name: ['', Validators.required],
                checkPoints: this._fb.array([
                  this.initCheckPoints()
                ])
              });
              this.newPath = false;
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
  showCarePath(model) {
    console.log("showing")
    console.log(model)
    this.carePathwayForm.reset();
    this.newPath = false;
    this._authService._getHxPath(model.carePath)
      .subscribe(
      data => {
        console.log(data);
        this.loadCarePath(data);

      }
      )
  }
}


