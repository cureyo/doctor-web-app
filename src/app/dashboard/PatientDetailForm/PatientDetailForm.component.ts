import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import { FbService } from "../../services/facebook.service";
import { AppConfig } from "../../config/app.config";
import { Caredone } from "../../models/caredone.interface";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';

 declare var $:any;
@Component({
  selector: 'app-PatientDetailsFormComponent',
  moduleId: module.id,
  templateUrl: 'PatientDetailForm.component.html',
  providers: [CacheService]
})

export class PatientDetailFormComponent implements OnInit {

  public CaredonesForm: FormGroup;
  public ObserversForm: FormGroup;
  public currentUser: any;
  public caredone: any;
  public caredoneId: any;
  public observersList: any;
  private healthReports: any;
  private detailType: any;
  private healthReport2: any = [];
  private temp: any;
  private formReady: boolean = false;
  private caredOneReady: boolean = false;
  private obsReady: boolean = false;
  private repReady: boolean = false;
  private observerCount: any = 0;
  private reportCount: any = 0;
  private profileScore: any = 0;
  private currentUserID: any;

  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router,
    private http: Http,

  ) {
    // this.currentUser = this._authService._getCurrentUser();
    this.formReady = false;

    this.ObserversForm = this._fb.group({
      Ob_Name: ['', [Validators.required]],
      Ob_Email: [''],
      Ob_Phone: ['', [Validators.required]]
    });

    this._authService._getUser()
      .subscribe(
      data => {
        console.log("checking if user logged in");
        if (!data.isAuth) {
           window.location.href = window.location.origin + '/doctor-login?next=' + window.location.pathname;
        }
        else {
          this._authService._fetchUser(data.user.uid)
            .subscribe(res => {
              console.log(res);
              if (res) {
                this.currentUser = this._authService._getCurrentUser();
                this.currentUserID = this.currentUser.authUID
                this.route.params.subscribe(
                  params => {
                    let param = params['id'];
                    this.caredoneId = param;
                    this.getCaredOne(param);
                    this.getReports(param);
                    this.getObservers(param);
                  });

              } else {
                console.log("redirecting to checkup");
                this.router.navigate(['doctor-checkup'])

              }
            });
        }
      });
  } //constructor

  ngOnInit() {

  }
  gotDashboard() {
    $('#profileModal').modal('hide');
    $('#profileContent').css({ position: "" });
    this.router.navigate(['dashboard']);
  }

  closeModal() {

    $('#profileModal').modal('hide');
    $('#profileContent').css({ position: "" });


  }

  showModal(itemType) {
    this.detailType = itemType;


    $('#profileModal').modal('show');

    window.scroll(0, -100);
    $('#profileContent').css({ position: 'fixed' });
  }


  getObservers(param) {
    this._authService._getObserversList(param)
      .subscribe(
      res => {
        this.observersList = res;
        this.observerCount = res.length;
        this.obsReady = true;
      });
  }

  getReports(param) {
    this._authService._getHealthReports(param)
      .subscribe(
      data => {
        if (data.length) {
          this.reportCount = data.length;
        }
        else {
          this.reportCount = 0;
        }

        setTimeout(() => {

          //console.log(data);
          if (data[0]) {
            var date = new Date(data[0].updatedAt);
            var imageIs, imageIsSub, strLen, strStart;
            //console.log("data", data);

            for (let i = 0; i < data.length; i++) {
              ////console.log("report is ", report);
              this._authService._fetchUser(data[i].addedBy)
                .subscribe(res => {
                  //console.log(res);
                  //report.addedBy = res.firstName;
                  data[i]['addedFName'] = res.firstName;
                  //console.log(data);
                  date = new Date(data[i].updatedAt);
                  data[i]['updatedDate'] = date;
                  imageIs = data[i]['fileName'];
                  strLen = imageIs.length;
                  strStart = strLen - 3;
                  imageIsSub = imageIs.substring(strStart, strLen)
                  if (imageIsSub == "png" || imageIsSub == "jpg") {
                    data[i]['isImage'] = true;
                  } else {
                    data[i]['isImage'] = false;
                  }



                });

            }
            this.healthReports = data;
            this.repReady = true;


          } else {
            this.healthReports = null;
            this.repReady = true;
          }

        }, 1000)

        //this.healthRepo rts.addedFName = addedByUser.firstName;
      })

  }
  getCaredOne(param) {
    this._authService._findCaredOne(this.currentUserID, param)
      .subscribe(
      data => {
        this.caredone = data;
        this.caredOneReady = true;
        //console.log("caredone data ", this.caredone);
        this.profileScore = 0;
        for (let x in this.caredone) {
          if (x == "firstName" || x == "lastName" || x == "nickName" || x == "relationship" || x == "gender" || x == "age" || x == "email" || x == "phone" || x == "hometown" || x == "address")
            if (this.caredone[x])
            { this.profileScore = this.profileScore + 1; }
        }
        this.profileScore = 10 * this.profileScore;
        setTimeout(
          () => {
            this.caredone = data;
            this.temp = Math.floor((Math.random() * 1000000000) + 1);
            this.CaredonesForm = this._fb.group({
              firstName: [this.caredone.firstName, [Validators.required]],
              lastName: [this.caredone.lastName, [Validators.required]],
              nickName: [this.caredone.nickName, [Validators.required]],
              relationship: [this.caredone.relationship, [Validators.required]],
              gender: [this.caredone.gender],
              age: [this.caredone.age],
              email: [this.caredone.email],
              phone: [this.caredone.phone],
              hometown: [this.caredone.hometown],
              address: this.caredone.address
            });

            //console.log(this.ObserversForm);

            this.formReady = true;

            //console.log(this.dataReady);

          }, 1000)



      });





  }
  save_CaredoneData = (model) => {
    let reminder = {},
      job = model['value'];
    //console.log(job);

    reminder['firstName'] = job['firstName'];
    reminder['lastName'] = job['lastName'];
    reminder['nickName'] = job['nickName'];
    reminder['email'] = job['email'];
    reminder['avatar'] = this.caredone.avatar;
    reminder['age'] = job['age'];
    reminder['phone'] = job['phone'];
    reminder['hometown'] = job['hometown'];
    reminder['gender'] = job['gender'];
    reminder['uid'] = this.caredoneId;
    reminder['relationship'] = job['relationship'];
    reminder['authProvider'] = "facebook";
    reminder['authUID'] = this.caredoneId;
    reminder['address'] = job['address'];
    //console.log("the value of reminder in updatedcaedone profile:", reminder);
    this._authService._updateCaredoneProfile(reminder, this.currentUserID, this.caredoneId)
      .then(
      data => {
        //console.log("saved data is :", +data);
        this.showModal('profile details');
        // setTimeout(() => {
        //   this.router.navigate(['dashboard']);
        // }, 1500);
      }
      );

  }
  // save observers data:

  highlightSection(outerSection, sectionId) {
    var sectionName = "#" + sectionId;
    var elmnt = document.getElementById(outerSection);
    elmnt.scrollIntoView();
    $(sectionName).css({ transition: 'all 1s' })
    $(sectionName).css({ boxShadow: '0 20px 20px 0 rgba(0, 0, 0, 0.2), 0 20px 20px 0 #137a9c' });
    setTimeout(() => {
      $(sectionName).css({ boxShadow: '' });
    }, 2000)

  }

  save_NewObserverData = (model) => {
    let reminder = {},
      job = model['value'];
    let name = job['Ob_Name'];
    //console.log(job);


    reminder['name'] = job['Ob_Name'];
    reminder['email'] = job['Ob_Email'];
    reminder['phone'] = job['Ob_Phone'];
    reminder['addedBy'] = this.currentUserID;
    reminder['firstName'] = name.split(' ')[0];
    if (name.split(' ')[1]) {
      reminder['lastName'] = name.split(' ')[1];
    } else {
      reminder['lastName'] = ' ';
    }



    //console.log("the value of observers as reminder:", reminder);
    this._authService._saveObservers(reminder, this.temp, this.caredoneId)
      .then(
      data => {
        //console.log("saved data is :", +data);
        this.ObserversForm.reset();
        this.showModal('an Observer');
        // setTimeout(() => {
        //   this.router.navigate(['dashboard']);
        // }, 1500);
      }
      );

  }


}
