import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response, Headers } from '@angular/http';
import { AuthService } from "../../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { PatientDetailFormComponent } from '../../PatientDetailForm/PatientDetailForm.component';
import { PatientPreviewComponent } from "../../PatientPreview/PatientPreview.component"

declare var $: any

@Component({
    selector: 'assign-pathway-form',
    templateUrl: 'assign-pathway.component.html',
    moduleId: module.id
})

export class AssignPathwayComponent implements OnInit {
    // @Input() patientExistingPaths: any;
    @Input() patientId: any;
    @Input() firstName: any;
    @Input() clinicIDNew: any;
    @Input() pageId: any;
    @Input() doctorId: any;
    private carePathsAvlbl: any;
    private patientExistingPaths: any;
    private patientPathsExist: boolean = false;
    private carePlanForm: FormGroup;
    constructor(public pform: PatientDetailFormComponent, private _fb: FormBuilder, private _authService: AuthService) { }
    [name: string]: any;
    showPaths: boolean = false;
    ngOnInit() {
        // if (this.patientExistingPaths)
        //     this.patientPathsExist = true;
        // else
        //     this.patientPathsExist = false;
        this.carePlanForm = this._fb.group({
            formname: [, Validators.required]
        })
        this._authService._getCarePathway()
            .subscribe(
            data => {
                //console.log(data);
                this.carePathsAvlbl = data;
                //console.log(this.carePathsAvlbl)
                this._authService._getPatientCareSchedules(this.pageId, this.patientId)
                    .subscribe(
                    data => {
                        this.patientExistingPaths = data;
                        console.log(this.patientExistingPaths);
                        if (this.patientExistingPaths[0]) {
                            //console.log("this.pform.carePathsAvlbl", this.pform.carePathsAvlbl)
                            for (let each in this.patientExistingPaths) {
                                this.patientExistingPaths[each]['name'] = this.carePathsAvlbl.filter(item => item.$key === this.patientExistingPaths[each].path)[0];
                            }
                            console.log(this.patientExistingPaths);
                            this.patientPathsExist = true;
                        } else {
                            this.patientPathsExist = false;
                        }
                    }
                    )
            }
            )
    }
    showCarePathsAdd() {
        console.log(this.showPaths);
        this.showPaths = !this.showPaths;
    }
    // save observers data:
    saveCarePlan(patientID, carePathId, userName, clinicIdNew) {
        var today = new Date();
        console.log("saving care plan", patientID, carePathId, userName, clinicIdNew);
        console.log(this.carePathsAvlbl);
        var name = this.carePathsAvlbl.filter(item => item.$key === carePathId)[0];
        var todate = today.toString();
        this._authService._saveCareSchedule(this.pageId, patientID, todate, carePathId)
            .then(
            data => {
                console.log(data);
                this._authService._saveCarePathwayUser(this.doctorId, patientID, carePathId)
                    .then(
                    data2 => {
                        console.log("(this.doctorId)", this.doctorId)
                        this._authService.getUserfromUserTable(this.doctorId)
                            .subscribe(
                            docData => {
                            console.log("docData", docData)
                                console.log("data2", data2)
                                let todate2 = new Date();
                                let toTime2 = todate2.getTime();
                                this._authService._saveActivePathways(patientID, clinicIdNew, 'Physical', carePathId, toTime2)
                                    .then(
                                    data3 => {
                                        var updtJSON = {
                                            "actions": {
                                                "chat": ["patient", docData.phone]
                                            },
                                            "description": "Care Pathway, " + name.path + " has been initiated on " + todate,
                                            "icon": 'local_hospital',
                                            "partnerId": docData.phone,
                                            "status": "completed",
                                            "time": todate,
                                            "title": "Care Pathway, " + name.path + " initiated"
                                        };
                                        this._authService._savePatientUpdate(patientID, carePathId, toTime2, updtJSON)
                                            .then(
                                            data4 => {
                                                console.log(data);
                                                $.notify({
                                                    icon: "notifications",
                                                    message: "Care Plan '" + name.path + "' has been attached to " + userName

                                                }, {
                                                        type: 'cureyo',
                                                        timer: 4000,
                                                        placement: {
                                                            from: 'top',
                                                            align: 'right'
                                                        }
                                                    });
                                            }
                                            )

                                    }
                                    )
                            }
                            )


                    }
                    )


            }
            )
    }
}