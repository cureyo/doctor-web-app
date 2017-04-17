import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import {FacebookInitParams, FacebookLoginResponse, FacebookService} from "ng2-facebook-sdk";
import {AppConfig} from "../config/app.config";

@Injectable()
export class FbService{

  constructor(private fs: FacebookService){
    let fbParams: FacebookInitParams = {
      appId: AppConfig.web.appID,
      xfbml: true,
      version: 'v2.6'
    };
    this.fs.init(fbParams);

  }//constructor

  initFbMessenger(){
    return this.fs.getLoginStatus().then(
      (response: FacebookLoginResponse) => {
        return response.status == 'connected'?response.authResponse.accessToken: "null";
      },
      (error: any) => {
        console.log(error);
        return "null";
      }
    );
  }//initFB()

}//AuthService
