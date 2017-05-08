import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Caredone } from "../../models/caredone.interface";
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
//import { HomeComponent } from "../home/home.component";
declare var $: any;
@Component({
  selector: 'app-cared-ones-form-mobile-view',
  templateUrl: './cared-ones-form-mobile-view.component.html',
   moduleId: module.id
 
})
export class CaredOnesFormMobileViewComponent implements OnInit {
  private coMobileViewForm: FormGroup;
  private showErrorFlag: boolean = false;
  private showErrorFlag2: boolean = false;
  private msg:any;
  private currentUser:any;
  private currentUserID:any;
  private caredone:any;
  private caredoneId:any;
  private nickName:any;
  private caredOneAdded: boolean = false;

 constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router
  ){
      this._authService._getUser()
      .subscribe(
              data => {
                    if (!data.isAuth) {
                    this.router.navigate(['doctor-login'])
                    }
                    else {
                          this._authService._fetchUser(data.user.uid)
                          .subscribe(res => {
                                if (res) {
                                    this.currentUser = this._authService._getCurrentUser();
                                    this.currentUserID = this.currentUser.authUID
                                    //console.log("the current user id:",this.currentUserID);
                                    //get the param id:
                                     this.route.params.subscribe(
                                        params => {
                                          
                                          let param = params['id'];
                                          //let param = "61698978";
                                          this.caredoneId = param;
                                          this.getCaredOne(param); //find caredones
                                        });
                                    



                                    this._authService._getmsgFromSendMessage(this.currentUserID, this.caredoneId)
                                        .subscribe( res=>{
                                        this.msg=res;
                                              if (this.msg){
                                              this.coMobileViewForm = this._fb.group({   
                                              sendmsg:[this.msg[0].$value]
                                               })
                                              }

                                        else {
                                            this.coMobileViewForm = this._fb.group({   
                                            sendmsg:[" "]
                                            })
                                               } 

                                               })      
                                       }     
                               });
                    }
      });

  }

 ngOnInit() { 
       //console.log("msg val check :",this.msg)
        if (!this.msg){
         this.coMobileViewForm = this._fb.group({   
         sendmsg:['I added you on a platform called Cureyo to help us manage your health. The team will reach out to you for your medical reports and to plan your health needs. Please cooperate with them.']
        }
        )}
         
  }
  
  showError() {
    //console.log("clicked");
    this.showErrorFlag = true;
  }
  showError2() {
    //console.log("clicked");
    this.showErrorFlag2 = true;
  }
  onSubmit(model, event) {
       //console.log("i am in onsubmit");
  }

  detectmob() {
    // //console.log(window.innerWidth)
    // //console.log(window.innerHeight)
    if (window.innerWidth <= 800 && window.innerHeight <= 800) {
     // //console.log("small screen")
      return true;
    } else {
      return false;
    }
  }
   //get param function
   getCaredOne(param) {
      //console.log("ids of current user and param",this.currentUserID,param);
     this._authService._findCaredOne(this.currentUserID, param)
            .subscribe(
            data => {
              this.caredone = data;
              //console.log("the caredone data :",this.caredone);
              this.nickName=this.caredone.nickName;
               //console.log("test NickName",this.nickName);
              //this.caredoneId=this.caredone.authUID;
              // //console.log("caredone id:",this.caredoneId);
            });
  }





}
