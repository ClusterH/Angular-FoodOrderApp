import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApisService } from '../services/apis.service';
import { Router, NavigationExtras } from '@angular/router';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import * as firebase from 'firebase';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-takings',
  templateUrl: './takings.component.html',
  styleUrls: ['./takings.component.scss']
})
export class TakingsComponent implements OnInit {

  id: any;
  email: any; phone: any; fname: any; lname: any;
  haveData: boolean = false; name: any; address: any; coverImage: any; descritions: any; city: any;
  
  totalOrders: any[];
  currentOrders: any[];
  categories: any[];

  completedOrdersCount = 0; ongoingOrdersCount = 0; otherOrdersCount = 0; totalOrdersCount = 0;
  totalIncome: number = 0;

  dateStr = "Today";
  dateStr2 = "";

  constructor(
    private route: ActivatedRoute,
    private api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private router: Router,
    private chMod: ChangeDetectorRef
  ) { 
      this.showToday();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(data => {
        console.log('data=>', data);
        if (data.hasOwnProperty('item')) {
          this.id = data.item;
          this.getVenue();
        } else {
          this.router.navigate(["admin-restaurants"]);
        }
      });
  }

  getVenue() {
    this.api.getProfile(this.id).then(data => {
      console.log('profile', data);
      if (data) {
        this.email = data.email;
        this.phone = data.phone;
        this.fname = data.fname;
        this.lname = data.lname;
      }
    });
    this.api.getVenueDetails(this.id).then((data) => {
      console.log('data', data);
      if (data) {
        
        this.name = data.name;
        this.address = data.address;
        this.coverImage = data.cover;
        this.descritions = data.descritions;
        this.city = data.city;
        this.phone = data.phone;
        
        this.chMod.detectChanges();
      }
    }).catch(error => {
      console.log(error);
    });
    this.api.getVenueCategories(this.id).then(data => {
        data = data.sort(function(a, b){
            try{
                if(a.date_added < b.date_added)
                    return -1;
                else 
                    return 1;
            }catch(Exception){
                return -1;
            }
      });
      if (data) {
        this.categories = data;
      }
    }).catch(error => {
        console.log(error);
    });
    this.api.getRestOrders(this.id).then(data => {
      console.log('order->', data);
      this.totalOrders = [];
      if (data && data.length) {
        this.totalOrders = data;
        this.haveData = true;

        this.showToday();
      }
    }).catch(error => {
      console.log(error);
    });
  }

  showToday(){
      this.dateStr = 'Today';
      this.dateStr2 = this.getDate(Date());
      if(this.haveData){
          this.currentOrders = this.getTodaysOrders();
          this.calculateTotals();
      }
  }

  showYesterday(){
      this.dateStr = "Yesterday";
      this.dateStr2 = this.getDate(moment(Date()).subtract(1, "days"));
      if(this.haveData){
          this.currentOrders = this.getYesterdaysOrders();
          this.calculateTotals();
      }
  }

  getImage(cover) {
    return cover ? cover : 'assets/icon.png';
  }
  getDate(date) {
    return moment(date).format('ddd, MMM D, YYYY');
  }

  getTodaysOrders(all = true): any[]{
    var todaysOrders : any[] = [];

    this.totalOrders.forEach(element => {
        if(all || element.status == 'delivered'){
            if(moment().dayOfYear() == moment(element.time).dayOfYear()){
                todaysOrders.push(element)
            }
        }
    });

    return todaysOrders;
  }
  getYesterdaysOrders(all = true): any[]{
    var todaysOrders : any[] = [];

    this.totalOrders.forEach(element => {
        if(all || element.status == 'delivered'){
            if(moment().subtract(1, "days").dayOfYear() == moment(element.time).dayOfYear()){
                todaysOrders.push(element)
            }
        }
    });

    return todaysOrders;
  }

  calculateTotals(){
    console.log(this.currentOrders);
    this.totalOrdersCount = this.ongoingOrdersCount = this.completedOrdersCount = this.otherOrdersCount = 0;
    this.totalIncome = 0;
    this.currentOrders.forEach(order => {
        this.totalOrdersCount++;
        console.log(this.totalIncome);
        this.totalIncome += parseFloat(order.grandTotal);
        console.log(this.totalIncome);
        if (order.status === 'accepted' || order.status === 'ongoing') {
            this.ongoingOrdersCount++;
        } else if (order.status === 'delivered') {
            this.completedOrdersCount++;
        } else if (order.status === 'cancel') {
            this.otherOrdersCount++;
        } else {
            this.totalOrdersCount--;
        }
    })
  }

  calculateReport(){

  }

  exportCSV(){
    if(!this.haveData) return;
    var orders = this.currentOrders;
    
    orders = orders.filter(order => {
        return order.status == 'delivered';
    })

    if(orders.length == 0){
        this.toastyService.error("No delivered orders to export!")
        return;
    }

    var categories = this.getCSVCategories();
    var csvItems = [];

    var csv = ""
    orders.forEach(order =>{
        console.log(order);
        order.order = JSON.parse(order.order);
        order.order.forEach(element => {
            let catId = element.cid.id;
            var done = false;
    
            categories.forEach(category => {
                if(catId == category.id){
                    category.orders.push(element);
                    done = true;
                    return;
                }
            });
    
            if(!done){
                categories[0].orders.push(element);
            }
        })
    });

    var totalGross = 0.0;
    var totalQty = 0;
    var totalVat = 0.0;
    var totalGrossAfterVat = 0.0;
    categories.forEach(cat => {
        var qty = 0;
        var gross = 0.0;
        var orders = [];

        cat.orders.forEach(order => {
            qty += order.quantiy;
            gross += order.price * order.quantiy;

            orders.push({
                name : order.name,
                qty: order.quantiy,
                gross: order.price * order.quantiy,
            })
        });

        orders.forEach(order => {
            order.percent = order.gross / gross * 100;
        });
        
        totalGross += gross;
        totalQty += qty;

        let vatGross = gross * cat.vat / 100;
        let grossAfterVat = gross - vatGross;

        totalVat += vatGross;
        totalGrossAfterVat += grossAfterVat;

        csvItems.push({
            categoryName: cat.name,
            qty: qty,
            gross: gross,
            vat: cat.vat,
            vatGross: vatGross,
            grossAfterVat: grossAfterVat,
            orders: orders
        });
    });

    csvItems.forEach(item => {
        item.percent = item.gross / totalGross * 100;
    });

    csv += "Printed on " + moment().format("llll") + "\n";
    csv += "\n";
    csv += "Group Totals Report" + "\n";
    csv += "Item Group,Qty,Gross Sales,% OfTotal" + "\n";
    csvItems.forEach(item => {
        if(item.qty == 0) return;
        csv += item.categoryName + "," + item.qty + "," + item.gross + "," + item.percent.toFixed(2) + "\n";
    })
    csv += "Report Totals" + "," + totalQty + "," + totalGross + "," + "100%" + "\n";
    csv += "\n";
    csv += "Items Sales Report" + "\n";
    csv += "Item,Qty,Gross Sales,% OfTotal" + "\n";
    csvItems.forEach(item => {
        if(item.qty == 0) return;
        csv += item.categoryName + "\n";
        item.orders.forEach(order => {
            csv += order.name + "," + order.qty + "," + order.gross + "," + order.percent.toFixed(2) + "\n";
        })
    })
    csv += "Report Totals" + "," + totalQty + "," + totalGross + "," + "100%" + "\n";

    csv += "\n";
    csv += "VAT Calculation" + "\n";
    csv += "Item Group,VAT Percent,Gross Sales,VAT Collected,Sales less VAT" + "\n";
    csvItems.forEach(item => {
        if(item.qty == 0) return;
        csv += item.categoryName + "," + item.vat + "," + item.gross + "," + item.vatGross.toFixed(2) + "," + item.grossAfterVat.toFixed(2) + "\n";
    });
    csv += "Report Totals" + "," + "-" + "," + totalGross + "," + totalVat.toFixed(2) + "," + totalGrossAfterVat.toFixed(2) + "\n";

    console.log(csv);
    this.download(this.getFormattedTimeFileName(), csv);
  }

  download(filename, data) {
    var blob = new Blob([data], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
  }

  getFormattedTimeFileName() {
    var today = new Date();
    var y = Math.round(today.getFullYear());
    // JavaScript months are 0-based.
    var m = Math.round(today.getMonth() + 1);
    var d = Math.round(today.getDate());
    return "" + y + "-" + m + "-" + d + ".csv";
  }

  getCSVCategories(): any[] {
    var ret = [];

    ret.push({
        id : "unknown",
        name: "Unknown (Maybe Deleted)",
        vat: 0,
        orders: []
    });

    this.categories.forEach(category => {
        if(category.vat == null)
            category.vat = 0;
        ret.push({
            id : category.id,
            name: category.name,
            vat: category.vat,
            orders: []
        });
    });

    return ret;
  }
}
