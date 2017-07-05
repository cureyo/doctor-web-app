import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response, Headers } from '@angular/http';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';


declare var $: any


@Component({
    selector: 'partner-cmp',
    templateUrl: 'partners.component.html',
    moduleId: module.id
})

export class PartnerComponent implements OnInit {
    [name: string]: any;

    private caredone: any;
    private section: any = "partners";
    private partnerForm: FormGroup;
    private selectDrDomain: boolean = false;
    private caredOneId: any;
    private displayDrDomain: boolean = false;
    private array: any;
    private routeparam: any;
    private availableName: any;
    private formReady: boolean = false;
    private consultantsPresent: boolean = false;
    private vendorsPresent: boolean = false;
    private addingConsultant: boolean = true;
    private addingVendor: boolean = false;
    private addingSupport: boolean = false;
    private sitename: any;
    private types: any = [];
    private currentConsultants: any = [];
    private currentVendors: any = [];
    private userId: any;
    private medSpecialities: any = [];
    private medVendors: any = [];
    private medSupport: any = [];
    //private nextButtonFlag:boolean=false;


    constructor(
        private _fb: FormBuilder,
        private _authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private http: Http) {


    }

    ngOnInit() {


        //     this.route.params.subscribe(
        //     params => {
        //     this.route.queryParams.subscribe(
        //      qParam=> {
        //        if (qParam['onboarding']=="yes") {
        //          this.nextButtonFlag=true;
        //        }
        //      }
        //     )
        //     //console.log("param value test:",this.routeparam);
        //     //end of param
        //   });
        this.getMedicalSpecialities();
        this.getMedicalVendors();
        this.getMedicalSupport();
        this._authService._getUser()
            .subscribe(
            data => {
                this.formReady = true;

                this.partnerForm = this._fb.group({
                    name: ['', Validators.required],
                    type: ['', Validators.required],
                    email: ['', Validators.required],
                    phone: ['', Validators.required],
                    speciality: ['', Validators.required],
                    fee: [''],
                    icon: [''],
                    img: [''],
                    message: ['Hi! I am adding you to Cureyo as a partner. Once you register, we can easily manage referrals online.', Validators.required]
                });
                this.userId = data.user.uid;

                this._authService._getPartner(data.user.uid)
                    .subscribe(
                    partnerList => {
                        console.log(partnerList);
                        let partnersC = [], partnersV = [];
                        if (partnerList['consult']) {
                            let ctr = 0;
                            let consultants = partnerList['consult'];
                            console.log(partnerList['consult']);
                            for (let item in consultants) {

                                console.log(item)
                                if (item != 'length' && item != '$exists' && item != '$key' && consultants[item].name != 'self') {
                                    partnersC[ctr] = consultants[item];
                                    ctr++
                                }

                            }
                            this.currentConsultants = partnersC;
                            this.consultantsPresent = true;
                        }



                        if (partnerList['vendors']) {
                            let ctr = 0;
                            let vendor = partnerList['vendors'];
                            for (let item in vendor) {

                                console.log(item)
                                if (item != 'length' && item != '$exists' && item != '$key') {
                                    partnersV[ctr] = vendor[item];
                                    ctr++
                                }
                            }
                            console.log(partnersV);
                            this.currentVendors = partnersV;
                            this.vendorsPresent = true;

                        }



                    }
                    )

            });
    }
    addPartner(form) {
        let model = form.value;
        console.log(model);
        let type = model['type'];
        if (type == "support") {
            type = "consult";
            model['type'] = "consult";
        }
        // model['icon'] = this.types[model['type']].icon;
        // model['type'] = this.types[model['type']].name;
        // model['category'] = type;
        let types = {
            "Dietician": "restaurant_menu",
            "Physiotherapist": "accessibility",
            "Physical Medicine & Rehabilitation": "directions_run",
            "Physical Therapist": "directions_run",
            "Fitness Instructor": "directions_run",
            "Pharmacy": "toll",
            "Psychologist": "local_library",
            "Counsellor": "local_library",
            "Pathological Lab": "invert_colors",
            "Radiological Lab": "settings_overscan",
            "Ultrasound Center": "settings_overscan",
            "X-ray Center": "settings_overscan"

            };
        console.log(types[model['speciality']]);
        console.log(model['speciality']);
        if (types[model['speciality']]) {
            model['icon'] = types[model['speciality']];
        } else {
            model['icon'] = "local_hospital"
        }


        this._authService._addPartner(model, this.userId, type, model.phone).then(
            data => {
                console.log(data);
                this._authService._savePartnerName(model.phone, this.userId, model);
                this.partnerForm = this._fb.group({
                    name: ['', Validators.required],
                    type: ['', Validators.required],
                    email: ['', Validators.required],
                    phone: ['', Validators.required],
                    speciality: ['', Validators.required],
                    fee: [''],
                    icon: [''],
                    img: [''],
                    message: ['Hi! I am adding you to Cureyo as a partner. Once you register, we can easily manage referrals online.', Validators.required]
                });
            }
        )
    }
    changeAddType(partnerForm) {
        console.log(partnerForm)
        if (partnerForm.value == "vendors") {
            this.addingConsultant = false;
            this.addingVendor = true;
            this.addingSupport = false;
            this.partnerForm.controls['speciality'].reset();
        } else if (partnerForm.value == "consult") {
            this.addingConsultant = true;
            this.addingVendor = false;
            this.addingSupport = false;
            this.partnerForm.controls['speciality'].reset();
        } else if (partnerForm.value == "support") {
            this.addingConsultant = false;
            this.addingVendor = false;
            this.addingSupport = true;
            this.partnerForm.controls['speciality'].reset();
        }
    }
    getMedicalSpecialities() {
        this._authService._getMedicalSpecialities()
            .subscribe(
            medData => {
                this.medSpecialities = medData;
            }
            )
    }
    getMedicalVendors() {
        this._authService._getMedicalVendors()
            .subscribe(
            vendorData => {
                this.medVendors = vendorData;
            }
            )
    }
    getMedicalSupport() {
        this._authService._getMedicalSupport()
            .subscribe(
            supportData => {
                this.medSupport = supportData;
            }
            )
    }
}

