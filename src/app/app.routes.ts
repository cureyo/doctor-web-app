import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { IconsComponent } from './dashboard/icons/icons.component';
import { TableComponent } from './dashboard/table/table.component';
import { TypographyComponent } from './dashboard/typography/typography.component';
import { LogoutComponent } from './dashboard/logout/logout.component';
import {ClinicPageComponent} from "./clinicpage/clinicpage.component";
import { WeeklyReportComponent } from './dashboard/weeklyreports/weeklyreports.component';
import { CaredoneFormComponent } from "./dashboard/caredone-form/caredone-form.component";
import {MedicationReminderComponent} from "./dashboard/table/MedicationReminder/medication-Reminder.component";
import {ExerciseTrackerComponent}   from "./dashboard/table/ExerciseTracker/Exercise-Tracker.component";
import {BloodSugarTrackerComponent} from "./dashboard/table/BloodSugarTracker/Blood-Sugar-Tracker.component";
import {SuggestedMedReminderComponent} from "./dashboard/table/SuggestedMedReminder/Suggested-Med-Reminder.component";
import {OnlineConsultationComponent}  from "./dashboard/table/OnlineConsultation/Online-Consultation.component";
import {PhysicalConsultationComponent} from "./dashboard/table/PhysicalConsultation/Physical-Consultation.component";
import {BloodSugarChartComponent} from "./dashboard/weeklyreports/BloodSugarChart/BloodSugarChart.component";
import { CommonModelComponent } from "./dashboard/weeklyreports/common-model/common-model.component";
import {DocReviewComponent}  from "./dashboard/table/DocReview/Doc-Review.component";
import { OutPatientsFormComponent} from "./dashboard/OutPatients/OutPatientsForm.component";
import { OPDComponent } from './dashboard/OPD/OPD.component';
import {NavbarComponent} from './shared/navbar/navbar.component';
import {AuthGuard} from "./auth.guard";
import {CaredOnesFormMobileViewComponent} from "./dashboard/cared-ones-form-mobile-view/cared-ones-form-mobile-view.component";
import {DoctorLoginComponent} from "./doctor-login/doctor-login.component";
import {DoctorCheckupComponent }  from "./doctorcheckup/doctorcheckup.component";
import {VendorLoginComponent} from "./vendor-login/vendor-login.component";
import {VendorCheckupComponent }  from "./vendorcheckup/vendorcheckup.component";
import {JobsMasterComponent} from "./dashboard/jobs-master/jobs-master.component";
import {BloodsugarJobsComponent } from "./dashboard/jobs-master/bloodsugar-jobs/bloodsugar-jobs.component";
import {PartnerComponent } from "./dashboard/partners/partners.component";
import {ExerciseTrackerJobsComponent} from "./dashboard/jobs-master/exercise-tracker-jobs/exercise-tracker-jobs.component";
import {LabTestJobsComponent} from "./dashboard/jobs-master/lab-test-jobs/lab-test-jobs.component";
import {MedicationReminderJobsComponent} from "./dashboard/jobs-master/medication-reminder-jobs/medication-reminder-jobs.component";
import {OnlineConsultationJobsComponent}  from "./dashboard/jobs-master/online-consultation-jobs/online-consultation-jobs.component";
import {PhysicalconsultationJobsComponent}  from "./dashboard/jobs-master/physicalconsultation-jobs/physicalconsultation-jobs.component";
import {DocReviewJobsComponent} from "./dashboard/jobs-master/doc-review-jobs/doc-review-jobs.component";
import {BloodsugarCareComponent } from "./dashboard/care-pathways/bloodsugar-carepath/bloodsugar-carepath.component";
import {CreatePathWaysComponent } from "./dashboard/care-pathways/create-path-ways/create-path-ways.component";
import {ExistingPathWaysComponent} from "./dashboard/care-pathways/existing-path-ways/existing-path-ways.component";
import {LabTestCareComponent} from "./dashboard/care-pathways/lab-test-carepath/lab-test-carepath.component";
import {MedicationReminderCareComponent} from "./dashboard/care-pathways/medication-reminder-carepath/medication-reminder-carepath.component";
//import {OnlineConsultationCareComponent}  from "./dashboard/care-pathways/online-consultation-carepath/online-consultation-carepath.component";
import {PhysicalconsultationCareComponent}  from "./dashboard/care-pathways/physicalconsultation-carepath/physicalconsultation-carepath.component";
//import {DocReviewCareComponent} from "./dashboard/care-pathways/doc-review-carepath/doc-review-carepath.component";
import {WebContentComponent} from "./dashboard/web-content/web-content.component";
import {SiteCreationFormComponent} from "./dashboard/web-content/site-creation-form/site-creation-form.component";
import {HerotilesComponent} from "./dashboard/web-content/site-creation-form/herotiles/herotiles.component";
import {SocialCalendarComponent} from "./dashboard/web-content/site-creation-form/social-calendar/social-calendar.component";
import {FooterComponent}  from "./dashboard/web-content/site-creation-form/footer/footer.component";
import { BookingtileComponent} from "./dashboard/web-content/site-creation-form/bookingtile/bookingtile.component";
import {SlotBookingComponent} from "./dashboard/web-content/site-creation-form/slot-booking/slot-booking.component";
import {PhySlotBookingComponent} from "./dashboard/web-content/site-creation-form/slot-bookingPhy/slot-booking-phy.component";
import {ProfileTileComponent} from "./dashboard/web-content/site-creation-form/profileTile/profileTile.component";
import {SpecializationsTileComponent} from "./dashboard/web-content/site-creation-form/specializationsTile/specializationsTile.component";
import { SelectDomainComponent}  from "./dashboard/select-domain/select-domain.component";
import { CarePathsComponent}  from "./dashboard/care-pathways/care-pathways.component";
import { PatientHxFormComponent}  from "./dashboard/Hx-Forms/Hx-Forms.component";
import { PatientDetailFormComponent } from './dashboard/PatientDetailForm/PatientDetailForm.component';
import { FileUploadComponent } from './dashboard/PatientDetailForm/file-upload/file-upload.component';
import { PatientPreviewComponent } from './dashboard/PatientPreview/PatientPreview.component';
import {FbAdsFormComponent} from './fb-ads-form/fb-ads-form.component';
import {OnboardingHeaderComponent} from "./dashboard/select-domain/onboardingHeader/onboardingHeader.component";
import {ImageSearchComponent} from './fb-ads-form/image-search/image-search.component';
import {VideoCallComponent} from "./dashboard/video-call/video-call.component";
import {PaymentsComponent} from "./dashboard/payments/payments.component";
import {CareTimelinesComponent} from "./dashboard/care-timeline/care-timeline.component"

export const MODULE_ROUTES: Route[] =[

    { path: '', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [AuthGuard]  },
    { path: 'dashboard', component: HomeComponent },
    { path: 'careplans/:id', component: TableComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'weeklyreports/:id', component: WeeklyReportComponent },
    { path: 'sendmessage/:id',component:CaredOnesFormMobileViewComponent},
    { path: 'doctor-login',component:DoctorLoginComponent},
    { path: 'doctor-checkup',component:DoctorCheckupComponent },
    { path: 'vendor-login',component:VendorLoginComponent},
    { path: 'vendor-checkup',component:VendorCheckupComponent },
    { path: 'doctorJob/:id',component:JobsMasterComponent },
    { path: 'clinicpage/:page', component: ClinicPageComponent },
    { path: 'web/:id', component :WebContentComponent},
    { path: 'webform/:id' ,component :SiteCreationFormComponent},
    { path: 'website', component: SelectDomainComponent},
    { path: 'caredoneprofiles/:id', component: PatientDetailFormComponent },
    { path: 'patient-preview/:id', component: PatientPreviewComponent },
    { path: 'care-paths', component: CarePathsComponent },
    { path: 'payments', component: PaymentsComponent },
    { path: 'Ads', component :FbAdsFormComponent},
    { path: 'out-patients/:count/:id', component: OutPatientsFormComponent},
    { path: 'out-patient-dept', component: OPDComponent},
    { path: 'patient-hx-forms', component: PatientHxFormComponent},
    { path: 'partners', component: PartnerComponent}
    


]

export const MODULE_COMPONENTS = [
    AppComponent,
    HomeComponent,
    PatientPreviewComponent,
    TableComponent,
    VideoCallComponent,
    FileUploadComponent,
    SidebarComponent,
    CaredoneFormComponent,
    NavbarComponent,
    LogoutComponent,
    ClinicPageComponent,
    SocialCalendarComponent,
    MedicationReminderComponent,
    ExerciseTrackerComponent,
    CareTimelinesComponent,
    BloodSugarTrackerComponent,
    SuggestedMedReminderComponent,
    VendorLoginComponent,
    VendorCheckupComponent,
    OnlineConsultationComponent,
    PhysicalConsultationComponent,
    DocReviewComponent,
    BloodSugarChartComponent,
    WeeklyReportComponent ,
    PatientDetailFormComponent,
    CommonModelComponent,
    CaredOnesFormMobileViewComponent,
    DoctorLoginComponent,
    DoctorCheckupComponent,
    JobsMasterComponent,
    BloodsugarJobsComponent,
    ExerciseTrackerJobsComponent,
    LabTestJobsComponent,
    MedicationReminderJobsComponent,
    OnlineConsultationJobsComponent,
    PhysicalconsultationJobsComponent,
    DocReviewJobsComponent,
    BloodsugarCareComponent,
    LabTestCareComponent,
    MedicationReminderCareComponent,
    PhysicalconsultationCareComponent,
    PaymentsComponent,
    ImageSearchComponent,
    PartnerComponent,
    WebContentComponent,
    SiteCreationFormComponent,
    HerotilesComponent,
    BookingtileComponent,
    SpecializationsTileComponent,
    FooterComponent,
    OnboardingHeaderComponent,
    SlotBookingComponent,
    PhySlotBookingComponent,
    ProfileTileComponent,
    SelectDomainComponent,
    CarePathsComponent,
    OutPatientsFormComponent,
    OPDComponent,
    FbAdsFormComponent,
    PatientHxFormComponent,
    CreatePathWaysComponent,
    ExistingPathWaysComponent,
    

]
