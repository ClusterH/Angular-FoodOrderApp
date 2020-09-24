import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantsRoutingModule } from './restaurants-routing.module';
import { RestaurantsComponent } from './restaurants.component';
import { SharedModule } from '../shared/shared.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [RestaurantsComponent],
  imports: [
    CommonModule,
    RestaurantsRoutingModule,
    SharedModule,
    NgxSkeletonLoaderModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule
  ]
})
export class RestaurantsModule { }
