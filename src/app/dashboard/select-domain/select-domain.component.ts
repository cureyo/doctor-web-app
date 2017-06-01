import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response, Headers } from '@angular/http';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';


declare var $: any


@Component({
  selector: 'select-domain-form',
  templateUrl: 'select-domain.component.html',
  moduleId: module.id
})

export class SelectDomainComponent implements OnInit {
  [name: string]: any;

  private caredone: any;
  private drDomain: FormGroup;
  private selectDrDomain: boolean = false;
  private caredOneId: any;
  private displayDrDomain: boolean = false;
  private array: any;
  private routeparam: any;
  private availableName: any;
  private domainAvailable: boolean = false;
  private sitename: any;

  private section: any = "website";

  constructor(private _fb: FormBuilder, private _authService: AuthService, private router: Router, private activatedRouter: ActivatedRoute, private http: Http) {


  }

  ngOnInit() {


    this.drDomain = this._fb.group({
      message: [''],


    });
    this.selectDrDomain = true;
  }
  selectDomainMenu() {

    this.selectDrDomain = true;
    //console.log("redirecting to ", "website")
    this.router.navigate(['website'])

  }

  searchDomain = (model) => {
    let job = model['value'];
    let reminder = {};
    this.routeparam = job['message'];
    reminder['message value'] = job['message'];
    //console.log("reminder value test ", reminder);
    //console.log("i am clicked to check domain name")

    this.getAvailability(job['message']).subscribe(dataa => {
      //console.log(dataa);
      this.availableName = dataa;
      if (this.availableName.domain)
        this.domainAvailable = true;

      this.getData(job['message']).subscribe(data => {
        //console.log(data);
        this.array = data;
        //console.log(this.array)
        this.displayDrDomain = true;

      });
    })
    // this.route2WebDetails(job['message'])
  }
  getData(domainName) {

    const domainURL = "https://api.ote-godaddy.com/v1/domains/suggest?query=" + domainName + "&country=IN&city=bangalore&sources=CC_TLD%2CEXTENSION%2CKEYWORD_SPIN%2CPREMIUM%2Ccctld%2Cextension%2Ckeywordspin%2Cpremium&tlds=.com&lengthMax=15&lengthMin=5&limit=10&waitMs=6000";

    return this.http.get(domainURL)
      .map((res: Response) => res.json());

  }

  getAvailability(domainName) {

    const availableURL = "https://api.ote-godaddy.com/v1/domains/available?domain=" + domainName + "&checkType=FAST&forTransfer=false"
    return this.http.get(availableURL)
      .map((res: Response) => res.json());
  }

  route2WebDetails(domainName) {
    this._authService._getUser()
      .subscribe(
      data => {
        var len = domainName.indexOf('.');

        var domainNameShort = domainName.substring(0, len);
        this.sitename = domainNameShort;
        this._authService._saveWebsite(domainName, data.user.uid);
        this._authService._saveClinicId(domainNameShort,data.user.uid )
        this._authService._getSitePrefilledData()
          .subscribe(data => {


            this._authService._getUser()
              .subscribe(
              res => {
                this._authService._fetchUser(res.user.uid)
                  .subscribe(
                  userData => {
                    console.log(userData);
                    var data1 = JSON.stringify(data);
                    console.log(data1)

                    var websiteData = data1.replace(/#DrfullName/g, userData.fullName);
                    websiteData = websiteData.replace(/#DrQualification/g, userData.qualification);
                    websiteData = websiteData.replace(/#DrSpeciality/g, userData.speciality);
                    websiteData = websiteData.replace(/#DrExperience/g, userData.experience);
                    websiteData = websiteData.replace(/#DrClinicLocation/g, userData.clinicLocation);
                    websiteData = websiteData.replace(/#DrImage/g, userData.avatar);
                    websiteData = websiteData.replace(/#DrID/g, res.user.uid);
                    websiteData = websiteData.replace(/#DrPhone/g, userData.phone);
                    websiteData = websiteData.replace(/#DrEmail/g, userData.email);
                    websiteData = websiteData.replace(/#DrClnicId/g, domainNameShort);
                    websiteData = websiteData.replace(/#DrClinic/g, userData.clinic);
                    websiteData = websiteData.replace(/#DrFee/g, userData.fee);
                    websiteData = websiteData.replace(/#DrPageId/g, userData.fbPageId);
                    var websiteData2 = JSON.parse(websiteData);
                    var websiteData3 = { availability: { SLots: [''] }, content: websiteData2.content, docDetails: websiteData2.docDetails, doctorId: websiteData2.doctorId, fbPageId: userData.fbPageId, metaData: websiteData2.metaData }
                    //var websiteData = {doctorId: res.user.uid , bookingTile: data.bookingTile, footer: data.footer, heroTile: data.heroTile, map: data.map, profileTile: data.profileTile};

                    console.log(websiteData3);
                    this._authService._saveDummyData(websiteData3, domainNameShort);
                    this.addDomain(domainNameShort);
                    if (userData.specializations) {
                      let ctr = [], count = 0;
                      for (let item in userData.specializations) {
                        console.log(item);
                        ctr[item] = count;
                        count++;
                        this._authService._getHealthLineData(userData.specializations[item].details.id)
                          .subscribe(
                          hlData => {
                            console.log(hlData);
                            console.log(userData.specializations[item]);
                            let webTitle = hlData['_title'].replace(' ', '-');
                            webTitle = webTitle.replace(':', '-');
                            webTitle = webTitle.replace('.', '-');
                            webTitle = webTitle.replace(':', '-');
                            webTitle = webTitle.replace('!', '-');
                            webTitle = webTitle.replace('?', '-');
                            let dataWeb = { title: hlData['_title'], brief: hlData['_meta-desc'], description: hlData['full-summary'], webTitle: webTitle };
                            let dataDetails = { givenName: userData.specializations[item].details.name, id: userData.specializations[item].details.id, meta: hlData['_meta-desc'], summary: hlData['full-summary'] };
                            let pageIDtemp, adIDtemp;
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
                              "siteLink": "http://" + domainNameShort + ".cureyo.com",
                              "startdate": "NA",
                              "subtext": userData.fullName + " is an expert " + userData.speciality,
                              "targetCity": "NA",
                              "targetCitySearch": userData.clinicLocation,
                              "targetCountry": "IN",
                              "targetingSpecSearch": "NA",
                              "targetingSpecs": "NA",
                              "imgSearch": hlData['_title'],
                              "showForm": [],
                              "refname": hlData['_title'] + "[AD]",
                            };
                            this._authService._saveWebsiteSpeciaizations(domainNameShort, dataWeb, ctr[item])
                              .then(
                              data2 => {
                                console.log(dataDetails)
                                this._authService._saveSpecializationsData(domainNameShort, dataDetails)
                                  .then(
                                  data4 => {

                                    this._authService._saveFbAdsFormData(userData.authUID, hlData['_title'], adData).then(
                                      data => console.log(data)
                                    );
                                  }
                                  )

                              }
                              );

                          }
                          )
                      }
                    }
                    this.activatedRouter.queryParams
                      .subscribe(
                      params => {
                        if (params['onboarding'] == "yes") {
                          this.router.navigate(['/web/' + domainName], { queryParams: { onboarding: "yes" } });
                        } else {
                          this.router.navigate(['/web/' + domainName]);
                        }
                      }
                      )

                  }
                  )

              });

          })

      });


  }

  addDomain(domainName) {


    this.putDomain(domainName).subscribe(data => {
      //console.log(data);
      $.notify({
        icon: "notifications",
        message: "Website " + domainName + ".cureyo.com has been created. You can check in 30-45 minutes, or open this URL in another browser to review.",
        url: 'http://' + domainName + '.cureyo.com',
        target: '_blank'
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
  putDomain(domainName) {

    const domainURL = "https://api.digitalocean.com/v2/domains/cureyo.com/records";
    const domData = {
      "type": "A",
      "name": domainName,
      "data": "139.59.76.104",
      "priority": null,
      "port": null,
      "ttl": 600,
      "weight": null
    };


    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', `Bearer 88e99143c6783437106e779dc1f7910f0bdf1de018c2f3b809470df8bb1074f9`);

    return this.http.post(domainURL, domData, {
      headers: headers
    })
      .map((res: Response) => res.json());

  }
}