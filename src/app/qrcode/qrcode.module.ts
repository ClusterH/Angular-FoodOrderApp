import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrcodeComponent } from '../qrcode/qrcode.component';
import { Routes, RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';

const routes: Routes = [
  {
    path: '',
    component: QrcodeComponent,
    data: {
      breadcrumb: 'QR Code'
    }
  }
];

@NgModule({
  declarations: [QrcodeComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    QRCodeModule
  ]
})
export class QrcodeModule { }
