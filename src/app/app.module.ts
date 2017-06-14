import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from "./services/firebaseauth.service";
import { AngularFire, FirebaseAuth, FirebaseListObservable } from 'angularfire2';
import { FacebookInitParams, FacebookLoginResponse, FacebookService } from "ng2-facebook-sdk";
import { RouterModule } from '@angular/router';
import { MODULE_COMPONENTS, MODULE_ROUTES } from './app.routes';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CONFIG } from '../app/config/firebase.config';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { CaredoneFormComponent } from './dashboard/caredone-form/caredone-form.component';
import {MetadataService} from "./services/metadata.service";
import { FbService } from "./services/facebook.service";
import { DashboardModule } from './dashboard/dashboard.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { LoginModalModule } from './login-modal/login-modal.module';
import { DoctorCheckUpModule } from './doctorcheckup/doctorcheckup.module';
import { CommonModule } from '@angular/common';
import {DoctorLoginModule} from "./doctor-login/doctor-login.module";
import { FileSelectDirective, FileDropDirective, FileUploader, FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { PathLocationStrategy, LocationStrategy, APP_BASE_HREF } from '@angular/common';
import {CaredOnesFormMobileViewComponent} from "dashboard/cared-ones-form-mobile-view/cared-ones-form-mobile-view.component";
import {Ng2AutoCompleteModule} from "ng2-auto-complete/dist/index";
import {GooglePlaceModule} from 'ng2-google-place-autocomplete';
import { SelectDomainComponent } from './dashboard/select-domain/select-domain.component';
import {PatientPreviewComponent} from './dashboard/PatientPreview/PatientPreview.component';
import { OutPatientsFormComponent } from './dashboard/OutPatients/OutPatientsForm.component';
import { OPDComponent } from './dashboard/OPD/OPD.component';
import { FbAdsFormComponent } from './fb-ads-form/fb-ads-form.component';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
import {JsonpModule} from '@angular/http';
import {CareTimelinesComponent} from "./dashboard/care-timeline/care-timeline.component"
//import { Ng2SliderComponent } from 'ng2-slider-component/ng2-slider.component';
import { SlideAbleDirective } from 'ng2-slideable-directive/slideable.directive';
import { Ng2StyledDirective } from 'ng2-styled-directive/ng2-styled.directive';
import {ExistingPathWaysComponent} from './dashboard/care-pathways/existing-path-ways/existing-path-ways.component'
import {CreatePathWaysComponent} from './dashboard/care-pathways/create-path-ways/create-path-ways.component';
import {VideoCallComponent} from "./dashboard/video-call/video-call.component";
import {PatientDetailFormComponent} from "./dashboard/PatientDetailForm/PatientDetailForm.component"
import { NouisliderModule } from 'ng2-nouislider';
import {NgPipesModule} from 'ngx-pipes';

// Must export the config
export const firebaseConfig = {
  apiKey: CONFIG.apiKey,
  authDomain: CONFIG.authDomain,
  databaseURL: CONFIG.databaseURL,
  storageBucket: CONFIG.storageBucket,
};

export const firebaseAuthConfig = {
  provider: AuthProviders.Facebook,
  method: AuthMethods.Popup,
  scope: ["user_friends", "user_relationships", "user_relationship_details"]
}


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    RouterModule.forChild(MODULE_ROUTES),
    BrowserModule,
    RouterModule.forRoot([]),
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    HttpModule,
    Ng2AutoCompleteModule,
    GooglePlaceModule,
    JsonpModule,
   NouisliderModule,
   NgPipesModule
  ],


  declarations: [ MODULE_COMPONENTS, FbAdsFormComponent,  
SlideAbleDirective, 
Ng2StyledDirective],

  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }, AuthService, AngularFire, FacebookService, FbService,MetadataService, SelectDomainComponent, OutPatientsFormComponent, CacheService, PatientPreviewComponent, ExistingPathWaysComponent, PatientDetailFormComponent,  NouisliderModule, CreatePathWaysComponent],

  bootstrap: [AppComponent],
   exports: [
    //Ng2SliderComponent,
    Ng2StyledDirective
  ]
})
export class AppModule { }
