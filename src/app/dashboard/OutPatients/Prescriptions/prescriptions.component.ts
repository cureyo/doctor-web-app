import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response } from '@angular/http';
import { AuthService } from "../../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any

@Component({
  selector: 'prescription-cmp',
  templateUrl: 'prescriptions.component.html',
  moduleId: module.id
})

export class PrescriptionsComponent implements OnInit {
  [name: string]: any;
  @Input() patientId: any;
  @Input() prescriptionId: any;
  @Input() doctorId: any;

  private caredone: any;
  private outPatient: FormGroup;
  private selectOutPatient: boolean = false;
  private routeparam: any;

  private userId: any;
  private userData: any;
  private appointmentList: any;
  private showCalClicked: any = [];


  constructor(private _fb: FormBuilder, private _authService: AuthService, private router: Router, private http: Http,
  ) {


  }

  ngOnInit() {


  }

}


