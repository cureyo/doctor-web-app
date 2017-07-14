import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response, Headers } from '@angular/http';
import { AuthService } from "../../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { PatientDetailFormComponent } from '../../PatientDetailForm/PatientDetailForm.component';
import { PatientPreviewComponent } from "../../PatientPreview/PatientPreview.component"

declare var $: any

@Component({
  selector: 'assign-iframe-form',
  templateUrl: 'assign-iframe.component.html',
  moduleId: module.id
})

export class AssigniFrameComponent implements OnInit {
  // @Input() patientExistingPaths: any;
  // @Input() patientId: any;
  // @Input() firstName: any;
 private clinicIDNew: any;
  private patientPathsExist: boolean = false;
  private carePlanForm: FormGroup;
  private pageId: any;
  private doctorId: any;
  private patientId: any;
  private caredone: any;
  private ready: boolean = false;
  constructor(public pform: PatientDetailFormComponent, private _authService: AuthService, private router: ActivatedRoute) { }
  [name: string]: any;
  showPaths: boolean = false;
  ngOnInit() {
    this._authService.loginMailUser({ email: "omni-user@cureyo.com", password: "pass9967092749" })
      .then(
      data => {
        console.log(data);
        this.router.params.subscribe(
          params => {

            this.pageId = params['pageId'];
            this.doctorId = params['doctorId'];
            this.patientId = params['patientId']
            console.log(params);
            console.log(this.pageId, this.doctorId, this.patientId)
            this._authService._getPageAdmin(this.pageId)
            .subscribe(
              pageDate => {
                this._authService._findCaredOne(this.doctorId, this.patientId)
              .subscribe(
              data => {
                this.caredone = data;
                this.clinicIDNew = pageDate.clinicId;
                this.ready = true;
              });
              }
            )
            
          }
        )
      }
      )

  }

}