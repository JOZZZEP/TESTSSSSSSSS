import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DatapassService } from 'src/app/datapass.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class HeaderComponent implements OnInit{

  order:Array<any>=[];
  addFoodTypeName = 'ประเภทอาหาร';
  foodAdd = {
    "tid": "1",
    "name": "",
    "price": "",
    "image": ""
  }
  constructor(private http : HttpClient,private router:Router, public data:DatapassService){}

  ngOnInit(){}

  showOrderCustomer(){
    if(localStorage.getItem('user')){
      this.http.get('http://localhost/jt-services/iorder/cusID/'+this.data.userData.cid)
      .subscribe((data:any) => {
        this.order = data;
      });
    }
  }

  setDefaultType(){
    this.addFoodTypeName = 'ประเภทอาหาร';
  }

  setAddFoodType(type:any){
    this.foodAdd.tid = type.tid;
    this.addFoodTypeName = type.name;
  }

  confirmAddFood(){
    if(this.foodAdd.name != ''
      && this.foodAdd.price != ''
      && this.foodAdd.image != ''){
        this.http.post('http://localhost/jt-services/foods/insert',JSON.stringify(this.foodAdd))
        .subscribe();
        this.foodAdd = {
          "tid": "1",
          "name": "",
          "price": "",
          "image": ""
        }
        this.data.alert = '';
        this.router.navigateByUrl('/').then(()=>{
          window.location.reload();
        });
    }
    else{
      this.data.alert = '*กรอกข้อมูลให้ครบ';
    }
  }

  checkPass(){
    if(this.data.password != this.data.re_password){
      this.data.isRegister = false;
      this.data.alert = '*รหัสผ่านไม่ตรงกัน';
    }
    else{
      this.data.isRegister = true;
      this.data.alert = '';
    }
  }

  async login(){
    let userJSON = { 'username' : this.data.username, 'password' : this.data.password}
    await firstValueFrom(this.http.post('http://localhost/jt-services/customer/login',JSON.stringify(userJSON))).then(response =>{
      let data:any = response;
      if(data.status == 'login'){
        this.data.alert = '';
        localStorage.setItem('user', JSON.stringify(data));
        this.data.username = '';
        this.data.password = '';
        window.location.reload();
      }
      else if(data.status == 'fail'){
        this.data.alert = '*รหัสผ่านไม่ถูกต้อง';
        this.data.password = '';
      }
      else if(data.status == 'notFound'){
        this.data.alert = '*ชื่อผู้ใช้ไม่ถูกต้อง';
        this.data.username = '';
        this.data.password = '';
      }
    })
  }

  async adLogin(){
    let userJSON = { 'username' : this.data.username, 'password' : this.data.password}
    await firstValueFrom(this.http.post('http://localhost/jt-services/admin/login',JSON.stringify(userJSON))).then(response =>{
      let data:any = response;
      if(data.status == 'login'){
        this.data.alert = '';
        localStorage.setItem('user', JSON.stringify(data));
        this.data.username = '';
        this.data.password = '';
        window.location.reload();
      }
      else if(data.status == 'fail'){
        this.data.alert = '*รหัสผ่านไม่ถูกต้อง';
        this.data.password = '';
      }
      else if(data.status == 'notFound'){
        this.data.alert = '*ชื่อผู้ใช้ไม่ถูกต้อง';
        this.data.username = '';
        this.data.password = '';
      }
    })
  }

  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/').then(()=>{
      window.location.reload();
    });
  }

  register(){
    this.data.alert = '';
    if(this.data.username == ''
      || this.data.password == ''
      || this.data.re_password == '')
    {
      this.data.alert = '*กรอกข้อมูลให้ครบ';
    }
    if(this.data.isRegister){
      this.data.alert = '';
      let userJSON = { 'username' : this.data.username, 'password' : this.data.password}
      this.http.post('http://localhost/jt-services/customer/register',JSON.stringify(userJSON))
      .subscribe(response => {
        let data:any = response;
        if(data.status == 'register'){
          window.location.reload();
        }
        else if(data.status == 'fail'){
          this.data.alert = '*ชื่อผู้ใช้นี้มีอยู่แล้ว';
        }
      });
      this.data.username = '';
      this.data.password = '';
      this.data.re_password = '';
    }

  }

  showPass(){
    let pass:any = document.getElementById('loginPassword') as HTMLInputElement;
    if(pass.type == 'password'){
      pass.type = 'text';
    }
    else{
        pass.type = 'password';
    }
  }
}
