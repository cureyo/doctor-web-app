import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginModalComponent } from './login-modal.component';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ LoginModalComponent ],
    exports: [ LoginModalComponent ]
})

export class LoginModalModule {}