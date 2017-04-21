import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import {FormGroup, FormBuilder,Validators} from "@angular/forms";

@Component({
  templateUrl: 'doctor-login.component.html',
  selector: 'doctor-login-cmp',
  moduleId: module.id
})
export class DoctorLoginComponent implements OnInit {
   private loginForm:FormGroup;
  private user: {};
  private isAuth: boolean;
  private showVid: boolean = false;

  constructor(private _fb: FormBuilder,private _authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // this._authService.logout();

    this._authService._getUser()
      .subscribe(
      data => {
        if (!data.isAuth) {
          //window.location.href = window.location.origin + '/login?next=' + window.location.pathname;
        } else {
          this.isAuth = data.isAuth;
          this.user = data.user;
          this._authService._fetchDocUser(data.user.uid)
            .subscribe(res => {
              console.log("from login: ");
              console.log(res);
              if (res.hasOwnProperty('authUID')) {
                this.activatedRoute.queryParams
                  .subscribe(params => {
                      console.log("query parameters");
                    console.log(params);
                    if (params['next']) {
                      window.location.href = window.location.origin + params['next'];
                    } else {
                      window.location.href = window.location.origin + '/dashboard';
                    }
                 });

              } else {
                this.router.navigate(['doctor-checkup']);

              }

            })
        }
      },
      error => console.log(error)
      );
      this.loginForm=this._fb.group({
        //  fname:[],
         email:[,Validators.required],
         psw:[]
       })
  }

  doclogin(provider) {
    
      console.log("Regular browser");
     this._authService.doclogin();
      console.log("rerouting from login(provider)")
   
  }
  showVideo() {
    this.showVid = !this.showVid;
  }

   Mlogin=(model)=>{
    let reminder={}
    let login={},
    job=model['value'];
    // reminder['displayName']=job['fname'];
    reminder['email']=job['email'];
    reminder['password']=job['psw'];
    
    login['email']=job['email'];
    login['password']=job['psw'];
    console.log("the reminder value check for manual login",reminder);
    let data:any;
    this._authService. createMailUser(reminder)
    // .then(
    //   res=>{
          
    //          console.log(res);
    //            console.log("the reponse value of create user2",res);
    //           this._authService.loginMailUser(login).then(
    //             data => {

    //               console.log("login response test",data);
    //                       this.router.navigate(['checkup']);
    //             }
    //           );
           
    //     console.log("create user response",res);
    // });
       

  }

}