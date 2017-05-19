import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response } from '@angular/http';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
// import {CreatePathWaysComponent} from './create-path-ways/create-path-ways.component';
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
  private objectIdVal: any = [];
  private days: any = [];
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


  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private http: Http,
    private _cacheService: CacheService) {
       

  }
  
  ngOnInit() {
    
    this.objectIdVal = Math.floor((Math.random() * 1000000000) + 1);
    this.findCarePaths = this._fb.group({
      carePath: ''
    });
   
     this.drDomain=this._fb.group({
       carePath:[]
     })


    ////console.log(this.ObserversForm);


    this._authService._getCarePathway()
      .subscribe(
      data => {
        //console.log(data);
        this.carePathsAvlbl = data;
        //console.log(this.carePathsAvlbl)
      }
      )
    this._authService._getUser()
      .subscribe(
      userData => {
        this.doctorId = userData.user.uid;
        this._authService._getPartner(userData.user.uid)
          .subscribe(
          partnerData => {

            if (partnerData['consultant']) {
              let ctr = 0, partnersC = [];
              let consultants = partnerData['consultant'];
              console.log(partnerData['consultant']);
              for (let item in consultants) {
                if (item != 'length' && item != '$exists' && item != '$key') {
                  partnersC[ctr] = consultants[item];
                  partnersC[ctr]['key'] = item;
                  ctr++
                }

              }
              this.partnerList = partnersC;
            }
           }
          )
        }
      )
  }
  


  initializeCheckPoints(data, check) {
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
    const control2 = <FormArray>control.controls['options'];

    this.checkTypes[check] = data.checkType;
    if (data.consultant) {
      this.consultant[check] = data.consultant;
      this.consultantSelected[check] = true;
    }

    console.log(this.checkTypes)

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
    this.objectIdVal = data.objectId;
    this.carePathwayForm = this._fb.group({
      name: [data.name, Validators.required],
      objectId: [data.objectId, Validators.required],
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
      

      console.log("showing form now")
    }, 2000)
  }
  
  


   
  showCarePath(model) {
    console.log("showing")
    console.log(model)
    this.carePathwayForm.reset();
    this.newPath = false;
    this._authService._getCarePath(model.carePath)
      .subscribe(
      data => {
        console.log(data);
        this.loadCarePath(data);

      }
      )
  }
  //set time interval for medicine timings
 
    
  consultantSelect(value, i) {
    console.log(value, i);
    this.consultant[i] = value;
    this.consultantSelected[i] = true;

  }


}


