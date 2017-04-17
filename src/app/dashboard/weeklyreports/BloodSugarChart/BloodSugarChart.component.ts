import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder,Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
@Component({
    selector: 'app-BloodSugarChart',
    moduleId: module.id,
    templateUrl: 'BloodSugarChart.component.html'
})

export class BloodSugarChartComponent{
    @Input() averageBS: any;
    @Input() bsStartDate: any;
    @Input() bsEndDate:any;
   
    
}
