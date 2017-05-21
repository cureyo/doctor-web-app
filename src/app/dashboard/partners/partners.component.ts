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
    private addingConsultant: boolean = false;
    private sitename: any;
    private types: any = [];
    private currentConsultants: any = [];
    private currentVendors: any = [];
    private userId: any;


    constructor(private _fb: FormBuilder, private _authService: AuthService, private router: Router, private http: Http) {


    }

    ngOnInit() {

        this._authService._getUser()
            .subscribe(
            data => {
                this.formReady = true;
                this.types = [
                    { name: "Dietician", type: "consultant", icon: "restaurant_menu" },
                    { name: "Doctor", type: "consultant", icon: "local_hospital" },
                    { name: "Physiotherapist", type: "consultant", icon: "accessibility" },
                    { name: "Fitness Instructor", type: "consultant", icon: "directions_run" },
                    { name: "Pharmacy", type: "vendor", icon: "toll" },
                    { name: "Pathological Lab", type: "vendor", icon: "invert_colors" }
                ]
                this.partnerForm = this._fb.group({
                    name: ['', Validators.required],
                    type: ['', Validators.required],
                    email: ['', Validators.required],
                    phone: ['', Validators.required],
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
                        let partnersC = [],partnersV = [];
                        if (partnerList['consultant']) {
                            let ctr = 0;
                            let consultants = partnerList['consultant'];
                            console.log(partnerList['consultant']);
                            for (let item in consultants) {

                                console.log(item)
                                if (item != 'length' && item != '$exists' && item != '$key') 
                                {
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
                                if (item != 'length' && item != '$exists' && item != '$key')
                                   {
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
        let type = this.types[model['type']].type;
        model['icon'] = this.types[model['type']].icon;
        model['type'] = this.types[model['type']].name;
        this._authService._addPartner(model, this.userId, type)
    }
    changeAddType(partnerForm) {
        console.log(partnerForm)
        if (this.types[partnerForm.value].type == "vendor") {
            this.addingConsultant = false;
        } else {
            this.addingConsultant = true;
        }
    }
}

