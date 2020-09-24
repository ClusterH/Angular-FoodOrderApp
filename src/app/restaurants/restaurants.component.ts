import { Component, OnInit } from '@angular/core';
import { ApisService } from '../services/apis.service';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  rest: any[] = [];
  dummyRest: any[] = [];
  dummy = Array(10);

  cities = [];

  countriesList = [];
  selectedCountries = [];
  dropdownSettings = {};

  constructor(
    private api: ApisService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    this.countriesList = [
        { item_id: 'IE', item_text: 'IE' },
        { item_id: 'GB', item_text: 'UK' },
      ];
      this.selectedCountries = ["IE", "GB"];
      this.dropdownSettings = { 
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        allowSearchFilter: true
      };
    this.getRest();
    
  }

  getRest() {
    this.api.getCities().then(data => {
        this.cities = data;
        console.log('cities', this.cities);
    }).catch(error => {
        console.log(error);
    })
    this.api.getVenues().then((data) => {
      console.log('rest data', data);
      this.rest = data;
      this.dummyRest = data;
      this.dummy = [];
    }, error => {
      console.log(error);
      this.dummy = [];
    }).catch(error => {
      console.log(error);
      this.dummy = [];
    });
  }
  onItemSelect(item: any) {
    console.log(item);
    this.filterCountries();
  }
  onItemDeSelect(item: any) {
    console.log(item);
    this.filterCountries();
  }
  onSelectAll(items: any) {
    console.log(items);
    this.selectedCountries = items;
    this.filterCountries();
  }
  onDeSelectAll(items: any) {
    console.log(items);
    this.selectedCountries = items;
    this.filterCountries();
  }

  filterCountries(){
    this.resetChanges();
    console.log(this.rest);
    this.rest = this.rest.filter(r => {
        var filter = false;
        this.selectedCountries.forEach(country => {
            console.log(country.item_id + ":" + this.getCountryByCity(r.city));
            if(country.item_id == this.getCountryByCity(r.city)){
                filter = true;
                return;
            }
        });

        return filter;
    });
    console.log(this.rest);
  }

  getCountryByCity(cityId){
      var country = "";
      this.cities.forEach(city => {
          if(city.id == cityId){
            
            country = city.country;
            return;
          }
      });
      return country;
  }

  search(string) {
    this.resetChanges();
    console.log('string', string);
    this.rest = this.filterItems(string);
  }

  protected resetChanges = () => {
    this.rest = this.dummyRest;
  }

  setFilteredItems() {
    console.log('clear');
    this.rest = [];
    this.rest = this.dummyRest;
  }

  filterItems(searchTerm) {
    return this.rest.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }

  ngOnInit() {
  }
  getClass(item) {
    if (item === 'created' || item === 'accepted' || item === 'picked') {
      return 'btn btn-primary btn-round';
    } else if (item === 'delivered') {
      return 'btn btn-success btn-round';
    } else if (item === 'rejected' || item === 'cancel') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  openRest(item) {
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id,
        register: false
      }
    };
    this.router.navigate(['admin-rest-details'], navData);
  }

  changeStatus(item) {
    console.log(item);
    const text = item.status === 'open' ? 'close' : 'open';
    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate(`You can change it later`),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.api.translate('Yes, ') + text + this.api.translate(' it!')
    }).then((result) => {
      if (result.value) {
        const param = {
          uid: item.uid,
          isClose: true,
          status: text,
        };
        this.spinner.show();
        this.api.updateVenue(param).then((data) => {
          this.spinner.hide();
          this.getRest();
          Swal.fire(
            this.api.translate('Updated!'),
            this.api.translate('Restaurants updated'),
            'success'
          );
        }).catch(error => {
          console.log(error);
          this.spinner.hide();
        });
        const userStatus = text === 'open' ? 'active' : 'deactive';
        const statusChange = {
          status: userStatus
        };
        this.api.updateProfile(item.uid, statusChange).then(data => {
          console.log(data);
        }).catch(error => {
          console.log(error);
        });
      }
    });
  }

  createNew() {
    const navData: NavigationExtras = {
      queryParams: {
        register: true
      }
    };
    this.router.navigate(['admin-rest-details'], navData);
  }

  viewQR(item){
    this.router.navigate(['qrcode',item], item);
  }

  viewTakings(item){
    const navData: NavigationExtras = {
        queryParams: {
          item: item.id
        }
      };
      this.router.navigate(['takings'], navData);
  }

  
}
