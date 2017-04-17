import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DoctorLoginComponent } from './doctor-login.component';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ DoctorLoginComponent ],
    exports: [ DoctorLoginComponent ]
})

export class DoctorLoginModule {}