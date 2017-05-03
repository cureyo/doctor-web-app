import { Component, OnInit, AfterViewInit, ViewContainerRef, Input, EventEmitter, Output, ComponentFactoryResolver } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { ROUTES } from './sidebar-routes.config';
import { MenuType } from './sidebar.metadata';
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../config/app.config';
import { SelectDomainComponent } from '../dashboard/select-domain/select-domain.component';

declare var $: any



@Component({
    selector: 'app-sidebar',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit, AfterViewInit {
    @Input() caredOnes:any;
    public menuItems: any[];
    private currentUser: any;
    private user: any;
    private isAuth: boolean;
    private noCaredOnes: boolean = false;
    private fbAccessToken: string;
   // private caredOnes: {};
    private onboardingReview: any;
    private noOfCaredOnes: number = 0;
    private noOfCaredBy: number = 0;
    private fbFriends: any;
    private fbFamily: any;
    private famCount: number = 0;
    private caredonesToAdd: any;
    private scheduledJobs: any;
    private defaultData: any;
    private caredOnesFamily: any;
    private coPlan: boolean = false;
    private coProfile: boolean = false;
    private coReport: boolean = false;
    private coDoctorJobs:boolean = false;
    private isDoctor: boolean = false;
    private hasWebsite: boolean = false;

    ngOnInit() {
        
    $.getScript('../../assets/js/material-dashboard-angular.js');
        // this.menuItems = ROUTES.filter(menuItem => menuItem.menuType !== MenuType.BRAND);
                console.log("From sidebar component");
                console.log(this.caredOnes);
        this._authService._getUser()
            .subscribe(
            data => {
                if (!data.isAuth) {
                    //window.location.href = window.location.origin + '/login?next=' + window.location.pathname;
                }
                this.isAuth = data.isAuth;
                console.log("this executes");
                this.getcurrentUser(data.user.uid);

                this.defaultData = { id: "phoneNumber", relationship: "", name: "", imageURL: "/assets/img/man.png", directAdd: true };

            },
            error => console.log(error)
            );


   
    }
    ngAfterViewInit(): void {
       // $('html,body').animate({ scrollTop: $("#header").offset().top - 200 }, 500);

    }

    constructor(

        private _authService: AuthService,
        private fs: FacebookService,
        private router: Router,
        private route: ActivatedRoute,
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef,
        private domain: SelectDomainComponent
    ) {
 }//  constructor


    getcurrentUser(uid) {
        this._authService._fetchUser(uid)
            .subscribe(res => {
                if (res) {
                    this.currentUser = this._authService._getCurrentUser();
                    if (this.currentUser.mci_number) {
                        this.isDoctor = true;
                        console.log("is doctor:", this.isDoctor)
                    } else {
                        this.isDoctor = false;
                        console.log("is doctor:", this.isDoctor)
                    }
                    if (this.currentUser.clinicWebsite) {
                        this.hasWebsite = true;
                        console.log("has website", this.hasWebsite)
                    } else {
                        this.hasWebsite = false;
                        console.log("has website", this.hasWebsite)
                    }
                    this.getCaredones();
                    console.log(this.caredOnes)
                    
            } /*else {
                    this.router.navigate(['checkup']);
                    console.log("logout was needed")
                }*/
            });
    }//  getcurrentUser()

       getCaredones() {
           this.noCaredOnes = true;
        this._authService._getcaredOnesList(this.currentUser.authUID).subscribe(
            data => {
                console.log("From sidebar component");
                console.log(data);
            
                this.caredOnes = data;
                this.noCaredOnes = false;
                console.log("this.caredOnes");
                console.log(data);
                if (data.length == 0) {
                    console.log("no cared ones")
                this.noCaredOnes = true;
                    //$("#myModal").modal('show');
                }
                
            }//  data
        ); // _getcaredOnesList

    }//  getCaredones

    coPlanMenu() {
        this.coPlan = !this.coPlan;
        this.coReport = false;
        this.coProfile = false;
        this.coDoctorJobs=false;
        console.log("Planmenu")
    }
     coProfileMenu() {
        
        this.coPlan = false;
        this.coReport = false;
        this.coProfile = !this.coProfile;
         this.coDoctorJobs=false;
        console.log("Profile menu")
    }
    coReportMenu() {
        this.coPlan = false;
        this.coReport = !this.coReport;
        this.coProfile = false;
         this.coDoctorJobs=false;
        console.log("Report menu")
    }
    coDoctorJobsMenu(){
        this.coDoctorJobs=!this.coDoctorJobs;
         console.log("flag for doctor:",this.coDoctorJobs);
        this.coPlan = false;
        this.coReport = false;
        this.coProfile = false;
        
        console.log("Doctor job menu");
     }
    coDashboardMenu() {
        this.coPlan = false;
        this.coReport = false;
        this.coProfile = false;
        this.coDoctorJobs=false;
        console.log("Dashboard menu")
    }
     
    resetSideBar() {
        this.coPlan = false;
        this.coReport = false;
        this.coProfile = false;
        this.coDoctorJobs=false;
        console.log("Route selected");
 }
}

