import { Component, OnInit, AfterViewInit, ViewContainerRef, Input, EventEmitter, Output, ComponentFactoryResolver } from '@angular/core';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../../config/app.config';
import initDemo = require('../../../assets/js/charts.js');
import { CaredoneFormComponent } from "../caredone-form/caredone-form.component";
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';

declare var $: any

@Component({
  selector: 'home-cmp',
  moduleId: module.id,
  templateUrl: 'home.component.html',
  providers: [CacheService]
})

export class HomeComponent implements OnInit, AfterViewInit {

  private currentUser: any;
  private user: any;
  private isAuth: boolean;
  private noCaredOnes: boolean = false;
  private fbAccessToken: string;
  private caredOnes: {};
  private onboardingReview: any;
  private noOfCaredOnes: number = 0;
  private noOfCaredBy: number = 0;
  public fbFriends: any;
  public friends4Cache: any;
  private fbFamily: any;
  private famCount: number = 0;
  private caredonesToAdd: any;
  private scheduledJobs: any;
  private defaultData: any;
  private caredOnesFamily: any =[];
  private caredOneId: any;
  private noFacebook: boolean = true;
  private tempCurrentUserID:any;

  ngAfterViewInit(): void {
    // $('html,body').animate({ scrollTop: $("#header").offset().top - 200 }, 500);
    $('#myModal').modal('hide');
     $('#mainContent').css({ position: "" });

  }

  constructor(

    private _authService: AuthService,
    private fs: FacebookService,
    private router: Router,
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private _cacheService: CacheService
  ) {


  }//  constructor

  public showModal(modalId, caredId) {
    //console.log("show modal for: ", modalId)
    this.caredOneId = caredId;

    $('#myModal').modal('show');

    window.scroll(0, -100);
    //console.log($('#mainContent'));
    $('#mainContent').css({ position: 'fixed' });
  }

  addDetails(id) {

    $('#myModal').modal('hide');
    $('#mainContent').css({ position: "" });
    //console.log("redirecting to ", "patient-preview/" + id)
    this.router.navigate(['patient-preview/', id])
  }

  gotoAdd() {

    var elmnt = document.getElementById('AddSection');
    elmnt.scrollIntoView();
  }


  closeModal() {

    $('#myModal').modal('hide');
    $('#mainContent').css({ position: "" });

  }

  getcurrentUser(uid) {
    this._authService._fetchUser(uid)
      .subscribe(res => {
        //console.log("from fetch user");
        //console.log(res);
        if (res) {
          this.currentUser = this._authService._getCurrentUser();

          this.getCaredones();
          //console.log("getting cared ones")

          //this._cacheService.removeAll();
          //let familyData: any | null = this._cacheService.get('familyResponse');
          let friendsData = this._cacheService.get('friendResponse');
          //console.log("friendsData");
          //console.log(friendsData);

          if (friendsData != null) {
            let family, fullRelations;
            // family = familyData.data.data;
            //console.log("family");
            // //console.log(family);
            // fullRelations = family.concat(friendsData.data);
            //console.log(this.fbFriends);

            this.fbFriends = friendsData.data;
            //console.log(this.fbFriends);
            this.caredonesToAdd = this.fbFriends;

            this.createFamily();
            //console.log(this.fbFriends);
            this.removeDupFriends();
            this.excludeCaredones(this.fbFriends);

          }
          else {
            //console.log("initiating facebook")
            this.initFB();
          }

        } else {
          this.router.navigate(['doctor-checkup']);
          //console.log("doctor-checkup needed");
        }
      });
  }//  getcurrentUser()

  ngOnInit() {
    $('#myModal').modal('hide');
    
    this._authService._getUser()
      .subscribe(
      data => {
       
        if (!data.isAuth) {
         //window.location.href = window.location.origin + '/login?next=' + window.location.pathname;
        }
        else {
          this.isAuth = data.isAuth;
          //console.log("We are home now");
          this.getcurrentUser(data.user.uid);

          this.defaultData = { id: "phoneNumber", relationship: "", name: "", imageURL: "/assets/img/man.png", directAdd: true };

        }

      },
      error => console.log(error)
      );

     
  }


  getCaredones() {
    this._authService._getcaredOnesList(this.currentUser.authUID).subscribe(
      data => {
        //////console.log(data);
        for (let i = 0; i < data.length; i++) {
          //data[i]['checkToAdd'] = this.currentUser.checkToAdd;
          this._authService._getMedicationReminders(data[i].uid).subscribe(
            meds => {
              data[i]['hasMedReminder'] = meds.length > 0;
              this._authService._getExerciseData(data[i].uid).subscribe(
                exer => {
                  data[i]['input'] = this.prepareScore(meds, exer);
                  data[i]['total'] = this.prepareTotal(meds, exer);
                  data[i]['perf'] = this.preparePerf(meds, exer);
                  this._authService._getCaredOneInsight(data[i].uid).subscribe(
                    insight => {
                      //////console.log(insight);
                      if (insight[0]) {
                        data[i]['insights'] = insight;
                        //////console.log("insights added");
                      } else {
                        data[i]['insights'] = null;
                      }

                    }
                  )

                }); // _getExerciseData

            }); // _getMedicationReminders


        }//  for loop
        this.caredOnes = data;

        if (data.length == 0) {
          this.noCaredOnes = true;

        }
        else { this.noCaredOnes = false; }
      }//  data
    ); // _getcaredOnesList

  }//  getCaredones

  prepareScore = (meds, exercise) => {

    if (meds === null && meds.length === 0 && exercise.hasOwnProperty('Tracker') && exercise.Tracker.length === 0) {
      return null;
    }

    let ctr = 0, gt = 0, target, count,
      avgResponse = 0,
      sumOfMed = 0,
      sumOfExer = 0,
      countOfItems = 0
      ;
    if (meds.length > 0) {
      for (let med of meds) {

        if (med.Tracking_Data) {

          count = 0;
          for (let val of med['Tracking_Data']) {
            if (val) {
              if (val.Value === 1) {
                count++;
              }
            }

          }//  loop

          avgResponse = parseFloat(((count / med['Tracking_Data'].length) * 100).toFixed(0));
          sumOfMed += avgResponse;

        }//  has Tracking_Data
        countOfItems = countOfItems + 1;
      }//  loop
    } else {
      sumOfMed = 0;
    }
    if (exercise.Tracker && exercise.Tracker.length > 0) {
      target = exercise.Details.Daily_Target;
      countOfItems = countOfItems + 1;

      for (let ex of exercise.Tracker) {

        if (ex != null && ex.hasOwnProperty('Value')) {

          if (ex.Value > target) {
            gt++;
          }
          ctr++;
        }
      }//  for loop

      sumOfExer = parseFloat((gt / ctr * 100).toFixed(0));
    } else {
      sumOfExer = 0;
    }

    if (countOfItems === 0) {
      countOfItems = 1;
    }
    return ((sumOfMed + sumOfExer) / countOfItems).toFixed(0);

  }//  prepareScore

  preparePerf = (meds, exercise) => {

    if (meds === null && meds.length === 0 && exercise.Tracker.length === 0) {
      return null;
    }
    let ctr = 0, gt = 0, target, count,
      avgResponse = 0,
      sumOfExer = 0,
      countOfItems = 0,
      countOfPerfs = 0
      ;
    if (meds.length > 0) {
      for (let med of meds) {

        if (med.hasOwnProperty('Tracking_Data')) {

          count = 0;
          for (let val of med['Tracking_Data']) {
            if (val) {
              if (val.Value === 1) {
                count++;
              }
            }
          }//  loop


          avgResponse = parseFloat(((count / med['Tracking_Data'].length) * 100).toFixed(0));
          if (avgResponse === 100) {
            countOfPerfs = countOfPerfs + 1;
          }


        }// has Tracking_Data
        countOfItems = countOfItems + 1;
      }// loop
    }
    if (exercise.Tracker && exercise.Tracker.length > 0) {
      target = exercise.Details.Daily_Target;
      countOfItems = countOfItems + 1;

      for (let ex of exercise.Tracker) {

        if (ex != null && ex.hasOwnProperty('Value')) {

          if (ex.Value > target) {
            gt++;
          }
          ctr++;
        }
      }// for loop

      sumOfExer = parseFloat((gt / ctr * 100).toFixed(0));
      if (sumOfExer === 100) {
        countOfPerfs = countOfPerfs + 1;
      }
    }

    return countOfPerfs;

  }// preparePerf

  prepareTotal = (meds, exercise) => {

    if (meds === null && meds.length === 0 && exercise.Tracker.length === 0)
      return null;

    let countOfItems = 0;
    if (meds.length > 0) {
      countOfItems = meds.length;
    }
    if (exercise.Tracker && exercise.Tracker.length > 0) {
      countOfItems = countOfItems + 1;
    }

    return countOfItems;

  }// prepareTotal

  showCaredoneForm(event, member) {
    //////console.log("cared one being added");

    let target = event.target || event.srcElement || event.currentTarget;
    //////console.log(target);

    this.deactivateAllACO(target);

    let cor = $(target).parent(),
      details = cor.next('.card-content2');
    //////console.log(cor);
    //////console.log(details);

    cor.addClass('hide');
    cor.parent().addClass('active');

    details.removeClass('hide');
  }

  filterFriends(event) {
    let target = event.target || event.srcElement || event.currentTarget;
    let term = $(target).val().trim();

    if (term.length >= 2) {
      this.caredonesToAdd = this.caredonesToAdd.filter((item) => {
        return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
      });
    } else {
      this.caredonesToAdd = this.fbFriends;
    }

  }//filterFriends()

  deactivateAllACO(target) {

    $(target).closest('.col-md-4').siblings().each(function (e, k) {
      //////console.log("closest called");
      $(k).removeClass('active');
      $(k).find('.cor').removeClass('hide');
      let details = $(k).find('.card-content2');
      //////console.log(details);
      details.addClass('hide');
      details.find('.fields').empty();
      let footer = $(k).find('.card-footer');
      //////console.log(footer);
      footer.removeClass('hide');
    });
  }

  initFB() {
    this.caredOnesFamily[0] = { id: "phoneNumber", relationship: "", name: "Using Email/ Phone", imageURL: "/assets/img/man.png", directAdd: "mail" };
    let fbParams: FacebookInitParams = {
      appId: AppConfig.web.appID,
      xfbml: true,
      version: 'v2.6'
    };
    this.fs.init(fbParams);
    this.fs.getLoginStatus().catch(
        error => {
          //console.log('error: no facebook login')
        }
      ).then(
      (response: FacebookLoginResponse) => {
        if (response.status === 'connected') {
          //console.log("Facebook connected");
          this.fbAccessToken = response.authResponse.accessToken;
          this.noFacebook = false;
          this.fetchFamilyfromFB();
        } else {
          this.fbAccessToken = null;
        }
      },
      (error: any) => console.error(error)
    );
  }// initFB()

  //Fetch family and friends from FB API and merge them together
  fetchFamilyfromFB(): void {
    //////console.log("this does not execute 2")
    //console.log(this.fbAccessToken)
    if (this.fbAccessToken === null) {
      alert('Disconnected from Facebook. Kindly login again.');
    } else {
      let family, friends;
      let data, paging;
      this.fs.api('/' + this.currentUser.authUID + '/family?&limit=5').catch(
        error => {
          //console.log(error);
          //console.log('error: no facebook login')
          this.caredOnesFamily[0] = { id: "phoneNumber", relationship: "", name: "Using Email/ Phone", imageURL: "/assets/img/man.png", directAdd: "mail" };
          //this.noFacebook = true;
        }
      ).then(
        response => {
          if (response) {
          //console.log(response.paging)
          //console.log("more added");
          //console.log(response)
          data = response.data;
          paging = response.paging

          }



          //this.fbFamilyPaging(response.paging, response.data);


        }).then(() => {
          this.fbFamilyPaging(paging, data);
          console.log
          //console.log(paging)
          //console.log(data);
          //this._cacheService.set('familyResponse', { 'data': this.fbFriends }, { expires: Date.now() + 1000 * 60 * 60 });
        })


    }// else
  }// fetchFamilyfromFB

  public fbFamilyPaging(lastResponse, friends) {
    //console.log(friends)
    //console.log(lastResponse);
    //console.log("called again")
    if (lastResponse && lastResponse.next) {
      this.fs.api(lastResponse.next).catch(
        error => {
          //console.log('error: no facebook login')
        }
      ).then(
        response => {

          //console.log(response);
          //console.log("more2 added");
          ////console.log(this.fbFriends)
          ////console.log(response.paging);
          //friends = this.fbFriends;
          friends = friends.concat(response.data);
          //console.log(friends);
          //this.fbFriends = friends;
          //console.log(this.friends4Cache)
          this.fbFamilyPaging(response.paging, friends);
        });
    } else {
      this.friends4Cache = friends;
      //console.log(this.friends4Cache);
      this.friendsInitiate();
      //console.log("getting friends");
      //this.createFamily();
    }
  }
  friendsInitiate() {
    var self = this;
    //console.log(this.friends4Cache)
    this.fs.api('/' + this.currentUser.authUID + '/friends').catch(
        error => {
          //console.log('error: no facebook login')
          //this.caredOnesFamily[0] = { id: "phoneNumber", relationship: "", name: "Using Email/ Phone", imageURL: "/assets/img/man.png", directAdd: "mail" };
        }
      )
      .then(
      response => {
        //var defaultData = [{ id: "phoneNumber", relationship: "Add with email/phone", name: "", imageURL: "/assets/images/man.png" }];
        //  defaultData = defaultData.concat(family)
        if (response && response.data) {
        this.friends4Cache = this.friends4Cache.concat(response.data);

        //this.fbFriends = response.data.concat(family);
        //console.log(this.friends4Cache)
        this.fetchFbFriends(response.paging);
        }

        //////console.log("this does not execute 3")

      });
  }
  //fetching friends from fb via recursive call as long as pagination link exists
  fetchFbFriends(prevResponse) {
    //console.log(prevResponse.cursors);
    if (prevResponse.cursors) {
      //console.log(prevResponse.next);
      //console.log(prevResponse.cursors.after);
      this.fs.api('/' + this.currentUser.authUID + '/friends?after=' + prevResponse.cursors.after).catch(
        error => {
          //console.log('error: no facebook login');
       
        }
      ).then(
        response => {
          this.friends4Cache = this.friends4Cache.concat(response.data);
          this.fetchFbFriends(response);
        });
    } else {
      //console.log("adding to cache", this.friends4Cache)
      this._cacheService.set('friendResponse', { 'data': this.friends4Cache }, { expires: Date.now() + 1000 * 60 * 60 });

      this.fbFriends = this.friends4Cache;
      this.caredonesToAdd = this.fbFriends;
      this.createFamily();
      // this._cacheService.set('familyResponse', { 'data': this.fbFriends }, { expires: Date.now() + 1000 * 60 * 60 });

      this.removeDupFriends();
      this.excludeCaredones(this.fbFriends);
      //this.createFamily();


    }
  }// fetchFbFriends

  //Add relationship as 'friend' if it doesn't exist
  //create close family, self and email add
  private createFamily() {
    this.noFacebook = false;

    //console.log(this.fbFriends);
    let friends = this.fbFriends,
      family = [],
      len = this.fbFriends.length,
      a, b, i, j = 2;
    //console.log(friends);
    // this else part is for self and randome person add as caredone

    family[0] = { id: "phoneNumber", relationship: "", name: "Using Email/ Phone", imageURL: "/assets/img/man.png", directAdd: "mail" };
    j = this.famCount = 1;

    this._authService._findCaredOne(this.currentUser.authUID, this.currentUser.authUID)
      .subscribe(res => {
        //////console.log("res");
        //////console.log(res);
        if (res.firstName) { }
        else {
          //console.log(friends);
          family[1] = { id: this.currentUser.authUID, relationship: "self", name: "Care for yourself", imageURL: this.currentUser.avatar, directAdd: "self" };
          j = this.famCount = 2;
          //console.log(family);
        }
        for (i = 0; i < len; i++) {
          //console.log("friends:", i, friends[i], "family:", j, family[j])
          if (friends[i] && (friends[i]['relationship'] == 'father' || friends[i]['relationship'] == 'mother' || friends[i]['relationship'] == 'wife' || friends[i]['relationship'] == 'husband')) {
            //console.log("family console", +i, friends[i]['relationship'], +j, family[j - 1], friends[i]);
            //console.log("friends:", friends)
            let k = 0, alreadyPresent = false;
            for (k = 0; k < j; k++) {
              if (family[k].id == friends[i])
                alreadyPresent = true;
            }
            if (!alreadyPresent) {
              family[j] = friends[i];
              j = j + 1;
              this.famCount = j;
            }

            friends.splice(i, 1);
            i = i - 1;



          }
        }//for i
        //console.log("this is family", family)
        this.caredOnesFamily = family;
        this.caredonesToAdd = this.fbFriends = friends;
        //////console.log("this.caredonesToAdd", this.caredonesToAdd)
        this.excludeCaredFamily(this.caredOnesFamily)
      });




  }//removeDupFriends
  //Remove duplicate records
  private removeDupFriends() {

    let friends = this.fbFriends,
      len = friends.length,
      a, b, i, j;

    for (i = 0; i < len; i++) {

      a = friends[i];

      if (typeof a !== "undefined") {

        //friends[i]['relationship'] = 'friend';

        for (j = i + 1; j < len; j++) {

          b = friends[j];

          if (typeof b !== "undefined" && (a['id'] == b['id'])) {
            if (b.hasOwnProperty('relationship')) {
              friends[i]['relationship'] = b['relationship'];
              friends.splice(j, 1);
            }//if
          }//if
        }//for j
      }//if
    }//for i

    this.caredonesToAdd = this.fbFriends = friends;

  }//removeDupFriends

  //Exclude already added cared ones from the caredonesToAdd list
  private excludeCaredones(friends) {

    this._authService._findCaredOnes(this.currentUser.authUID).subscribe(
      res => {

        let flag, a = [];
        let family = friends;
        //////console.log("executes");
        if (res.length > 0) {

          family.forEach(next => {
            flag = true;
            res.forEach(item => {
              if (Number.parseInt(next.id) === Number.parseInt(item.uid)) {
                flag = false;
              }
            });

            if (flag) {
              a.push(next);
            }

          }); // forEach
        } else {
          a = family;
        }
        this.caredonesToAdd = a;
      });

  }

  private excludeCaredFamily(friends) {

    this._authService._findCaredOnes(this.currentUser.authUID).subscribe(
      res => {

        let flag, a = [];
        let family = friends;
        //////console.log("executes");
        if (res.length > 0) {

          family.forEach(next => {
            flag = true;
            res.forEach(item => {
              if (Number.parseInt(next.id) === Number.parseInt(item.uid)) {
                flag = false;
              }
            });

            if (flag) {
              a.push(next);
            }

          }); // forEach
        } else {
          a = family;
        }
        this.caredOnesFamily = this.fbFamily = a;


      });

  }

}// DashboardComponent
