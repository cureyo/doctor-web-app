import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CaredOnesFormMobileViewComponent } from './cared-ones-form-mobile-view/cared-ones-form-mobile-view.component';
import { JobsMasterComponent } from './jobs-master/jobs-master.component';
import { BloodsugarJobsComponent } from './jobs-master/bloodsugar-jobs/bloodsugar-jobs.component';
import { ExerciseTrackerJobsComponent } from './jobs-master/exercise-tracker-jobs/exercise-tracker-jobs.component';
import { LabTestJobsComponent } from './jobs-master/lab-test-jobs/lab-test-jobs.component';
import { MedicationReminderJobsComponent } from './jobs-master/medication-reminder-jobs/medication-reminder-jobs.component';
import { OnlineConsultationJobsComponent } from './jobs-master/online-consultation-jobs/online-consultation-jobs.component';
import { PhysicalconsultationJobsComponent } from './jobs-master/physicalconsultation-jobs/physicalconsultation-jobs.component';
import { DocReviewJobsComponent } from './jobs-master/doc-review-jobs/doc-review-jobs.component';
@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ DashboardComponent, CaredOnesFormMobileViewComponent, JobsMasterComponent, BloodsugarJobsComponent, ExerciseTrackerJobsComponent, LabTestJobsComponent, MedicationReminderJobsComponent, OnlineConsultationJobsComponent, PhysicalconsultationJobsComponent, DocReviewJobsComponent ],
    exports: [ DashboardComponent ]

})

export class DashboardModule {}