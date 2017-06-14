import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import { AngularFire, FirebaseAuth, FirebaseListObservable, AuthProviders, AuthMethods } from 'angularfire2';
import { Router } from "@angular/router";
import { AppConfig } from "../config/app.config";

@Injectable()
export class AuthService {
  users: FirebaseListObservable<any[]>;
  doctorsList: FirebaseListObservable<any[]>;
  jobsList: FirebaseListObservable<any[]>;
  pathologicalList: FirebaseListObservable<any[]>;
  medicineList: FirebaseListObservable<any[]>;
  userData: any;

  private db = AppConfig.database;

  constructor(public af: AngularFire, public firebase: FirebaseAuth, private router: Router) {
    this.users = af.database.list(this.db.users);
    this.doctorsList = af.database.list(this.db.doctors);
    this.jobsList = af.database.list(this.db.scheduledJobs);
    this.pathologicalList = af.database.list(this.db.pathologicalTestDetails + "/Pathological");
    this.medicineList = af.database.list(this.db.pathologicalTestDetails + "/Pharmacy");
  }//constructor

  _findDoctor(doctorId) {

    return this.doctorsList.subscribe(
      items => {
        return items.filter(item => item.$key === doctorId)[0];
      }
    );

  }//_findDoctor

  isAuthenticated() {
    return this.af.auth.subscribe(
      user => { return !!user }
    );
  }

  login(provider) {
    //console.log(provider)
    this.af.auth.login({
      //provider: provider
    });

  }//login




  doclogin() {
    console.log("doctor login firebase function called:");
    return (
      this.af.auth.login({
        provider: AuthProviders.Facebook,
        method: AuthMethods.Popup,
        scope: ["manage_pages", "publish_pages", "ads_management", "user_friends", "user_relationships", "user_relationship_details", "pages_messaging", "business_management"]
      }).then(
        data => {
          console.log(data);
        }).catch(
          error => {
            console.log(error);
            if (error['code'] == "auth/web-storage-unsupported")
            alert('Oops! Seems like 3rd party cookies are disabled. You can change it to just allow us, if you want. Trust us! We are good people For Chrome, MORE (icon with 3 dots) > SETTINGS > ADVANCED (Section) > CONTENT SETTINGS > COOKIES > MANAGE EXCEPTIONS & Set your preference');
          else 
        alert(error.message);}
        )
    )

  }
  fbApplogin() {

    this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Redirect,
      scope: ["user_friends", "user_relationships", "user_relationship_details"]
    });

  }//fb App login

  logout() {

    window.location.href = window.location.origin + '/home.html';
    return this.af.auth.logout();
  }//logout

  public _saveUser(formData) {
    console.log("formdata");
    console.log(formData);
    console.log(formData.specializations);
    const db = this.af.database.object(this.db.users + formData.authUID);
    return db.set(formData)

    //this.router.navigate(['dashboard']);
  }//_saveUser
  public _updateReminders(data, key) {

    //console.log("testing the data and key", data, key)
    const db = this.af.database.object(this.db.scheduledJobs + '/' + key);
    db.set(data).then(
      (item) => {
        //console.log(item);
      }
    );
    return

  }//_updateReminders

  public _deleteReminders(key) {

    const db = this.af.database.object(this.db.scheduledJobs + '/' + key);
    db.remove().then(
      (item) => {
        //console.log(item);
      }
    );
    return

  }//_updateReminders
  public _getDoctorPage(pageId) {
    //console.log(this.db.doctorPages + pageId);
    return this.af.database.object(this.db.doctorPages + pageId);
  }//_findCaredoneByKey

  public _getPatientFitnessData(userID) {
    console.log("input data and params", userID)
    return this.af.database.object(this.db.HumanAPIData + '/' + userID)
  }//get the patient fitness data

  public _saveReminders(data) {
    return this.af.database.list(this.db.scheduledJobs)
      .push(data);
  }//_saveReminders


  public _saveOnboardingReview(data, caredoneId, route) {
    const onboardingdata = this.af.database.object(this.db.onboardingReview + '/' + caredoneId + '/' + route)
    return onboardingdata.set(data);


  }//save onboardingReviewreview data
  public _saveTransactionData(data, objectId, route) {
    console.log(this.db.transactionTable + '/' + objectId + '/' + route);
    const onboardingdata = this.af.database.object(this.db.transactionTable + '/' + objectId + '/' + route)
    return onboardingdata.set(data);


  }//save onboardingReviewreview data
  //get the transactionDate
  public _getTransactionData(objectId) {
    return this.af.database.object(this.db.transactionTable + '/' + objectId);
  }
  //save FbADS Form Data
  public _saveFbAdsFormData(uid, campaignID, data) {
    console.log("saving for ", uid, "campaign being", campaignID, data)
    const FbAdsData = this.af.database.object(this.db.FbCampaign + uid + '/' + campaignID);
    console.log("FbAdsData", FbAdsData)
    return FbAdsData.set(data);
  }//save FbADS Form Data
  public _getFbAdsFormData(uid) {
    return this.af.database.list(this.db.FbCampaign + uid)

  }//save FbADS Form Data
  //save FileUpload Data
  public _saveFileUploadData(uid, data) {
    const FileUploadData = this.af.database.object(this.db.HealthImage + '/' + uid)
    return FileUploadData.set(data);
  }//save FileUpload Data
  public _saveWebContentFootertile(data, sitename) {
    //console.log("the sitenmae for Footer tiles",sitename);
    const webcontentdata = this.af.database.object(this.db.doctorPages + '/' + sitename + '/content/footerTile')
    return webcontentdata.set(data);
  }
    public _saveSocialCalendar(data, uid) {
    //console.log("the sitenmae for Footer tiles",sitename);
    const webcontentdata = this.af.database.object(this.db.socialCalendar + uid )
    return webcontentdata.set(data);
  }


  public _getCheckInDetails(clinicID, date, q) {
    console.log(this.db.checkIns + clinicID + '/' + date + '/' + q);
    return this.af.database.object(this.db.checkIns + clinicID + '/' + date + '/' + q);

  }//fetch the checkin data
  public _getAllCheckIns(clinicID) {
    //console.log(this.db.checkIns + clinicID + '/' + date + '/' + q);
    return this.af.database.object(this.db.checkIns + clinicID);

  }//fetch all the checkin data

  public _getMessengerIds(pageID) {
    //console.log(this.db.checkIns + clinicID + '/' + date + '/' + q);
    return this.af.database.list(this.db.messagingIds + pageID);

  }//fetch the messagingIds data
  public _getCareSchedules(pageID) {
    //console.log(this.db.checkIns + clinicID + '/' + date + '/' + q);
    return this.af.database.list(this.db.careSchedule + pageID);

  }//fetch the messagingIds data
    public _getPatientCareSchedules(pageID, patientId) {
    //console.log(this.db.checkIns + clinicID + '/' + date + '/' + q);
    return this.af.database.list(this.db.careSchedule + pageID + '/' + patientId + '/Paths');

  }//fetch the messagingIds data
  public _getClinicQueue(clinicID, date) {
    //console.log(this.db.queue + clinicID + '/' + date)
    return this.af.database.object(this.db.queue + clinicID + '/' + date + '/q');

  }//fetch the checkin data

  public _getPageID(userID) {
    return this.af.database.object(this.db.users + '/' + userID + '/fbPageId')
  }
  public _setClinicQueue(clinicID, date, q) {
    //console.log(this.db.queue + clinicID + '/' + date)
    const queu = this.af.database.object(this.db.queue + clinicID + '/' + date);
    queu.set({ q });

  }//fetch the checkin data
  public _findPatient(currentUserId, caredoneId) {
    //console.log("the cared patient is ", this.db.patientdetails + currentUserId + '/' + caredoneId)
    return this.af.database.list(this.db.patientdetails + currentUserId + '/' + caredoneId);
  }//_findPatientDetails

  public _saveWebContentBookingtile(data, sitename) {
    //console.log("the sitenmae for hero booking tiles",sitename);
    const webcontentdata = this.af.database.object(this.db.doctorPages + '/' + sitename + '/content/bookingTile')
    return webcontentdata.set(data);


  }//save webcontentBookingTile data
  public _saveWebContentHerotile(data, sitename) {
    //console.log("the sitenmae for hero booking tiles",sitename);
    const webcontentdata = this.af.database.object(this.db.doctorPages + '/' + sitename + '/content/heroTile')
    return webcontentdata.set(data);


  }//save webcontentHeroTile data
  public _saveWebMetaData(data, sitename) {
    //console.log("the sitenmae for hero booking tiles",sitename);
    const webcontentdata = this.af.database.object(this.db.doctorPages + '/' + sitename + '/metaData')
    return webcontentdata.set(data);

  }//save webcontentHeroTile data
    public _putScrollToSection(clinicId, section){
     console.log(this.db.scrollTo  + clinicId + '/scrollTo', section);
      //console.log("insight get function called ",this.db.PatientsInsights +'/'+doctorID+'/'+ userID);
     var scrollTo =  this.af.database.object(this.db.scrollTo  + clinicId + '/scrollTo')
     return scrollTo.set(section);
   }
  public _getMedicalSpecialities() {
    return this.af.database.object(this.db.MedicalSpecialities);
  }
  public _getMedicalVendors() {
    return this.af.database.object(this.db.MedicalVendors);
  }
    public _getMedicalSupport() {
    return this.af.database.object(this.db.MedicalSupport);
  }
  _savePaymentPlans(userId, form) {
    console.log(this.db.PaymentPlans + userId);
     var payments = this.af.database.object(this.db.PaymentPlans + userId);
     return payments.set(form)
  }
  _getSamplePaymentPlans() {
    console.log(this.db.PaymentPlans);
   return this.af.database.object(this.db.SamplePaymentPlans);
     
  }
  _getPaymentPlans(userId) {
    console.log(this.db.PaymentPlans + userId);
     return this.af.database.object(this.db.PaymentPlans + userId);
     
  }
  public _saveWebContentProfiletile(data, sitename) {
    //console.log("the sitenmae for hero booking tiles",sitename);
    const webcontentdata = this.af.database.object(this.db.doctorPages + '/' + sitename + '/content/profileTile')
    return webcontentdata.set(data);
  }//save webcontentProfileTile data
  public _saveSlotBookingDetails(data, sitename, type) {
    //console.log("the route is :",sitename);
    return this.af.database.object(this.db.doctorPages + '/' + sitename + '/availability/' + type )
      .set(data);
  }//save slot booking details data
  public _saveSpecializationDetails(data, sitename) {
    //console.log("the route is :",sitename);
    return this.af.database.object(this.db.doctorPages + '/' + sitename + '/content/specializations')
      .set(data);
  }//save slot booking details data
  //email login 
  createMailUser(details) {

    //console.log("create user details",details)
    this.af.auth.createUser(details)
      .then(res => { //console.log("response value ",res);}

        //       function(user) {
        //         //console.log("user data in firebase",user);
        //       //console.log( user.auth.updateProfile({displayName: details.displayName, photoURL: "./assets/img/man.png"}));
        // //  user.auth.updateProfile({displayName: details.displayName, photoURL: "./assets/img/man.png"});
      }
      )
  }
  loginMailUser(details) {
    //console.log("login details ",details)
    return this.af.auth.login(details,
      {
        provider: AuthProviders.Password,
        method: AuthMethods.Password,
      });
  }//email login 
  public _getPathologicalTests(item) {
    return this.af.database.list(this.db.pathologicalTestDetails + item);
  }

  public _getMedicineNames() {
    return this.medicineList;
  }
  public _getSitePrefilledData() {
    //console.log("herotile path",this.db.website)
    return this.af.database.object(this.db.website);
  }
  public _getSiteData(pathRoute) {
    //console.log("herotile path",this.db.doctorPages + pathRoute + '/content')
    return this.af.database.object(this.db.doctorPages + pathRoute + '/content');
  }
  public _getBackgroundImages() {

    return this.af.database.object(this.db.doctorPages + 'BackgroundImages');
  }
      public _UpdatePeerVideo(transId, status, peerId, role) {
    var update = this.af.database.object(this.db.clinicConsults + transId + '/' + role);
    update.set({
      status: status,
      peerId: peerId
    });
  }
  public _GetPeerVideo(transId, peer) {
    console.log(this.db.clinicConsults + transId + '/' + peer);
    return this.af.database.object(this.db.clinicConsults + transId + '/' + peer);
  }
  public _saveDummyData(data, domainNameShort) {
    const webData = this.af.database.object(this.db.doctorPages + domainNameShort);
    webData.set(data);
  }

  public _saveUserCoverPhoto(uid, cover) {
    return this.af.database.object(this.db.users + uid)
      .update({ cover: cover });
  }//_saveUserCoverPhoto

  public _getCoverPhoto(uid) {

    return this.af.database.object(this.db.users + uid);


  }//_getUserCoverPhoto
  public _getUserId(uid) {
    //console.log(this.db.userIds + uid);

    return this.af.database.object(this.db.userIds + uid);


  }//_saveUserCoverPhoto
  public getUserfromUserTable(uid) {
    return this.af.database.object(this.db.UserTable + uid)
  }


  public _saveCaredOne(data, observerId) {
    const caredones = this.af.database.object(this.db.caredOnes + observerId + '/' + data['uid']);
    return caredones.set(data);
  }//_saveCaredOne
  public _saveHxPathway(data, pathName) {
    const HxPaths = this.af.database.list(this.db.HxPaths);
    return HxPaths.push(data);
  }//_saveCaredOne
  public _saveHxPathName(pathName, id) {
    const HxPaths = this.af.database.object(this.db.HxPathNames + id);
    return HxPaths.set({ path: pathName });
  }//_saveCaredOne
  public _getHxPathName(id) {
    return this.af.database.object(this.db.HxPathNames + id);
    //return HxPaths.set({path: pathName});
  }//_saveCaredOne
  public _getHumanAPIData(patientId) {
    return this.af.database.object(this.db.HumanAPIData + patientId);
    //return HxPaths.set({path: pathName});
  }
  public _saveCarePathway(data, pathName) {
    const carePaths = this.af.database.list(this.db.carePaths);
    return carePaths.push(data);
  }//_saveCaredOne
  public _saveCarePathName(pathName, id) {
    const carePaths = this.af.database.object(this.db.carePathNames + id);
    return carePaths.set({ path: pathName });
  }//_saveCaredOne
  public _saveCareSchedule(pageId, patientId, activationDate, pathName) {
    //console.log({path: pathName, activatedOn: activationDate});
    console.log(this.db.careSched + pageId + '/' + patientId + '/Paths/' + pathName);
    
    const carePaths = this.af.database.object(this.db.careSched + pageId + '/' + patientId + '/Paths/' + pathName);
    return carePaths.set({ path: pathName, activatedOn: activationDate });
  }//_saveCaredOne
  public _getCarePathway() {
    return this.af.database.list(this.db.carePathNames);

  }//_getCarePathways
   public _getPatientUpdates(uid) {
    return this.af.database.list(this.db.patientUpdates + uid);

  }//_getCarePathways
  public _getHxPathway() {
    return this.af.database.list(this.db.HxPathNames);

  }//_getCarePathways
  _setTestPrice(item, partner, TestName, data) {
return this.af.database.object(this.db.pricing + item + '/' + TestName + '/' + partner).set(data)
  }
  public _getCarePath(pathName) {
    return this.af.database.object(this.db.carePaths + pathName);

  }//_getCarePathways
  public _getHxPath(pathName) {
    return this.af.database.object(this.db.HxPaths + pathName);

  }//_getCarePathways

  public _getConsultant(uid){
    return this.af.database.object(this.db.Partners + uid);
  }
  public _getHealthLineData(id) {
    console.log("calling search for Id: ", id, this.db.hlDatabase + id)
    return this.af.database.object(this.db.hlDatabase + id);

  }//_saveCaredOne
   public _saveHealthLineData(id, data) {
    console.log("calling addition for Id: ", id, this.db.hlDatabase + id, data)
    var hlAdd = this.af.database.object(this.db.hlDatabase + id);
    return hlAdd.set(data);
  }//_saveCaredOne
  public _saveWebsite(siteName, docId) {
    const clinicSite = this.af.database.object(this.db.users + docId + '/clinicWebsite');
    return clinicSite.set(siteName);
  }//_saveCaredOne
    public _saveClinicId(clinicId, docId) {
    const clinicSite = this.af.database.object(this.db.users + docId + '/clinicId');
    return clinicSite.set(clinicId);
  }//_saveCaredOne
  public _saveSpecializationsData(siteName, data) {
    const clinicSite = this.af.database.list(this.db.doctorPages + '/' + siteName + '/specializations');
    return clinicSite.push(data);
  }//_saveCaredOne
  public _saveWebsiteSpeciaizations(siteName, data, count) {
    console.log("Adding specialization data for", siteName, count, data)
    const clinicSite = this.af.database.object(this.db.doctorPages + '/' + siteName + '/content/specializations/' + count);
    return clinicSite.set(data);
  }//_saveCaredOne
  public _getWebsiteSpeciaizations(siteName) {
    return this.af.database.list(this.db.doctorPages + '/' + siteName + '/content/specializations');

  }//_saveCaredOne
  public _savePageAccessToken(pageId, accessToken, app_access_token) {
    const clinicSite = this.af.database.object(this.db.pageAccessTokens + pageId);
    return clinicSite.set({ access_token: accessToken, app_access_token: app_access_token });
  }//_savePageAccessToken
  public _saveDoctor(formData) {
    //console.log("formdata");
    //console.log(formData);
    const db = this.af.database.object(this.db.docUsers + formData.authUID);
    db.set(formData)
    //this.router.navigate(['dashboard']);
  }//_saveDoctor


  //get the msg for caredone mobile view form
  public _getmsgFromSendMessage(currentUserId, UserID) {
    //console.log("the id's i have passed here :", currentUserId, UserID);
    return this.af.database.list(this.db.sendMessages + UserID + '/' + currentUserId);
  }
  public _getObserversList(caredOneId) {
    //console.log("i am in firebase and its caredone id:", caredOneId);
    return this.af.database.list(this.db.observers + caredOneId);
  }//_getObserversList
  public _updateCaredOne(observerId, uid, data) {
    return this.af.database.object(this.db.caredOnes + observerId + '/' + uid)
      .update(data)
      ;
  }//_updateCaredOne

  public _updateCaredoneProfile(data, currentUserId, caredOneId) {
    return this.af.database.object(this.db.caredOnes + currentUserId + '/' + caredOneId)
      .update(data);

  }

  public _findOnboardingReview(caredId) {
    return this.af.database.object(this.db.onboardingReview + caredId);
  }//_findCaredoneByKey
  public _findOnboardingReviewItem(caredId, item) {
    //console.log(this.db.onboardingReview+ caredId + '/' + item)
    return this.af.database.list(this.db.onboardingReview + caredId + '/' + item, {
      query: {

        orderByKey: true,
        limitToLast: 1

      }
    });
  }//_findCaredoneByKey

  public _getTermData(item) {
    console.log("query", {
      orderByChild: "_title",
      startAt: item,
      endAt: item + "\uf8ff",
      limitToLast: 10

    });
    //console.log(this.db.onboardingReview+ caredId + '/' + item)
    return this.af.database.list(this.db.hlDbIndex, {
      query: {
        orderByKey: true,
        //equalTo: item,
        startAt: item,
        //endAt:  item+"\uf8ff",
        limitToFirst: 10

      }
    });
  }//_findCaredoneByKey
    public _RequestOTP(number, code) {
    var update = this.af.database.object(this.db.OTPRequests + number );
    update.set({code: code, status: 'requested'});
  }
    public _UpdateOTP(number) {
    var update = this.af.database.object(this.db.OTPRequests + number + '/status');
    update.set('confirmed');
  }
  public getAllMedicalData() {

    return this.af.database.list(this.db.hlDbIndex);
  }//_findCaredoneByKey

  public _findOnboardingReviewItemNext(caredId, item, next) {
    //console.log(this.db.onboardingReview+ caredId + '/' + item)
    //console.log(next - 1);
    var count = parseInt(next) - 1;
    var limitAt = count.toString();
    return this.af.database.list(this.db.onboardingReview + caredId + '/' + item, {
      query: {

        orderByKey: true,
        endAt: limitAt,
        limitToLast: 1



      }
    });
  }//_findCaredoneByKey
  public _findOnboardingReviewItemPrev(caredId, item, next) {
    //console.log(this.db.onboardingReview+ caredId + '/' + item)
    //console.log(next - 1);
    var count = parseInt(next) - 1;
    var limitAt = count.toString();
    return this.af.database.list(this.db.onboardingReview + caredId + '/' + item, {
      query: {

        orderByKey: true,
        startAt: limitAt,
        limitToLast: 1



      }
    });
  }//_findCaredoneByKey
  public _findTestPrice(testName) {
    return this.af.database.object(this.db.testPricing + testName);
  }//obtain price of test

  public _LabDetails(labList) {
    return this.af.database.object(this.db.labDetails + labList);
  }

  public _orderDetails(caredoneId, data) {
    return this.af.database.list(this.db.orderDetails + caredoneId)
      .push(data);
  }

  public _findCaredOne(observerId, uid) {
    //console.log(this.db.caredOnes + observerId + '/' + uid);
    return this.af.database.object(this.db.caredOnes + observerId + '/' + uid);
  }//_findCaredOne

  public _findDiagnosis(observerId, uid) {
    //console.log(this.db.diagnosis + observerId + '/' + uid);
    return this.af.database.object(this.db.diagnosis + observerId + '/' + uid);
  }//_findCaredOne
  public _findPatientHistory(observerId, uid) {
    //console.log(this.db.diagnosis + observerId + '/' + uid);
    return this.af.database.object(this.db.patientHistory + observerId + '/' + uid);
  }//_findCaredOne
  public _findCaredonesDoctor(doctorId) {
    return this.af.database.object(this.db.doctors + doctorId);
  }//_findCaredOne

  public _findCaredOnes(uid) {
    return this.af.database.list(this.db.caredOnes + uid);
  }//_findCaredOne

  public _saveMessage(userID, coID, msg) {
    this.af.database.object(this.db.sendMessages + coID + '/' + userID)
      .set({ message: msg });
  }
  public _saveAppointment(userID, data) {
    this.af.database.object(this.db.appointments + userID)
      .set(data);
  }

  public _fetchUser(uid) {
    //console.log(this.db.users + uid);
    return this.af.database.object(this.db.users + uid).map(
      res => {
        //console.log("from fetchUser");
        //console.log(res);
        if (!res.firstName) {
          //console.log("firstName not found")
          return false;
        } else {
          this._setUserData(res);
          return this.userData;
        }
      }//res
    );
  }//_fetchUser

  public _fetchDocUser(uid) {
    //console.log(this.db.docUsers + uid);
    return this.af.database.object(this.db.docUsers + uid).map(
      res => {
        //console.log(res);
        if (!res.firstName) {
          //console.log("Doctor firstName not found")
          return false;
        } else {
          this._setUserData(res);
          return this.userData;
        }
      }//res
    );
  }//_fetchUser

  public _getUser() {
    return this.af.auth.map(
      response => this._changeState(response)
    );
  }//_getUser



  public _getdoctors() {
    return this.doctorsList;
  }//_getdoctors

  public _getCurrentUser() {
    //console.log(this.userData);
    if (typeof this.userData != "undefined") {
      //console.log(this.userData);
      return this.userData;
    } else {
      //console.log("current user id called");
      return false;
    }


  }//_getCurrentUser

  public _setUserData(userData) {
    this.userData = userData;
  }//_setUserData

  private _changeState(user: any = null) {
    if (user) {
      //console.log("the user value in change state ",user);
      return {
        isAuth: true,
        user: this._getUserInfo(user)
      }
    }
    else {
      return {
        isAuth: false,
        user: {}
      }
    }

  }//_changeState()

  public _getcaredOnesList(observerId) {
    //console.log("getting cared ones for ", observerId)
    //console.log(observerId)
    //console.log(this.af.database.list(this.db.caredOnes + observerId));
    return this.af.database.list(this.db.caredOnes + observerId);
  }//_getcaredOnesList

  public _getcaredByList(caredoneId) {
    //console.log(caredoneId)
    return this.af.database.list(this.db.caredOnes);
  }//_getcaredbyList


  private _getUserInfo(user: any): any {

    if (!user) {
      //console.log("user call if null",user);
      return {};
    }
    //console.log("_getUserInfo",user);
    let data = user.auth.providerData[0];
    //console.log("data val test",data);
    if (data.displayName) {
      return {
        firstName: data.displayName.split(' ')[0],
        lastName: data.displayName.split(' ')[1],
        avatar: "https://graph.facebook.com/" + data.uid + "/picture?type=large",
        email: data.email,
        provider: data.providerId,
        uid: data.uid
      };
    }
    else {
      return {
        email: data.email,
        provider: data.providerId,
        uid: user.uid
      };

    }

  }//_getUserInfo

  public _getMedicationReminders(uid) {
    return this.af.database.list(this.db.medicineReminders + uid);
  }//_getMedicationReminders

  public _getExerciseData(uid) {
    return this.af.database.object(this.db.exerciseTracker + uid + '/Tracker');
  }//_getExerciseData

  public _BloodSugarData(uid) {
    //console.log(this.db.deviceReadings + uid + '/Blood_Sugar');
    return this.af.database.object(this.db.deviceReadings + uid + '/Blood_Sugar/Tracker');
  }//_getBloodSugarData

  public _BloodPressureData(uid) {
    return this.af.database.object(this.db.deviceReadings + uid + '/Blood_Pressure/Tracker');
  }//_getBloodPressureData

  public _getCaredOneInsight(uid) {
    return this.af.database.object(this.db.insights + uid);
  }//_getExerciseData

  public _getConsultations(uid) {
    return this.af.database.list(this.db.consultations + uid);
  }//_getMedicationReminders

  public _getLabTests(uid) {
    return this.af.database.list(this.db.labTests + uid);
  }//_getMedicationReminders

  public _saveObservers(data, coid, caredoneId) {
    return this.af.database.object(this.db.observers + caredoneId + '/' + coid)
      .set(data);
  }

  public _markCaredOneAdded(userId, caredoneId) {
    return this.af.database.object(this.db.cared1Onboarded + userId + '/' + caredoneId)
      .set({ completed: true });
  }

  public _markAddedJob(caredoneId, itemAdded) {
    return this.af.database.object(this.db.onboardingReview + caredoneId + '/' + itemAdded)
      .set('added');
  }
  public _addJobwithCheck(userId, caredoneId, addCheck) {
    return this.af.database.object(this.db.caredOnes + userId + '/' + caredoneId + '/checkToAdd')
      .set(addCheck);
  }
  public _addVirtualCaredOne(caredoneId, data) {
    return this.af.database.object(this.db.virtualCaredOne + caredoneId)
      .set(data);
  }


  public _addVirtualObserver(observerId, data) {
    return this.af.database.object(this.db.virtualObserver + observerId)
      .set(data);
  }

  public _addVirtualCareTaker(caretakerId, data) {
    return this.af.database.object(this.db.virtualCareTaker + caretakerId)
      .set(data);
  }
  public _addCaretaker(data, caredoneId, caretakerFbId, avatar) {

    //console.log(this.db.caretakers + caredoneId + '/' + caretakerFbId);
    data.avatar = avatar;
    //console.log(data);
    return this.af.database.object(this.db.caretakers + caredoneId + '/' + caretakerFbId)
      .set(data);
  }
  public _addPartner(data, userId, route, key) {

    //console.log(this.db.caretakers + caredoneId + '/' + caretakerFbId);

    return this.af.database.object(this.db.Partners + userId + '/' + route + '/' + key)
      .set(data);
  }
  public _getPartner(userId) {

    //console.log(this.db.caretakers + caredoneId + '/' + caretakerFbId);

    return this.af.database.object(this.db.Partners + userId)

  }
    public _savePageAdmin(pageId, data) {

    //console.log(this.db.caretakers + caredoneId + '/' + caretakerFbId);
    var pageDet = this.af.database.object(this.db.PageAdmins + pageId)
    return pageDet.set(data);

  }
  public _updatePageDetails(userID, pageId) {
    var pageDet = this.af.database.object(this.db.users + userID + '/fbPageId')
    return pageDet.set(pageId);
  }
  public _updateWebsitePage(clinicID, pageId) {
    var pageDet = this.af.database.object(this.db.doctorPages + clinicID + '/fbPageId')
    return pageDet.set(pageId);
  }
   public _getOnePartner(userId, consultantId) {

    //console.log(this.db.caretakers + caredoneId + '/' + caretakerFbId);

    return this.af.database.object(this.db.Partners + userId + '/consultant/' + consultantId)

  }
    public _savePartnerName(key, userId, data) {

    //console.log(this.db.caretakers + caredoneId + '/' + caretakerFbId);

    return this.af.database.object(this.db.PartnerIndex + key + '/' + userId)
      .set(data);
  }
      public _savePartnerId(key, userId, doctorId, route) {

    //console.log(this.db.caretakers + caredoneId + '/' + caretakerFbId);

    return this.af.database.object(this.db.Partners + doctorId + '/'+ route + '/' + key + '/uid')
      .set(userId);
  }
  public _savePartnerImage(key, userId, doctorId, route) {

    //console.log(this.db.caretakers + caredoneId + '/' + caretakerFbId);

    return this.af.database.object(this.db.Partners + doctorId + '/'+ route + '/' + key + '/img')
      .set("https://graph.facebook.com/" + userId + "/picture?type=large");
  }
  public _searchPartner(phone) {

    //console.log(this.db.caretakers + caredoneId + '/' + caretakerFbId);

    return this.af.database.object(this.db.PartnerIndex + phone)

  }
  public _getCaredOneJobs(caredoneId) {
    return this.af.database.list(this.db.scheduledJobs, {
      query: {
        orderByChild: 'Job_For',
        equalTo: caredoneId
      }
    });
  }
  public _getCarePathNames(carePathName) {
    return this.af.database.list(this.db.carePaths, {
      query: {
        orderByChild: 'name',
        equalTo: carePathName
      }
    }).first();
  }
  public _getHxPathNames(carePathName) {
    return this.af.database.list(this.db.HxPaths, {
      query: {
        orderByChild: 'name',
        equalTo: carePathName
      }
    }).first();
  }
  public _getHealthReports(uid) {
    console.log(this.db.healthReports + uid);
    //console.log("uid data:", uid);
    //console.log("url", this.db.healthReports + uid);
    return this.af.database.object(this.db.healthReports + uid);
  }//_getHealthReports

  public _saveHealthReports(data, caredoneId, index) {
    if (index == null || index == undefined)
      index = 0;
    return this.af.database.object(this.db.healthReports + caredoneId + '/' + index)
      .set(data);
  }


}//AuthService

