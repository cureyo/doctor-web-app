import { Component, OnInit, Query, QueryList, Input,ViewChildren, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../services/firebaseauth.service";
import { FbService } from "../../../../services/facebook.service";
import { slotBookingClass } from "../../../../models/slotBooking.interface";
import { ImageSearchComponent } from '../../../../fb-ads-form/image-search/image-search.component';

@Component({
  selector: 'app-specializationsTile',
  templateUrl: './specializationsTile.component.html',
  //styleUrls: ['./slot-booking.component.css']
})
export class SpecializationsTileComponent implements OnInit {
  @ViewChildren(ImageSearchComponent) imgSearchCmp2: QueryList<ImageSearchComponent>;
  @Input() routeparam: any;
  public timeInterval: any;
  public timeValue: any;
  public dateInterval: any;
  private specializationForm: FormGroup;
  private slotAdded: boolean = false;
  private sitename: any;
  private imagesArray: any = [];
  private specCount: number = 0;
  private formReady: boolean = false;
  private imgSearchType: any = "google";
  private defaultImgSearch: any;
  private pageNameList: any = [];
  constructor(
   // @Query(ImageSearchComponent) imgSearchCmp2:QueryList<ImageSearchComponent>,
    private _fb: FormBuilder,
    private _fs: FbService,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router,
    
  ) {
    this.timeValue = [];
    this.timeInterval = [];
    this.dateInterval = [];
    // this.setIntervals();
  }

  ngOnInit() {
    this.specCount = 0;
    var n = this.routeparam.indexOf(".")
    if (n == -1) {
      n = this.routeparam.length;
    }
    this.sitename = this.routeparam.substring(0, n);
    //console.log("interface class test");
    this._authService._getWebsiteSpeciaizations(this.sitename)
      .subscribe(
      webSpecData => {
        console.log(webSpecData)
        console.log(webSpecData[0])
        if (webSpecData[0]) {
          this.specializationForm = this._fb.group({

            specializations: this._fb.array([
              this.initSpecs(webSpecData[0])

            ])
          });

          let control = <FormArray>this.specializationForm.controls['specializations'];
          for (let each in webSpecData) {
            console.log(each);
            console.log(webSpecData[each])
            if (each != '$key' && each != '$value' && each != '$exists' && each != '0')
              control.push(this.initSpecs(webSpecData[each]));
            this.specCount = this.specCount + 1;
            console.log(this.specCount);
          }
          this.formReady = true;

        }
        else {
          this.specializationForm = this._fb.group({

            specializations: this._fb.array([
              this.initSlots()

            ])
          });
          this.formReady = true;
        }
      }
      )



  }
  addSlot() {
    //console.log("its called addslot");
    const control = <FormArray>this.specializationForm.controls['specializations'];

    control.push(this.initSlots());

  }//addSlot
  initSpecs(data) {
    console.log(data);
    return this._fb.group({
      title: [data.title, Validators.required],
      brief: [data.brief, Validators.required],
      description: [data.description, Validators.required],
      webTitle: [data.webTitle, Validators.required],
    });
  }
  initSlots() {
    //console.log("init called");
    return this._fb.group({
      title: ['', Validators.required],
      brief: ['', Validators.required],
      description: ['', Validators.required],
      webTitle: [''],
    });
  }//iniSlots

  save_specializationForm = (model) => {

    let job = model['value'];
    let specials = job['specializations'],
      ctr = 0,
      flag;
      console.log(this.imgSearchCmp2['imgSelected'])
      // for (let each in this.imgSearchCmp2)
      //      {
      //        console.log(each);
      //        console.log(this.imgSearchCmp2[each])
      //     //specials[each]['img_url'] = this.imgSearchCmp2[each].imgSelected;
      //   }
      
    //console.log("this.imgSearchCmp2", this.imgSearchCmp2['_results']);
    //console.log(this.imgSearchCmp2.toArray())
    for (let each in specials) {
      let webTitle = specials[each].title.replace(' ', '-');
      webTitle = webTitle.replace(':', '-');
      webTitle = webTitle.replace('.', '-');
      webTitle = webTitle.replace(':', '-');
      webTitle = webTitle.replace('!', '-');
      webTitle = webTitle.replace('?', '-');;
      console.log("splCmp" + each);
      
      let yrt =  this.imgSearchCmp2.find(item => item.randId == "splCmp" + each);
    
      console.log(yrt);
      //specials[each]['img_url'] ['imgSelected'];
      // console.log(each, specials[each]['img_url'])
      specials[each]['webTitle'] = webTitle;
      console.log(each);
      console.log(("splCmp" + each));
      var tes ="splCmp" + each;
      console.log(tes);
      var e = document.getElementById(tes)
      console.log(e)
      //specials[each]['img_url'] = this.imgSearchCmp2[each].imgSelected;
    }
    let count = 0;
    this.imgSearchCmp2.forEach(item => {specials[count]['image'] = item.imgSelected;
    count++; })
    // console.log(this.imgSearchCmp2.toArray())
    // this.imgSearchCmp2.forEach((child) => { console.log(child);
    //   })
    console.log(specials);
    console.log(this.sitename);
    this._authService._saveSpecializationDetails(this.sitename, specials)
      .then(
      data => {
        this.slotAdded = true;
        //console.log("slot booking data saved:");
        let count = specials.length;
        console.log("count:", count, "this.specCount:", this.specCount)
        if (count > this.specCount) {
          for (let i = this.specCount; i < count; i++) {
            let hlData = { "_title": specials[i].title, "_meta-desc": specials[i].brief, "full-summary": specials[i].description };
            let id = "New" + Math.floor((Math.random() * 100000) + 1);
            this._authService._saveHealthLineData(id, hlData)
              .then(
              data => {
                this._authService._getUser()
                  .subscribe(
                  udata => {
                    this._authService._fetchUser(udata.user.uid)
                      .subscribe(
                      userData => {
                        console.log(hlData);
                        //console.log(userData.specializations[item]);
                        //let dataWeb = { title: hlData['_title'], brief: hlData['_meta-desc'], description: hlData['full-summary'] };
                        //let dataDetails = { givenName: userData.specializations[item].details.name, id: userData.specializations[item].details.id, meta: hlData['_meta-desc'], summary: hlData['full-summary'] };
                        let pageIDtemp, adIDtemp;
                        console.log(userData);
                        if (userData.fbPageAdded)
                          pageIDtemp = userData.fbPageId;
                        else
                          pageIDtemp = '';
                        if (userData.adAccounts)
                          adIDtemp = userData.adAccounts[0]
                        else
                          adIDtemp = 'NA';

                        let adData = {
                          "BID": 10,
                          "adAccount": adIDtemp,
                          "budget": 100,
                          "callToAction": 1,
                          "caption": "Visit " + userData.clinic + " for " + hlData['_title'],
                          "enddate": "NA",
                          "imageURL": "NA",
                          "max_age": 65,
                          "min_age": 18,
                          "msg": hlData['_meta-desc'],
                          "name": hlData['_title'],
                          "pageID": userData.fbPageId,
                          "siteLink": "https://" + userData.clinicId + ".cureyo.com",
                          "startdate": "NA",
                          "subtext": userData.fullName + " is an expert " + userData.speciality,
                          "targetCity": userData.clinicLocation,
                          "targetCitySearch": userData.clinicLocation,
                          "targetCountry": "IN",
                          "targetingSpecSearch": "NA",
                          "targetingSpecs": "NA",
                          "imgSearch": hlData['_title'],
                          "showForm": [],
                          "refname": hlData['_title'] + "[AD]",
                        };

                        this._authService._saveFbAdsFormData(userData.authUID, hlData['_title'], adData).then(
                          data => {
                            console.log(data);
                            this._authService._saveWebsiteSpeciaizations(this.sitename, specials, i)
                              .then(
                              data2 => { console.log(data2) });
                          }
                        );
                      }
                      )
                  }
                  )


              }
              )
          }

        }
      }
      );
    //end of db part code





  }//save

}
