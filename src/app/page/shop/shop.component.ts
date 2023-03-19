import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DatapassService } from 'src/app/datapass.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  foods:any;
  foodName:String = "";
  amount:number = 1;
  selectFood:any;
  index:number = -1;
  typename = 'ประเภทอาหาร';
  typeEdit:any;
  foodEdit = {
    "fid": "",
    "tid": "",
    "name": "",
    "price": "",
    "image": ""
  }
  constructor(private http : HttpClient,private router:Router,public data:DatapassService){}

  ngOnInit(){
    this.http.get('http://localhost/jt-services/foods')
    .subscribe(data => {
      this.foods = data;
    });
  }

  getFoodType(tid:any){
    for(let type of this.data.types){
      if(type.tid == tid){
        this.typename = type.name;
        this.http.get('http://localhost/jt-services/foods/tid/'+tid)
        .subscribe(data => {
          this.foods = data;
        });
        return;
      }
    }
    this.typename = 'อาหารทั้งหมด';
    this.http.get('http://localhost/jt-services/foods')
    .subscribe(data => {
      this.foods = data;
    });
  }

  getTypeEdit(tid:any){
    for(let type of this.data.types){
      if(type.tid == tid){
        this.typeEdit = type;
        break;
      }
    }
  }

  async modalSelectFood(food:any){
    this.selectFood = food;
    this.foodName = food.name;
    this.amount = 1;
    await firstValueFrom(this.http.get('http://localhost/jt-services/type/search/'+food.fid)).then(data =>{
      this.typeEdit = data;
      this.foodEdit.tid = this.typeEdit.tid;
      this.foodEdit.fid = food.fid;
      this.foodEdit.name = food.name;
      this.foodEdit.price = food.price;
      this.foodEdit.image = food.image;
    });
  }

  confirmFoodEdit(){
    this.foodEdit.tid = this.typeEdit.tid;
    this.http.post('http://localhost/jt-services/foods/update',JSON.stringify(this.foodEdit))
    .subscribe();

    this.router.navigateByUrl('/').then(()=>{
      window.location.reload();
    });
  }

  comfirmDelFood(){
    this.http.post('http://localhost/jt-services/foods/delete',JSON.stringify(this.foodEdit))
    .subscribe();
    this.router.navigateByUrl('/').then(()=>{
      window.location.reload();
    });
  }

  addToBasket(){
    if(localStorage.getItem('foods') != null){
      let json = {
          "fid" : this.selectFood.fid,
          "name" : this.selectFood.name,
          "price" : this.selectFood.price,
          "image" : this.selectFood.image,
          "amount" : this.amount
      };
      let food = localStorage.getItem('foods');
      if(food != null){
        let foodListJSON = JSON.parse(food);
        for(let foodItem of foodListJSON){
          if(foodItem.fid == this.selectFood.fid){
            this.index = foodListJSON.indexOf(foodItem);
            foodListJSON[this.index].amount += this.amount;
            foodListJSON[this.index].price = this.selectFood.price;
            break;
          }
        }
        if(this.index == -1){
          foodListJSON.push(json);
        }
        localStorage.setItem('foods', JSON.stringify(foodListJSON));
        localStorage.setItem('orderAmount', JSON.stringify(foodListJSON.length));
        this.data.orderAmount = localStorage.getItem('orderAmount');
      }
    }
    else{
      let jsonList = [{
          "fid" : this.selectFood.fid,
          "name" : this.selectFood.name,
          "price" : this.selectFood.price,
          "image" : this.selectFood.image,
          "amount" : this.amount
      }];
      localStorage.setItem('foods', JSON.stringify(jsonList));
      localStorage.setItem('orderAmount', JSON.stringify(jsonList.length));
      this.data.orderAmount = localStorage.getItem('orderAmount');
    }
  }

  addAmount(){
    this.amount += 1;
  }

  delAmount(){
    if(this.amount > 1){
      this.amount -= 1;
    }
  }

}
