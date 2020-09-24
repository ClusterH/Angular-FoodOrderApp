import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TakingsRoutingModule } from './takings-routing.module';
import { TakingsComponent } from './takings.component';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [TakingsComponent],
  imports: [
    CommonModule,
    TakingsRoutingModule,
    SharedModule,
    NgxSpinnerModule,
    NgbTabsetModule,
    NgMultiSelectDropDownModule
  ]
})
export class TakingsModule { }
