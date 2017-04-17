import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Caredone } from "../../models/caredone.interface";
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from "../home/home.component";

declare var $: any

@Component({
  selector: 'app-caredone-form',
  templateUrl: 'caredone-form.component.html',
  moduleId: module.id
})

export class CaredoneFormComponent implements OnInit {

  @Input() observerId: string;
  @Input() user: any;

  private caredone: FormGroup;
  private coMsgForm: FormGroup;
  private relationships: any = [];
  private temp: any;
  private vData: any;
  private showErrorFlag: boolean = false;
  private showErrorFlag2: boolean = false;
  private currentUser: any;
  private caredOneAdded: boolean = false;
  private coMessage: any;
  private caredOneId: any;
  private nickName: any;
  private phoneNumber: any;
  private cbTime: any = [];
  private cbDay: any = [];
  private caredOneModel: any;
  private checkBox: boolean = false;

  constructor(private _fb: FormBuilder, private _authService: AuthService, private router: Router, private home: HomeComponent) {
    this.relationships.push(
      '',
      'mother',
      'father',
      'wife',
      'husband',
      'brother',
      'sister',
      'grandfather',
      'grandmother',
      'son',
      'daughter',
      'uncle',
      'aunt',
      'nephew',
      'niece',
      'friend',
      'self'
    );

    this.cbTime.push(
      '',
      '9:00AM',
      '9:30AM',
      '10:00AM',
      '10:30AM',
      '11:00AM',
      '11:30AM',
      '12:00PM',
      '12:30PM',
      '1:00PM',
      '1:30PM',
      '2:00PM',
      '2:30PM',
      '3:00PM',
      '3:30PM',
      '4:00PM',
      '4:30PM',
      '5:00PM',
      '5:30PM',
      '6:00PM',
      '6:30PM',
      '7:00PM',
      '7:30PM',
      '8:00PM',
      '8:30PM',
      '9:00PM',
      '9:30PM',
      '10:00PM',
      '10:30PM'
    );
    var today = new Date();
    var tomorrow = new Date(today.getTime() + (1000 * 60 * 60 * 24));
    var dayAfter = new Date(tomorrow.getTime() + (1000 * 60 * 60 * 24));

    this.cbDay.push(
      '',
      tomorrow,
      dayAfter
    )

  }

  ngOnInit() {
    //console.log("Cared one form called");
    //$('#myModal').hide();
    this.temp = Math.floor((Math.random() * 1000000000) + 1);
    if (this.user.directAdd == "mail") {
      //console.log(this.user);
      this.caredone = this._fb.group({
        firstName: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
        lastName: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
        nickName: ['', Validators.required],
        email: ['', Validators.required],
        avatar: [this.user.imageURL],
        age: [''],
        phone: ['', Validators.required],
        hometown: [''],
        // address: [''],
        gender: [''],
        uid: [this.temp, Validators.required],
        relationship: ['', Validators.required],
        messagingChannel: ['fb_messenger', Validators.required],
        authProvider: 'email',
        authUID: [this.temp, Validators.required]
      });
    }
    else if (this.user.directAdd == "self") {
      this.currentUser = this._authService._getCurrentUser();
      //console.log(this.user);
      this.caredone = this._fb.group({
        firstName: [this.currentUser.firstName, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
        lastName: [this.currentUser.lastName, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
        nickName: ['Self'],
        email: [this.currentUser.email],
        avatar: [this.currentUser.avatar],
        age: [this.currentUser.age],
        phone: [this.currentUser.phone],
        hometown: [this.currentUser.hometown],
        //address: [''],
        gender: [this.currentUser.gender],
        uid: [this.currentUser.authUID],
        relationship: ['self'],
        messagingChannel: ['fb_messenger'],
        authProvider: 'facebook',
        authUID: [this.currentUser.authUID]
      });


    }
    else {
      //console.log(this.user);
      this.caredone = this._fb.group({
        firstName: [this.user.name.split(' ')[0], Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
        lastName: [this.user.name.split(' ')[1], Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
        nickName: ['', Validators.required],
        email: ['', Validators.required],
        avatar: ['https://graph.facebook.com/' + this.user.id + '/picture?type=large'],
        age: [''],
        phone: ['', Validators.required],
        hometown: [''],
        // address: [''],
        gender: [''],
        uid: [this.user.id, Validators.required],
        relationship: [this.user.relationship, Validators.required],
        messagingChannel: ['fb_messenger', Validators.required],
        authProvider: 'facebook',
        authUID: [this.user.id, Validators.required]
      });
    }


  }
  cancelACO(event) {
    let target = event.target || event.srcElement || event.currentTarget,
      parent = $(target).closest('.card-stats'),
      details = parent.find('.card-content2');

    event.preventDefault();
    details.addClass('hide').find('.fields').empty();
    parent.removeClass('active');
    parent.find('.card-footer').removeClass('hide');
    $('html,body').animate({ scrollTop: $("#AddSection").offset().top - 200 }, 500);

    // $('#findandadd').scrollTop();
  }// cancelACO

  completeACO(event) {
    let target = event.target || event.srcElement || event.currentTarget,
      parent = $(target).closest('.card-stats'),
      details = parent.find('.card-content2');

    event.preventDefault();
    details.addClass('hide').find('.fields').empty();
    parent.removeClass('active');
    parent.find('.card-footer').removeClass('hide');
    $('html,body').animate({ scrollTop: $("#coSection").offset().top - 200 }, 500);
    //this.cancelACO(event);
    // $('#findandadd').scrollTop();
  }// cancelACO

  showError() {
    console.log("clicked");
    this.showErrorFlag = true;
  }
  showError2() {
    console.log("clicked");
    this.showErrorFlag2 = true;
  }
  onSubmit(model, event) {
    //console.log(model);
    //console.log("model");
    this.caredOneId = model['uid']

    if (model['avatar'] == "/assets/img/man.png" && model['gender'] != 'Male') {
      model['avatar'] = "/assets/img/woman.png"
    }
    model['checkToAdd'] = false;
    this.caredOneModel = model;
    this.vData = { caredBy: this.observerId, phone: model['phone'] };

    this._authService._addVirtualCaredOne(model['uid'], this.vData);
    this.showErrorFlag = false;
    if (model['uid'] == this.observerId) {

      this._authService._saveCaredOne(this.caredOneModel, this.observerId);
      //TEMPORARY - Adding as Cared One to Cureyo Panel Doctor - Dr Sharma - 1257144660979093
      this._authService._saveCaredOne(this.caredOneModel, '1257144660979093');
      //TEMPORARY-END

     this.home.showModal('#myModal', this.caredOneId);
        //$('#myModal').show();
        this.completeACO(event);
    }
    else {
      this.phoneNumber = model['phone'];
    this.nickName = model['nickName'];
    this.caredOneAdded = true;
    this.coMessage = model['nickName'] + ", I added you on a platform called Cureyo to help us manage your health. The team will reach out to you for your medical reports and to plan your health needs. Please cooperate with them.";
    this.caredone.reset();
    console.log(this.coMessage);
    this.coMsgForm = this._fb.group({
      message: this.coMessage,

    });
    }
 
  }


  onSubmitMsg(model, event) {
    console.log(model)

    this.coMsgForm.reset();
    this.caredOneAdded = false;
    //window.open('whatsapp://send?text=' + model['message'], '_blank');
    this._authService._saveMessage(this.observerId, this.caredOneId, model['message']);
    // if (this.checkBox) {
    //     var apptData = { aptWith: 'CureyoDoctor', aptFor: this.observerId, type: 'Debrief', subject: this.caredOneId, purpose: 'Health assessment debrief for ' + this.nickName };
    // this._authService._saveAppointment(this.observerId, apptData);
  
    // }
    $.notify({
      icon: "notifications",
      message: "Page link sent to your mobile. Please check SMS or Messenger."

    }, {
        type: 'cureyo',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'right'
        }
      });

    this._authService._saveCaredOne(this.caredOneModel, this.observerId)

     //TEMPORARY - Adding as Cared One to Cureyo Panel Doctor - Dr Sharma - 1257144660979093
      this._authService._saveCaredOne(this.caredOneModel, '1257144660979093');
      //TEMPORARY-END

     this.home.showModal('#myModal', this.caredOneId);
        //$('#myModal').show();
        this.completeACO(event);
    // var elmnt = document.getElementById("coSection");

    // elmnt.scrollIntoView();


  }
  whatsapp(model, event) {
    console.log(model)
    this.coMsgForm.reset();
    this.caredOneAdded = false;
    // if (this.checkBox) {
    //    var apptData = { aptWith: 'CureyoDoctor', aptFor: this.observerId, type: 'Debrief', subject: this.caredOneId, purpose: 'Health assessment debrief for ' + this.nickName };
    // this._authService._saveAppointment(this.observerId, apptData);
   
    // }
   

    this._authService._saveCaredOne(this.caredOneModel, this.observerId)

     //TEMPORARY - Adding as Cared One to Cureyo Panel Doctor - Dr Sharma - 1257144660979093
      this._authService._saveCaredOne(this.caredOneModel, '1257144660979093');
      //TEMPORARY-END

     this.home.showModal('#myModal', this.caredOneId);
        //$('#myModal').show();
        this.completeACO(event);
        document.location.href = 'whatsapp://send?text=' + model['message'];
    // var elmnt = document.getElementById("coSection");

    // elmnt.scrollIntoView();


  }
  call(model, event) {

    this.coMsgForm.reset();
    this.caredOneAdded = false;
    // if (this.checkBox) {
    //      var apptData = { aptWith: 'CureyoDoctor', aptFor: this.observerId, type: 'Debrief', subject: this.caredOneId, purpose: 'Health assessment debrief for ' + this.nickName };
    // this._authService._saveAppointment(this.observerId, apptData);
 
    // }
   // window.open('tel:' + this.phoneNumber);
   
    this._authService._saveCaredOne(this.caredOneModel, this.observerId)

     //TEMPORARY - Adding as Cared One to Cureyo Panel Doctor - Dr Sharma - 1257144660979093
      this._authService._saveCaredOne(this.caredOneModel, '1257144660979093');
      //TEMPORARY-END

    this.home.showModal('#myModal', this.caredOneId);
        //$('#myModal').show();
        this.completeACO(event);
        document.location.href = 'tel:' + this.phoneNumber;
  }
  detectmob() {
    // console.log(window.innerWidth)
    // console.log(window.innerHeight)
    if (window.innerWidth <= 800 && window.innerHeight <= 800) {
      console.log("small screen")
      return true;
    } else {
      return false;
    }
  }
  checkBoxClick() {
    this.checkBox = !this.checkBox;
  }

}
