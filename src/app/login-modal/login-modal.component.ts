import { Component, OnInit } from '@angular/core';

declare var $: any

@Component({
    selector: 'login-modal-cmp',
    moduleId: module.id,
    templateUrl: 'login-modal.component.html'
})

export class LoginModalComponent implements OnInit {
   ngOnInit() {
        $('#myModal').modal('show');
}
}