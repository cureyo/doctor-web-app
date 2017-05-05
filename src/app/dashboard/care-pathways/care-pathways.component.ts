import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response } from '@angular/http';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';


declare var $: any


@Component({
  selector: 'care-paths-cmp',
  templateUrl: 'care-pathways.component.html',
  moduleId: module.id
})

export class CarePathsComponent implements OnInit {
  [name: string]: any;

  private caredone: any;
  private drDomain: FormGroup;
  private carePathwayForm: FormGroup;
  private selectDrDomain: boolean = false;
  private newPath: boolean = false;
  private caredOneId: any;
  private displayDrDomain: boolean = false;
  private array: any;
  private routeparam: any;
  private checkTypes: any = [];
  private days: any = [];
  private times: any = [];
  private findCarePaths: FormGroup;
  private carePathsAvlbl: any;


  constructor(private _fb: FormBuilder, private _authService: AuthService, private router: Router, private http: Http) {


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
      this.times[i] = i + '00 hrs';
      ////console.log("times pushed", i)
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
    this.selectDrDomain = true;

    this.findCarePaths = this._fb.group({
      carePath: ''
    });

    ////console.log(this.ObserversForm);


    this._authService._getCarePathway()
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
      day: ['', Validators.required],
      time: ['', Validators.required],
      messageText: ['', Validators.required],
      checkType: ['', Validators.required],
      options: this._fb.array([
        this.initOptions()
      ])
    });
  }
  initCheckPointsData(control1, data, check) {
    console.log(control1)
    if (data.checkType == "mcq") {
      this.checkTypes[check] = true;
    }
    return this._fb.group({
      day: [data.day, Validators.required],
      time: [data.time, Validators.required],
      messageText: [data.messageText, Validators.required],
      checkType: [data.checkType, Validators.required],
      options: this._fb.array([
        this.initOptionsData(control1, data.options, data.checkType)
      ])
    });

  }
  initOptionsData(control1, data, checkType) {
    console.log(data);
     console.log(control1);
    let control: FormArray, ctr =0;
    console.log(control);
    for (let check in data) {
      control = <FormArray>control1.controls['options'];
      console.log(control);
      console.log(data[check]);
      control.push(this.initOptionsData2(data[check].value));
      ctr++;

    }
    console.log(control);
    return control;
}
initOptionsData2(data) {
  
  return this._fb.group({
    value: [data, Validators.required]
  });
}
initializeCheckPoints(data, check) {
  let control = this._fb.group({
      day: [data.day, Validators.required],
      time: [data.time, Validators.required],
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
     if(each != '$key' && each != '$value' && each != '$exists' && each != '0') {
      control2.push(this.initializeOptions(data.options[each]));

  }}
return control;
    
}
initializeOptions(data) {
  return this._fb.group({
     value: [data.value, Validators.required]
    });

    
}
loadCarePath(data) {
  this.carePathwayForm = this._fb.group({
    name: [data[1].$value, Validators.required],
    checkPoints: this._fb.array([
      this.initializeCheckPoints(data[0][0], 0)
    ])
  });
const control = <FormArray>this.carePathwayForm.controls['checkPoints'];
let ctr = 1;
  for (let each in data[0]) {
     if(each != '$key' && each != '$value' && each != '$exists' && each != '0') {
      control.push(this.initializeCheckPoints(data[0][each], ctr));
      ctr++;
  }}
  //const control = <FormArray>this.carePathwayForm.controls['checkPoints'];
  // let ctr = 0;
  // console.log(data);
  // for (let check in data[0]) {
  //   if(check != '$key' && check != '$value' && check != '$exists') {
  //     console.log(data[0][check]);
  //   control.push(this.initCheckPointsData(control.controls[ctr], data[0][check], check));
  //   ctr ++;
  //   }
    


  // }
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
  control.push(this.initCheckPoints());

}//addReports
addOptions(check, i) {
  //console.log("options being added", i)
  //console.log(check.controls);
  const control = <FormArray>check.controls['options'];
  //   //console.log(this.carePathwayForm.controls['checkPoints'][i])
  //   const control = <FormArray>this.carePathwayForm.controls['checkPoints'];
  //  // <FormArray>this.carePathwayForm.controls['checkPoints'].controls[i].['options']
  //   //console.log(control);
  //   //console.log(control.controls);
  //   //console.log(control.controls[i]);
  //   //console.log(control.controls[i].value);
  //   //console.log(control.controls[i].value.options);
  //   var control3 = <FormArray>this.carePathwayForm.controls['checkPoints']['controls'][i].options;
  //   //console.log(control3);
  //   const control2 = <FormArray>control3['options'];
  //   //console.log(control2);
  control.push(this.initOptions());
  //console.log(control);

}//addReports

createPathways() {
  this.newPath = true;
}
selectDomainMenu() {

  this.selectDrDomain = true;
  //console.log("redirecting to ", "website")
  this.router.navigate(['website'])

}
checkTypeSelect(type, i) {
  //console.log("check type is",type, " for ", i);
  ////console.log()
  if (type == 'mcq')
    this.checkTypes[i] = true;
  else this.checkTypes[i] = false;
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
  this._authService._saveCarePathway(model, model['name']);
  this._authService._saveCarePathName(model['name']);
  this.carePathwayForm.reset();
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

}
showCarePath(model) {
  this._authService._getCarePath(model.carePath)
    .subscribe(
    data => {
      console.log(data);
      this.loadCarePath(data);

    }
    )
}
}


