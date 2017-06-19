import { Component, OnInit } from '@angular/core';
import { ROUTES } from '../.././sidebar/sidebar-routes.config';
import { MenuType } from '../.././sidebar/sidebar.metadata';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthService } from "../../services/firebaseauth.service";

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    private navState: boolean = false;
    private notifications: any = [];
    private noticationDetail: any = [];
    constructor(location: Location,
        private _authService: AuthService) {
        this.location = location;
    }
    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle.menuType !== MenuType.BRAND);
            $.getScript('../assets/js/material-dashboard.js');
    $.getScript('../assets/js/initMenu.js');

    this._authService._getUser()
    .subscribe(
        user => {
            this._authService._getNotifications(user.user.uid)
            .subscribe(
                notifData => {
                    console.log(notifData);
                    this.notifications = notifData;
                }
            )
        }
    )
    }
    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(2);
        }
        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }

    signout() {
        //console.log("logging out")
        this._authService.logout();
    }

    showNav() {
        //console.log("nav clicked")
        if (this.navState) {
            $('html').addClass('nav-open');
            this.navState = !this.navState
        } else {
            $('html').removeClass('nav-open');
            this.navState = !this.navState
        }

        
    }
    
showNotifDetail(k) {

    console.log(this.noticationDetail, k);
    for (let i =0; i < this.noticationDetail.length; i++) {
        this.noticationDetail[i] = false;
    }
    this.noticationDetail[k] = true;
}
    
}
