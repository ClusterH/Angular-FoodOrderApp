import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TakingsComponent } from './takings.component';


const routes: Routes = [
  {
    path: '',
    component: TakingsComponent,
    data: {
      breadcrumb: 'Takings'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TakingsRoutingModule { }
