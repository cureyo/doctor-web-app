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


  constructor(private _fb: FormBuilder, private _authService: AuthService, private router: Router, private http: Http) {

   
  }
updateDays() {
   let i =0;
    console.log("day pushed")
    for (let i = 0; i < 200; i ++ ) {
      this.days[i] = i;
      //console.log("days pushed", i)
    }
}
updateTimes() {
   let i =0;
    console.log("time pushed", i)
    for (let i = 0; i < 24; i ++ ) {
      this.times[i] = i + '00 hrs';
      //console.log("times pushed", i)
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
    console.log("options being added", i)
    console.log(check.controls);
    const control = <FormArray>check.controls['options']
  //   console.log(this.carePathwayForm.controls['checkPoints'][i])
  //   const control = <FormArray>this.carePathwayForm.controls['checkPoints'];
  //  // <FormArray>this.carePathwayForm.controls['checkPoints'].controls[i].['options']
  //   console.log(control);
  //   console.log(control.controls);
  //   console.log(control.controls[i]);
  //   console.log(control.controls[i].value);
  //   console.log(control.controls[i].value.options);
  //   var control3 = <FormArray>this.carePathwayForm.controls['checkPoints']['controls'][i].options;
  //   console.log(control3);
  //   const control2 = <FormArray>control3['options'];
  //   console.log(control2);
    control.push(this.initOptions());
    console.log(control);

  }//addReports

  createPathways() {
    this.newPath = true;
  }
  selectDomainMenu() {

    this.selectDrDomain = true;
    console.log("redirecting to ", "website")
    this.router.navigate(['website'])

  }
checkTypeSelect(type, i) {
  console.log("check type is",type, " for ", i);
  //console.log()
  if (type == 'mcq')
  this.checkTypes[i] = true;
  else this.checkTypes[i] = false;
}
  searchDomain = (model) => {
    let job = model['value'];
    let reminder = {};
    this.routeparam = job['message'];
    reminder['message value'] = job['message'];
    console.log("reminder value test ", reminder);
    console.log("i am clicked to check domain name")

    this.getData(job['message']).subscribe(data => {
      console.log(data);
      this.array = data;
      console.log(this.array)
      this.displayDrDomain = true;

    });



  }
  getData(domainName) {

    const domainURL = "https://api.ote-godaddy.com/v1/domains/suggest?query=" + domainName + "&country=IN&city=bangalore&sources=CC_TLD%2CEXTENSION%2CKEYWORD_SPIN%2CPREMIUM%2Ccctld%2Cextension%2Ckeywordspin%2Cpremium&tlds=.com&lengthMax=15&lengthMin=5&limit=10&waitMs=6000";

    return this.http.get(domainURL)
      .map((res: Response) => res.json());

  }

  onSubmit (model) {
    this._authService._saveCarePathway(model, model['name']);
    this.carePathwayForm.reset();
  }

}


