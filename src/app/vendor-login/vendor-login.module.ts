import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VendorLoginComponent } from './vendor-login.component';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ VendorLoginComponent ],
    exports: [ VendorLoginComponent ]
})

export class VendorLoginModule {}