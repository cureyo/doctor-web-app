import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AppConfig } from '../config/app.config';
import { Checkup } from "../models/checkup.interface";
import { FbService } from "../services/facebook.service";
import { MetadataService } from "../services/metadata.service";
import { FacebookService } from "ng2-facebook-sdk/dist/index";
import { environment } from '../environment';
import {DomSanitizer} from '@angular/platform-browser';


declare var $: any;
@Component({
  templateUrl: 'clinicpage.component.html',
  selector: 'clinicpage-cmp',
  moduleId: module.id

})
export class ClinicPageComponent implements OnInit, AfterViewInit {
  

  
  isAuth: boolean;
  buttonClicked: boolean;
  buttonClicked1: boolean;
  private currentUser: any;
  private pageDetails: any;
  private heroBGImage: any;

 

  constructor(
    
    private _authService: AuthService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private metadataService: MetadataService
    
  ) { 
       
   
  
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        let param = params['page'];
        console.log(param)
        this._authService._getDoctorPage(param).subscribe(
            pageData => {
              console.log(pageData);
              this.pageDetails = pageData;
              console.log(this.pageDetails.Content);
              console.log(this.pageDetails.Images);
             this.heroBGImage = this.sanitizer.bypassSecurityTrustStyle('url(' + this.pageDetails.heroBGImage + ')');
              this.setMetadata();

            }
          )
    });
    $(window).on('scroll',function(){
      var y = $(this).scrollTop();
      console.log("scrolling");
      if(y > 500) {
         $("nav").removeClass("navbar-transparent");
      }
      else {
         $("nav").addClass("navbar-transparent");
      }
     
    })
  }

  ngAfterViewInit() {
   
  }//ngAfterViewInit

  getSafeURL(cleanURL) {
    //console.log(cleanURL);
    return this.sanitizer.bypassSecurityTrustStyle('url(' + cleanURL + ')');
  }

 scroll2Appt(content) {
  // console.log(content);
   var elmnt = document.getElementById("BookAppointment");
  // console.log(elmnt);
elmnt.scrollIntoView();


 }
 
  setMetadata() {
		let title ='yo page';
		let description = 'Description of the page';
		let urlImage = 'Image to display';
		let urlPage = 'url of the page';
		let appId = 'your facebook page id';
		console.log("seting medata");
    //basic metadata
		this.metadataService.setTitle(title);
		this.metadataService.setMetaDescription(description);

		//google metadata
		this.metadataService.setMetadata('itemprop', 'name', title);
		this.metadataService.setMetadata('itemprop', 'description', description);
		this.metadataService.setMetadata('itemprop', 'image', urlImage);


		//twitter metadata
		this.metadataService.setMetadata('name', 'twitter:card', 'summary_large_image');
		this.metadataService.setMetadata('name', 'twitter:site', '@twitterUsername');
		this.metadataService.setMetadata('name', 'twitter:title', title);
		this.metadataService.setMetadata('name', 'twitter:description', description);
		this.metadataService.setMetadata('name', 'twitter:creator', '@twitterUsername');
		this.metadataService.setMetadata('name', 'twitter:image', urlImage);


		//facebook metadata
		this.metadataService.setMetadata('property', 'og:title', title);
		this.metadataService.setMetadata('property', 'og:type', 'books.quotes');
		this.metadataService.setMetadata('property', 'og:url', urlPage);
		this.metadataService.setMetadata('property', 'og:image', urlImage);
		this.metadataService.setMetadata('property', 'og:description', description);
		this.metadataService.setMetadata('property', 'og:site_name', 'Site Name'); 
		this.metadataService.setMetadata('property', 'fb:app_id', appId);
	}

}
