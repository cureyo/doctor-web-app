import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DoctorCheckupComponent } from './doctorcheckup.component';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [  DoctorCheckupComponent ],
    exports: [ DoctorCheckupComponent ]
})
export class DoctorCheckUpModule {}