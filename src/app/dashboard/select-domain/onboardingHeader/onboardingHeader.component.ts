import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response, Headers } from '@angular/http';
import { AuthService } from "../../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';


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
  constructor(private _fb: FormBuilder, private _authService: AuthService, private router: Router, private activatedRouter: ActivatedRoute, private http: Http) {


  }

  ngOnInit() {
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
            if (this.section == "website") {
              this.website = true;
              this.facebook = false;
              this.partners = false;
              this.care = false;
            } else if (this.section == "facebook") {
              this.website = false;
              this.facebook = true;
              this.partners = false;
              this.care = false;
            } else if (this.section == "partners") {
              this.website = false;
              this.facebook = false;
              this.partners = true;
              this.care = false;
            } else if (this.section == "care") {
              this.website = false;
              this.facebook = false;
              this.partners = false;
              this.care = true;
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

            let finalPath = tempPath.substring(0, m);
            console.log(finalPath);
            if (finalPath == "website") {
              this.textToShow = "Please select a domain name for your website. Your website will be immediately available at <domain>.cureyo.com"
              this.headingToShow = "Create your Website";
              this.takeNext = false;
          } else if (finalPath == "web") {
            console.log(param['web'])
            this.headingToShow = "Create your Website";
            this.textToShow = "Please select a template for the website. Currently only one template is available. Please click on 'Modified Gaia Template'"
            this.takeNext = false;
          } else if (finalPath == "webform") {
            this.headingToShow = "Create your Website";
            this.textToShow = "Congratulations! Your website is ready. You can preview it below. Please UPDATE YOUR AVAILABILITY and review all the content provided, especially 'Brief' and 'Specializations'. Click on 'Done' when completed."
            
            this.nextURL = 'Ads';
            this.takeNext = true;
          } else if (finalPath == "Ads") {
           this.headingToShow = "Market your Website";
            this.textToShow = "Let's get started with some Facebook Advertising for your site. We have pre-created ad templates for each of your specialization. You can modify these or create new ads. Click on 'Done' when completed."
            this.nextURL = 'partners';
            this.takeNext = true;
          } else if (finalPath == "partners") {
            this.headingToShow = "Create your Ecosystem";
            this.textToShow = "Now, you can add 'Partners' for your clinic. Partners can be other Consultants (e.g., Dieticians, other Specialists) to whom you refer cases OR Vendors, such as Labs or Pharmacies. Click on 'Done' when completed."
            this.nextURL = 'patient-hx-forms';
            this.takeNext = true;
          } else if (finalPath == "patient-hx-forms") {
            console.log(param['patientHx'])
            this.headingToShow = "Medical History Forms";
            this.textToShow = "Here, you can create Medical History forms for your incoming patients. Patients will be asked to update their data in these forms before they walk into your chambers. We have created a few samples. You can view samples from the drop down or create your own forms. Click on 'Done' when completed."
            this.nextURL = 'care-paths';
            this.takeNext = true;
          } else if (finalPath == "care-paths") {
            console.log(param['carepaths'])
            this.headingToShow = "Care Pathways";
            this.textToShow = "Finally, let's create a few Care Pathways. Care Pathways are treatment regimens that will be enforced to your patients through Facebook Messenger, based on your selection. Items include 'Check Points' which may be reminders for consultations/ tests or simple checks on the patient's health. Some samples are provided. You can view samples from the drop down or create your own forms. Click on 'Done' when completed."
            this.nextURL = 'dashboard';
            this.takeNext = true;
          }
          }

          
      )
      }
    )


  }
  nextPage(){
    console.log("Routing to Next:", this.nextURL, {queryParams: {onboarding: 'yes'}} )
    this.router.navigate([this.nextURL], {queryParams: {onboarding: 'yes'}})
  }
}