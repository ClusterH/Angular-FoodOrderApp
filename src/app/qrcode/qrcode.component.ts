import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent implements OnInit {
  ngxQrcode2: string;
  businessUrl:string=""
  elementType:string="url"

  constructor(    private route: ActivatedRoute) { }
  ngOnInit() {

    this.route.params.subscribe(data => {
      console.log(data);
      if (data && data.id) {
        this.businessUrl = "https://mayoeats-41ccd.web.app?id=" + data.ids
      }
    });

  }



}
