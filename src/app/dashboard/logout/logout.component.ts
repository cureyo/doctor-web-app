import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/firebaseauth.service";
import {Router} from "@angular/router";

@Component({
    templateUrl: 'logout.component.html',
    selector: 'logout-cmp',
    moduleId: module.id
})
export class LogoutComponent implements OnInit {

  private user: {};
  private isAuth: boolean;
   private showVid: boolean = false;

  constructor(private _authService: AuthService, private router: Router) {}

  ngOnInit() {
  }

   logout() {
    return this._authService.logout();
  }


}