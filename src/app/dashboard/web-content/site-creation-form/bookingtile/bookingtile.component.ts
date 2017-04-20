import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators,FormArray} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/firebaseauth.service";
import {FbService} from "../../../../services/facebook.service";

@Component({
  selector: 'app-bookingtile',
  templateUrl: './bookingtile.component.html',
  styleUrls: ['./bookingtile.component.css']
})
export class BookingtileComponent implements OnInit {
   @Input () bookingtiles:any; 
    private bookingTile:FormGroup;
    private bookingTileAdded:boolean=false;
  constructor(
              private _fb: FormBuilder,
              private _fs: FbService,
              private route: ActivatedRoute,
              private _authService: AuthService,
              private router: Router
  ) { }


  ngOnInit() {
     if (this.bookingtiles)
      {  
        // console.log("bookingtiles data in bookingtiles component",this.bookingtiles);
         this.bookingTile=this._fb.group({
      title:[this.bookingtiles.title,Validators.required],
      tile:[this.bookingtiles.booking.tile,Validators.required],
      fee:[this.bookingtiles.fee,Validators.required],
      about:[this.bookingtiles.booking.text,Validators.required],
      card_title:[this.bookingtiles.booking.title,Validators.required],
      booking_text:[this.bookingtiles.text,Validators.required],
      fileUpload:[this.bookingtiles.booking.fileUpload,Validators.required],
      bg_Pic:[this.bookingtiles.bgImage,Validators.required]
    });
      }
      else{
         this.bookingTile=this._fb.group({
      title:["your main tile ",Validators.required],
      fee:["fee u will charge",Validators.required],
      tile:["some thing about the tile",Validators.required ],
      about:["tell us something about booking",Validators.required],
      card_title:["card title ",Validators.required],
      booking_text:["put booking tiltle",Validators.required],
      fileUpload:[true,Validators.required],
      bg_Pic:[false,Validators.required]
    
        });
      }
  }
  save_bookingTile=(model)=>{
    //  console.log("save_bookingTile Method called");
      let reminder = {},
      job = model['value'];
      reminder['title']=job['title']
      reminder['fee']=job['fee'],
      reminder['tile']=job['tile'],
      reminder['about']=job['about'],
      reminder['card_title']=job['card_title'],
      reminder['biiking_text']=job['booking_text'],
      reminder['fileUpload']=job['fileUpload'],
      reminder['bg_Pic']=job['bg_Pic']
      this.bookingTileAdded=true;
        console.log("reminder value bookingtiles :",reminder);
        this._authService._saveWebContent(reminder,'bookingTile').then(
      res =>{
          let d=res;
          console.log("response of booking tile data",d);
      })


  }

}
