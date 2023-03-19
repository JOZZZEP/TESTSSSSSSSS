import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatapassService {

  username = '';
  password = '';
  re_password = '';
  alert = '';
  isLogin = false;
  isLoginAdmin = false;
  isRegister = false;
  types:any;
  orderAmount:any;
  allOrder:Array<any>=[];
  allFoods:any;
  selectedOrder:any;
  totalPrice:any;
  userinfo:any;
  userData = {
    "oid": "",
    "cid": "",
    "name": "",
    "phone": "",
    "address": ""
  }

  constructor(private http : HttpClient) {
    this.checkLogin()
    if(localStorage.getItem('user')){
      let user:any = localStorage.getItem('user');
      let customer = JSON.parse(user);
      this.userData.cid = customer.cid;
    }

    this.http.get('http://localhost/jt-services/type')
    .subscribe(data => {
      this.types = data;
    });
    if(localStorage.getItem('orderAmount')){
      this.orderAmount = localStorage.getItem('orderAmount');
    }
  }

  clearAlert(){
    this.alert = '';
  }

  getAllOrder(status:any){
    this.http.get('http://localhost/jt-services/iorder/'+status)
    .subscribe(data => {
      let order:any = data;
      this.allOrder = order;
    });
  }

  async selectOrder(order:any){
    this.selectedOrder = order;
    await firstValueFrom(this.http.post('http://localhost/jt-services/cart/foodItem',JSON.stringify(order))).then(data =>{
      this.allFoods = data;
    });
    this.http.get('http://localhost/jt-services/cart/priceTotal/'+order.oid)
    .subscribe(data => {
      this.totalPrice = data
    });
  }

  checkLogin() {
    if(localStorage.getItem('user')){
      let data:any = localStorage.getItem('user');
      this.userinfo = JSON.parse(data);
      if(this.userinfo.username != null){
        this.isLogin = true;
      }
      else{
        this.isLogin = false;
      }

      if(this.userinfo.status == 'login'
        && this.userinfo.adID != null
        && this.userinfo.ad_username != null){
        this.isLoginAdmin = true;
      }
      else{
        this.isLoginAdmin = false;
      }
    }
    else{
      this.isLogin = false;
    }
  }
}
