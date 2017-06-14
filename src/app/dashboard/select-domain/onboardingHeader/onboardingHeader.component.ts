import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response, Headers } from '@angular/http';
import { AuthService } from "../../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
//import * as Material from ".../../../assets/js/material-dashboard-angular.js"
import Material = require('.../../../assets/js/material-dashboard-angular.js');
declare var $: any


@Component({
  selector: 'onboarding-header-cmp',
  templateUrl: 'onboardingHeader.component.html',
  moduleId: module.id
})

export class OnboardingHeaderComponent implements OnInit {
  @Input() section: any;
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
  private onboarding: boolean = false;
  private website: boolean = false;
  private facebook: boolean = false;
  private partners: boolean = false;
  private care: boolean = false;
  private textToShow: any;
  private nextURL: any;
  private headingToShow: any;
  private takeNext: boolean = false;
  private allLinks: any = [];
  private finalPath: any;
  constructor(private _fb: FormBuilder, private _authService: AuthService, private router: Router, private activatedRouter: ActivatedRoute, private http: Http) {


  }

  ngOnInit() {
    this.allLinks = {
      "website": {
        website: true, facebook: false, partners: false, care: false, textToShow: "Please select a domain name for your website. Your website will be immediately available at <domain>.cureyo.com",
        headingToShow: "Create your Website",
        takeNext: false, nextURL: "NA", "demoName": "Building your Clinic Site", "demoURL": ""
      },
      "web": {
        website: true, facebook: false, partners: false, care: false, textToShow: "Please select a template for the website. Currently only one template is available. Please click on 'Modified Gaia Template'",
        headingToShow: "Create your Website",
        takeNext: false, nextURL: "NA", "demoName": "Building your Clinic Site", "demoURL": ""
      },
      "webform": {
        website: true, facebook: false, partners: false, care: false, textToShow: "Congratulations! Your website is ready. You can preview it below. Please UPDATE YOUR AVAILABILITY and review all the content provided, especially 'Brief' and 'Specializations'. Click on 'Done' when completed.",
        headingToShow: "Create your Website",
        takeNext: true, nextURL: "partners", "demoName": "Building your Clinic Site", "demoURL": ""
      },
      "Ads": {
        website: false, facebook: true, partners: false, care: false, textToShow: "Let's get started with some Facebook Advertising for your site. We have pre-created ad templates for each of your specialization. You can modify these or create new ads. Click on 'Done' when completed.",
        headingToShow: "Plan your Social Media presence",
        takeNext: true, nextURL: "dashboard", "demoName": "Adding partner Consultants and Vendors", "demoURL": ""
      },
      "partners": {
        website: false, facebook: false, partners: true, care: false, textToShow: "Now, you can add 'Partners' for your clinic. Partners can be other Consultants (e.g., Dieticians, other Specialists) to whom you refer cases OR Vendors, such as Labs or Pharmacies. Click on 'Done' when completed.",
        headingToShow: "Create your Ecosystem",
        takeNext: true, nextURL: "patient-hx-forms", "demoName": "Adding partner Consultants and Vendors on Cureyo", "demoURL": ""
      },
      "patient-hx-forms": {
        website: false, facebook: false, partners: false, care: true, textToShow: "Here, you can create Medical History forms for your incoming patients. Patients will be asked to update their data in these forms before they walk into your chambers. We have created a few samples. You can view samples from the drop down or create your own forms. Click on 'Done' when completed.",
        headingToShow: "Medical History Forms",
        takeNext: true, nextURL: "care-paths", "demoName": "Creating Patient Medical History (Hx) Forms", "demoURL": ""
      },
      "care-paths": {
        website: false, facebook: false, partners: false, care: true, textToShow: "Great! Now, let's create a few Care Pathways. Care Pathways are treatment regimens that will be enforced to your patients through Facebook Messenger, based on your selection. Items include 'Check Points' which may be reminders for consultations/ tests or simple checks on the patient's health. Some samples are provided. You can view samples from the drop down or create your own forms. Click on 'Done' when completed.",
        headingToShow: "Care Pathways",
        takeNext: true, nextURL: "payments", "demoName": "Creating Care Pathways", "demoURL": ""
      },
       "payments": {
        website: false, facebook: false, partners: false, care: true, textToShow: "Now that we have the Care Plans in place, let us configure the Payment Plans for your patients. Default forms have been pre-created for you.",
        headingToShow: "Payment Plans",
        takeNext: true, nextURL: "Ads", "demoName": "Creating Payment Plans for Patients", "demoURL": ""
      },
    }
    console.log(this.section);
    this.activatedRouter.params.subscribe(
      param => {
        console.log(param);
        this.activatedRouter.queryParams
          .subscribe(
          qParams => {
            if (qParams['onboarding'] == "yes") {
              this.onboarding = true;
            }

            console.log(this.router.url);
            //console.log(this.router.);
            console.log(window.location.pathname);
            let pathName = window.location.pathname;
            let tempPath = pathName.substring(1, pathName.length);
            let n = tempPath.indexOf('/'), m;
            if (n != -1) {
              m = n;
            } else {
              m = tempPath.length;
            }

            this.finalPath = tempPath.substring(0, m);
            console.log(this.finalPath);

          }


          )
      }
    )


  }
  nextPage(nextURL) {
    console.log("Routing to Next:", nextURL, { queryParams: { onboarding: 'yes' } })
    if (this.finalPath == 'partners') {
      this._authService._getSamplePaymentPlans()
        .subscribe(
        data => {
          this._authService._getUser()
            .subscribe(
            user => {
              console.log(data.plans);
              let data2 = {plans: data.plans};
              this._authService._savePaymentPlans(user.user.uid, data2).then(
                data2 => {
                  var d = document.getElementById('patient-hx');
                  
                  // Material.animationSidebar(d, true);
                this.router.navigate([nextURL], { queryParams: { onboarding: 'yes' } })

                })
            }
            )


        }
        )
    }
    else
      this.router.navigate([nextURL], { queryParams: { onboarding: 'yes' } });



  }

}