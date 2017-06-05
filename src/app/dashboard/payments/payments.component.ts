import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response, Headers } from '@angular/http';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';


declare var $: any


@Component({
    selector: 'payment-cmp',
    templateUrl: 'payments.component.html',
    moduleId: module.id
})

export class PaymentsComponent implements OnInit {
    [name: string]: any;

    private caredone: any;
    private section: any = "partners";
    private paymentsForm: FormGroup;
    private selectDrDomain: boolean = false;
    private caredOneId: any;
    private displayDrDomain: boolean = false;
    private array: any;
    private planList: any;
    private routeparam: any;
    private availableName: any;
    private formReady: boolean = false;
    private consultantsPresent: boolean = false;
    private vendorsPresent: boolean = false;
    private addingConsultant: boolean = false;
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
    private partnerConsultants: any =[];
    //private nextButtonFlag:boolean=false;


    constructor(
        private _fb: FormBuilder,
        private _authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private http: Http) {


    }

    ngOnInit() {


        this.getMedicalSpecialities();
        this.getMedicalVendors();
        this.getMedicalSupport();
        this._authService._getUser()
            .subscribe(
            data => {

                this.userId = data.user.uid;

                this._authService._getPartner(data.user.uid)
                    .subscribe(
                    partnerList => {
                        console.log(partnerList);
                        let partnersC = [], partnersV = [];
                        if (partnerList['consultant']) {
                            let ctr = 0;
                            let consultants = partnerList['consultant'];
                            this.partnerConsultants = partnerList['consultant'];
                            console.log(partnerList['consultant']);
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



                        if (partnerList['vendor']) {
                            let ctr = 0;
                            let vendor = partnerList['vendor'];
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
                        console.log(this.currentVendors);
                        console.log(this.currentConsultants)
                        this._authService._getPaymentPlans(this.userId)
                            .subscribe(
                            paymentsData => {
                                if (paymentsData.plans) {
                                    this.paymentsForm = this._fb.group({
                                        plans: this._fb.array([]) }
                                    );
                                    let control = <FormArray>this.paymentsForm.controls['plans'];
                                    for (let each in paymentsData.plans) {
                                        control.push(this.loadPlanGroup(paymentsData.plans[each]));
                                    }

                                    this.formReady = true;
                                } else {
                                    this.paymentsForm = this._fb.group({
                                        plans: this._fb.array([
                                            this.insertPlanGroup()

                                        ])


                                    }
                                    )


                                    this.formReady = true;
                                }
                            }
                            )


                    }
                    )

            });
    }
    addPlanGroup() {
        console.log(this.paymentsForm.controls['plans']);
        if (this.paymentsForm.controls['plans']['length'] > 2) {
            alert("You can add a maximum of 3 Payment Plans");
        } else {
            let control = <FormArray>this.paymentsForm.controls['plans'];
            control.push(this.insertPlanGroup())
        }

    }
        loadPlanGroup(data) {
        let control = this._fb.group(
            {
                description: [data.description, Validators.required],
                title: [data.title, Validators.required],
                consultations: this._fb.array([]),
                services: this._fb.group({
                    Pharmacy: this._fb.group({
                        partner: [data.services.Pharmacy.partner],
                        transaction: [data.services.Pharmacy.transaction]
                    }),
                    Pathological: this._fb.group({
                        partner: [data.services.Pathological.partner],
                        transaction: [data.services.Pathological.transaction]
                    }),
                    Radiological: this._fb.group({
                        partner: [data.services.Radiological.partner],
                        transaction: [data.services.Radiological.transaction]
                    }),
                }),
                addOns: this._fb.group({
                    markup: [data.addOns.markup],
                    service_charge: [data.addOns.service_charge],
                    uberBooking: [data.addOns.uberBooking],
                }),
                cureyoFee: [{ value: '75', disabled: true }, Validators.required]
            }
        )
        let control2 = <FormArray>control.controls['consultations']
        console.log(control2);
        let consList = [];
        for (let item1 in data.consultations) {
            consList[data.consultations[item1].id] = data.consultations[item1];
        }
        for (let consultant in this.currentConsultants) {
            let consId = this.currentConsultants[consultant].phone;
            let consName = this.currentConsultants[consultant].name;
            let onLine1 = 'reminder';
            let physical1 = 'reminder';
            if (consList[consId])
            onLine1 = consList[consId].online;
            if (consList[consId])
            physical1 = consList[consId].physical;
            control2.push(this._fb.group({
                id: [consId],
                name: [consName],
                online: [onLine1, Validators.required],
                physical: [physical1, Validators.required]
            }))
        }
        console.log(control);
        return control;
    }
    insertPlanGroup() {
        let control = this._fb.group(
            {
                description: [, Validators.required],
                title: [, Validators.required],
                consultations: this._fb.array([]),
                services: this._fb.group({
                    Pharmacy: this._fb.group({
                        partner: [],
                        transaction: []
                    }),
                    Pathological: this._fb.group({
                        partner: [],
                        transaction: []
                    }),
                    Radiological: this._fb.group({
                        partner: [],
                        transaction: []
                    }),
                }),
                addOns: this._fb.group({
                    markup: [],
                    service_charge: [],
                    uberBooking: [],
                }),
                cureyoFee: [{ value: '75', disabled: true }, Validators.required]
            }
        )
        let control2 = <FormArray>control.controls['consultations']
        console.log(control2);
        for (let consultant in this.currentConsultants) {
            let consId = this.currentConsultants[consultant].phone;
            let consName = this.currentConsultants[consultant].name;

            control2.push(this._fb.group({
                id: [consId],
                name: [consName],
                online: ['reminder', Validators.required],
                physical: ['reminder', Validators.required]
            }))
        }
        console.log(control);
        return control;
    }

    addPartner(form) {
        let model = form.value;
        console.log(model);
        let type = model['type'];
        if (type == "support") {
            type = "consultant";
            model['type'] = "consultant";
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
                this.paymentsForm = this._fb.group({
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
    changeAddType(paymentsForm) {
        console.log(paymentsForm)
        if (paymentsForm.value == "vendor") {
            this.addingConsultant = false;
            this.addingVendor = true;
            this.addingSupport = false;
            this.paymentsForm.controls['speciality'].reset();
        } else if (paymentsForm.value == "consultant") {
            this.addingConsultant = true;
            this.addingVendor = false;
            this.addingSupport = false;
            this.paymentsForm.controls['speciality'].reset();
        } else if (paymentsForm.value == "support") {
            this.addingConsultant = false;
            this.addingVendor = false;
            this.addingSupport = true;
            this.paymentsForm.controls['speciality'].reset();
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
    savePaymentPlans(form) {
        this._authService._savePaymentPlans(this.userId, form).then(
            data => {
                alert("Payment Plans have been saved");
            }
        )
    }
}

