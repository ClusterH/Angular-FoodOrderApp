import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class UtilService {

  report: any;
  constructor(

  ) { }


  setReport(data) {
    this.report = data;
  }

  getReport() {
    return this.report;
  }

  makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
