import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response } from '@angular/http';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
import { ExistingPathWaysComponent } from './existing-path-ways/existing-path-ways.component';
import { CreatePathWaysComponent } from './create-path-ways/create-path-ways.component'
declare var $: any


@Component({
  selector: 'care-paths-cmp',
  templateUrl: 'care-pathways.component.html',
  moduleId: module.id
})

export class CarePathsComponent implements OnInit {
  [name: string]: any;

  private caredone: any;

  private carePathWays: FormGroup;
  private caredOneId: any;
  private displayDrDomain: boolean = false;
  private array: any;
  private routeparam: any;
  private checkTypes: any = [];
  private objectIdVal: any = [];
  private days: any = [];
  private partnerList: any = [];
  private partnerDataReady: boolean = false;
  private times: any = [];
  public timeInterval: any = [];
  public dateInterval: any = [];
  private MedNames: any;
  private TestNames: any;
  private findCarePaths: FormGroup;
  private carePathsAvlbl: any;
  private doctorId: any;
  private consultant: any = [];
  private consultantSelected: any = [];
  private showCarePathFlag: boolean = false;
  private createPathFlag: boolean = false;
  private pathData: any;
  //private nextButtonFlag:boolean=false;


  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private http: Http,
    private _cacheService: CacheService,
    private route: ActivatedRoute,
    private existingPath: ExistingPathWaysComponent,
    private createPath: CreatePathWaysComponent) {


  }

  ngOnInit() {
    // this.route.params.subscribe(
    //       params => {
    //       this.route.queryParams.subscribe(
    //        qParam=> {
    //          if (qParam['onboarding']=="yes") {
    //            this.nextButtonFlag=true;
    //          }
    //        }
    //       )
    //     });

    this.objectIdVal = Math.floor((Math.random() * 1000000000) + 1);


    this.carePathWays = this._fb.group({

    });

    this.findCarePaths = this._fb.group({
      carePath: []
    })

    ////console.log(this.ObserversForm);


    this._authService._getCarePathway()
      .subscribe(
      data => {
        console.log(data);
        this.carePathsAvlbl = data;
        console.log(this.carePathsAvlbl)

        this._authService._getUser()
          .subscribe(
          userData => {
            this.route.params.subscribe(
              qParams => {
                 console.log("userData test:", userData);
                 console.log(qParams)
                 
            if (userData.user.uid == "hrMzYTrzs8aL3C8Ubl9XW4gXfMd2") {
              this.doctorId = qParams['doctorId'];
             
            } else {
              
              this.doctorId = userData.user.uid;
            }
            console.log("this.doctorId",this.doctorId)

            this._authService._getPartner(this.doctorId)
              .subscribe(
              partnerData => {
                console.log("partnerData", partnerData)
                if (partnerData['consult']) {
                  let ctr = 0, partnersC = [];
                  let consultants = partnerData['consult'];
                  console.log(partnerData['consult']);
                  for (let item in consultants) {
                    if (item != 'length' && item != '$exists' && item != '$key') {
                      partnersC[ctr] = consultants[item];
                      partnersC[ctr]['key'] = item;
                      ctr++
                    }

                  }
                  this.partnerList = partnersC;
                  
                  console.log("partners data:", this.partnerList);

                }
              }
              )

              }
            )
           
          }
          )
      }
      )
    
   
  }

  //set time interval for medicine timings

  consultantSelect(value, i) {
    console.log(value, i);
    this.consultant[i] = value;
    this.consultantSelected[i] = true;

  }
  showCarePath(value) {
    var self = this;
   this.showCarePathFlag = false;
    this.createPathFlag = false;
    setTimeout(function () {
      //self.existingPath.showCarePath(value);
      self._authService._getCarePath(value.carePath)
        .subscribe(
        data => {
          
          console.log("show care path data is", data);
          if (data) {
            self.pathData = data;
            self.showCarePathFlag = true;
            self.createPathFlag = false;
            //self.existingPath.loadCarePath(data);

          }
        }
        )
    }, 2000)
  }
  createPathways() {
    var self = this;
    this.showCarePathFlag = false;
    this.createPathFlag = false;
    setTimeout(function () {
      self.createPath.createPathways();
      self.showCarePathFlag = false;
            self.createPathFlag = true;
    }, 2000)
  }
}


