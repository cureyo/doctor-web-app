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


  constructor(private _fb: FormBuilder, private _authService: AuthService, private router: Router, private http: Http) {


  }

  ngOnInit() {


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
      value: ['', Validators.required]
    });
  }
  addCheckPoints() {
    const control = <FormArray>this.carePathwayForm.controls['checkPoints'];
    control.push(this.initCheckPoints());

  }//addReports
  addOptions() {
    const control = <FormArray>this.carePathwayForm.controls['checkPoints']['options'];
    control.push(this.initOptions());

  }//addReports

  createPathways() {
    this.newPath = true;
  }
  selectDomainMenu() {

    this.selectDrDomain = true;
    console.log("redirecting to ", "website")
    this.router.navigate(['website'])

  }
checkTypeSelect(i) {
  this.checkTypes[i] = true;
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

}


