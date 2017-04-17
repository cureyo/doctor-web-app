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

    constructor(location: Location,
        private _authService: AuthService) {
        this.location = location;
    }
    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle.menuType !== MenuType.BRAND);
            $.getScript('../assets/js/material-dashboard.js');
    $.getScript('../assets/js/initMenu.js');
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
        console.log("logging out")
        this._authService.logout();
    }

    showNav() {
        console.log("nav clicked")
        if (this.navState) {
            $('html').addClass('nav-open');
            this.navState = !this.navState
        } else {
            $('html').removeClass('nav-open');
            this.navState = !this.navState
        }

        
    }

    
}
