
import { Component, OnInit, ViewChild , Input} from '@angular/core';
import { AuthService } from "../../services/firebaseauth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
declare var Peer: any;
@Component({
  selector: 'video-call-cmp',
  templateUrl: './video-call.component.html'
})
export class VideoCallComponent implements OnInit {

  //@ViewChild('myvideo') myVideo: any;
  @Input() videoCon: any;
  @ViewChild('peerVideo') peerVideo: any;

  peer;
  anotherid;
  mypeerid;
  private sendNote: FormGroup;
  private messages: any;
  private messageIndex: any = 0;
  private transId: any;
  private token: any;
  private userId: any;
  private messagesReady: boolean = false;
  private peerReady: boolean = false;
  private reports: any = [];
  private clinicId: any;
  private isDoctor: boolean = false;
  private hasReports: boolean = false;
  private onCall: boolean = false;
  private selfStream: any;
  private peerStream: any;
  


  constructor(private _fb: FormBuilder, private route: ActivatedRoute, private _authService: AuthService, private router: Router) {

  }

  ngOnInit() {
    $('textarea').keypress(function (event) {
      if (event.which == 13) {
        event.preventDefault();
        var s = $(this).val();
        $(this).val(s + "\n");
      }
    });
 
    this.route.queryParams.subscribe(
      qParams => {
        this.token = qParams['token'];
        this.userId = qParams['userId'];
      }
    )
    let video = this.peerVideo.nativeElement;
    //let myVideo = this.myVideo.nativeElement;
   this.peer = new Peer({host: 'cureyo.in', path: '/peerjs'});
    console.log(this.peer);
    setTimeout(() => {
      this.mypeerid = this.peer.id;
      
          let param = this.videoCon;
          this.transId = param;

          // this._authService._getUser()
          //   .subscribe(
          //   data => {
          //     console.log(data)

              console.log(window.location);
              var str = window.location.hostname;
              console.log(str);
              var n = str.indexOf(".");
              if (n == -1) {
                n = str.length;
              }
              console.log(n);
              var res = str.substring(0, n);
              this.clinicId = res;
              console.log("location", res);
              // this._authService._GetDoctorDetails(res)
              //   .subscribe(
              //   drData => {
                  // let docData = drData.drEmail;
                  // console.log(docData);
              
                    this._authService._UpdatePeerVideo(param, 'joined', this.mypeerid, 'doctor');
                    this._authService._GetPeerVideo(param, 'patient')
                      .subscribe(
                      peerData => {
                        console.log(peerData);
                        if (peerData.peerId) {
                          this.anotherid = peerData.peerId;
                          //this.connect();
                          //this.videoconnect();
                          this.peerReady = true;
                          console.log(this.peerReady);
                          this.isDoctor = false;
                          //this.myVideoConnect();
                        }
                      });
                  

                  // this._authService._GetSharedReports(res, this.transId)
                  //   .subscribe(
                  //   reports => {
                  //     if (reports[0]) {
                  //       this.reports = reports;
                  //       console.log(this.reports);
                  //       this.hasReports = true;
                  //     }

                  //   }
                  //   )
                



            
       
    }, 3000);
    // for answering incoming call
    this.peer.on('connection', function (conn) {
      conn.on('data', function (data) {
        console.log(data);
        self.onCall = true;
      });
    });

    var n = <any>navigator;
    var self = this;
    n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
    //share your own video stream on receiving a call
    this.peer.on('call', function (call) {

      n.getUserMedia({ video: true, audio: true }, function (stream) {
        call.answer(stream);
        self.peerStream = stream;
        console.log(self.peerStream);
        call.on('stream', function (remotestream) {
          video.src = URL.createObjectURL(remotestream);
          video.play();

          self.onCall = true;
        })
      }, function (err) {
        console.log('Failed to get stream', err);
      })
    })
  }

  connect() {

    var self = this;
    console.log(this.anotherid)
    var conn = this.peer.connect(this.anotherid);
    conn.on('open', function () {
      conn.send('Message from that id');
      self.videoconnect();
      self.onCall = true;
    });
  }

  videoconnect() {
    let video = this.peerVideo.nativeElement;
    var localvar = this.peer;
    var fname = this.anotherid;
    var self = this;

    var n = <any>navigator;

    n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);

    n.getUserMedia({ video: true, audio: true }, function (stream) {
      //make a call to the peer id
      var call = localvar.call(fname, stream);
      self.selfStream = stream;
      console.log(self.selfStream);
      console.log(call);
      call.on('stream', function (remotestream) {
        video.src = URL.createObjectURL(remotestream);
        console.log(video);
        video.play();
        self.onCall = true;


      })

      //call.on('close', localvar.destroy())
    }, function (err) {
      console.log('Failed to get stream', err);
    })
  }

  closevideo() {
    console.log(this.selfStream);
    console.log(this.peerStream);
    var currentStream = [];
    if (this.selfStream) {
      let strms = this.selfStream.getTracks().length, ctr = 0;
      for (ctr = 0; ctr < strms; ctr++) {
        this.selfStream.getTracks()[ctr].stop();
      }
      console.log(this.selfStream);
    }

    if (this.peerStream) {
      let strms = this.peerStream.getTracks().length, ctr = 0;
      for (ctr = 0; ctr < strms; ctr++) {
        this.peerStream.getTracks()[ctr].stop();
      }
      console.log(this.peerStream);
    }
    var fname = this.anotherid;
    var localvar = this.peer;

    let video = this.peerVideo.nativeElement;
    video.pause();
    video.src = null;



    console.log(currentStream);
    this.onCall = false;
    //this.router.navigate(['feedback/' + this.token + '/' + this.userId]);
    // var MediaStream = window.navigator.getUserMedi
  }

  connectMe() {
    var conn = this.peer.connect(this.mypeerid);
    console.log(conn)
    conn.on('open', function () {
      conn.send('Message from that id');
    });
  }
  onSubmit(message, event) {
    let date = new Date();
    let msg = { message: message, time: date, sender: 'doctor' }
    //this._authService._SendMessage(this.transId, msg, this.messageIndex);
  }
  newLine(event) {
    console.log(event);
    event.preventDefault();
    var s = $(this).val();
    $(this).val(s + "\n");
  }
}