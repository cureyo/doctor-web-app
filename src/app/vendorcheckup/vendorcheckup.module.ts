import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VendorCheckupComponent } from './vendorcheckup.component';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [  VendorCheckupComponent ],
    exports: [ VendorCheckupComponent ]
})
export class DoctorCheckUpModule {}