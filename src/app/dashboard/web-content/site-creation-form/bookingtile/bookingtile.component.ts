import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../services/firebaseauth.service";
import { FbService } from "../../../../services/facebook.service";

@Component({
  selector: 'app-bookingtile',
  templateUrl: './bookingtile.component.html',
  //styleUrls: ['./bookingtile.component.css']
})
export class BookingtileComponent implements OnInit {
  @Input() routeparam: any;
  @Input() bookingtiles: any;
  private bookingTile: FormGroup;
  private bookingTileAdded: boolean = false;
  private sitename: any;
  private temp: any;
  constructor(
    private _fb: FormBuilder,
    private _fs: FbService,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router
  ) { }


  ngOnInit() {
    if (this.bookingtiles) {
      // //console.log("bookingtiles data in bookingtiles component",this.bookingtiles);
      this.bookingTile = this._fb.group({
        title: [this.bookingtiles.title, Validators.required],
        tile: [this.bookingtiles.booking.tile, Validators.required],
        fee: [this.bookingtiles.fee, Validators.required],
        about: [this.bookingtiles.booking.text, Validators.required],
        card_title: [this.bookingtiles.booking.title, Validators.required],
        booking_text: [this.bookingtiles.text, Validators.required],
        fileUpload: [this.bookingtiles.booking.fileUpload, Validators.required],
        bg_Pic: [this.bookingtiles.bgImage, Validators.required]
      });
    }
    else {
      this.bookingTile = this._fb.group({
        title: ["your main tile ", Validators.required],
        fee: ["fee u will charge", Validators.required],
        tile: ["some thing about the tile", Validators.required],
        about: ["tell us something about booking", Validators.required],
        card_title: ["card title ", Validators.required],
        booking_text: ["put booking tiltle", Validators.required],
        fileUpload: [true, Validators.required],
        bg_Pic: [false, Validators.required]

      });
    }
  }
  save_bookingTile = (model) => {
    //  //console.log("save_bookingTile Method called");
    let job = model['value'];
    // reminder['title'] = job['title']
    // reminder['fee'] = job['fee'],
    //   reminder['tile'] = job['tile'],
    //   reminder['about'] = job['about'],
    //   reminder['card_title'] = job['card_title'],
    //   reminder['biiking_text'] = job['booking_text'],
    //   reminder['fileUpload'] = job['fileUpload'],
    //   reminder['bg_Pic'] = job['bg_Pic']
    let reminder = {
      title: job['title'], 
      text: job['booking_text'],
      bgImage: job['bg_Pic'],
      fee: job['fee'],
      booking: {
        tile: job['tile'],
        title: job['card_title'],
        text: job['about'],
        fileUpload: job['fileUpload']
      }
    };
    this.bookingTileAdded = true;
    //console.log("reminder value bookingtiles :", reminder);
    this.temp = Math.floor((Math.random() * 100000) + 1);
    //console.log("temp number :", this.temp);
    //remove .com from url
    var n = this.routeparam.indexOf(".")
    if (n == -1) {
      n = this.routeparam.length;
    }
    this.sitename = this.routeparam.substring(0, n);
    //end of url trimming part
    this._authService._saveWebContentBookingtile(reminder, this.sitename).then(
      res => {
        let d = res;
        //console.log("response of booking tile data", d);
      })


  }

}
