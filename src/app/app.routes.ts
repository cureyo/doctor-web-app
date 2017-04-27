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

import {NavbarComponent} from './shared/navbar/navbar.component';
import {AuthGuard} from "./auth.guard";
import {CaredOnesFormMobileViewComponent} from "./dashboard/cared-ones-form-mobile-view/cared-ones-form-mobile-view.component";
import {DoctorLoginComponent} from "./doctor-login/doctor-login.component";
import {DoctorCheckupComponent }  from "./doctorcheckup/doctorcheckup.component";
import {JobsMasterComponent} from "./dashboard/jobs-master/jobs-master.component";
import {BloodsugarJobsComponent } from "./dashboard/jobs-master/bloodsugar-jobs/bloodsugar-jobs.component";
import {ExerciseTrackerJobsComponent} from "./dashboard/jobs-master/exercise-tracker-jobs/exercise-tracker-jobs.component";
import {LabTestJobsComponent} from "./dashboard/jobs-master/lab-test-jobs/lab-test-jobs.component";
import {MedicationReminderJobsComponent} from "./dashboard/jobs-master/medication-reminder-jobs/medication-reminder-jobs.component";
import {OnlineConsultationJobsComponent}  from "./dashboard/jobs-master/online-consultation-jobs/online-consultation-jobs.component";
import {PhysicalconsultationJobsComponent}  from "./dashboard/jobs-master/physicalconsultation-jobs/physicalconsultation-jobs.component";
import {DocReviewJobsComponent} from "./dashboard/jobs-master/doc-review-jobs/doc-review-jobs.component";
import {WebContentComponent} from "./dashboard/web-content/web-content.component";
import {SiteCreationFormComponent} from "./dashboard/web-content/site-creation-form/site-creation-form.component";
import {HerotilesComponent} from "./dashboard/web-content/site-creation-form/herotiles/herotiles.component";
import { BookingtileComponent} from "./dashboard/web-content/site-creation-form/bookingtile/bookingtile.component";
import {SlotBookingComponent} from "./dashboard/web-content/site-creation-form/slot-booking/slot-booking.component";

import { SelectDomainComponent}  from "./dashboard/select-domain/select-domain.component";

import { PatientDetailFormComponent } from './dashboard/PatientDetailForm/PatientDetailForm.component';
import { FileUploadComponent } from './dashboard/PatientDetailForm/file-upload/file-upload.component';
import { PatientPreviewComponent } from './dashboard/PatientPreview/PatientPreview.component';

export const MODULE_ROUTES: Route[] =[
    { path: '', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [AuthGuard]  },
    { path: 'dashboard', component: HomeComponent },
    { path: 'careplans/:id', component: TableComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'weeklyreports/:id', component: WeeklyReportComponent },
    { path: 'sendmessage/:id',component:CaredOnesFormMobileViewComponent},
    { path: 'doctor-login',component:DoctorLoginComponent},
    { path: 'doctor-checkup',component:DoctorCheckupComponent },
    { path: 'doctorJob/:id',component:JobsMasterComponent },
    { path: 'clinicpage/:page', component: ClinicPageComponent },
    {path : 'web/:id', component :WebContentComponent},
    {path : 'webform/:id' ,component :SiteCreationFormComponent},
    { path: 'website', component: SelectDomainComponent},
    { path: 'caredoneprofiles/:id', component: PatientDetailFormComponent },
    { path: 'patient-preview/:id', component: PatientPreviewComponent },

]

export const MODULE_COMPONENTS = [
    AppComponent,
    HomeComponent,
    PatientPreviewComponent,
    TableComponent,
    FileUploadComponent,
    SidebarComponent,
    CaredoneFormComponent,
    NavbarComponent,
    LogoutComponent,
    ClinicPageComponent,
    MedicationReminderComponent,
    ExerciseTrackerComponent,
    BloodSugarTrackerComponent,
    SuggestedMedReminderComponent,
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
    WebContentComponent,
    SiteCreationFormComponent,
    HerotilesComponent,
    BookingtileComponent,
    SlotBookingComponent,
    SelectDomainComponent

]
