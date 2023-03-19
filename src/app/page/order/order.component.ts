import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DatapassService } from 'src/app/datapass.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit{

  constructor(private http : HttpClient,
  public data:DatapassService,
  private router:Router){}

  ngOnInit(){
    if(!this.data.isLoginAdmin){
      this.router.navigateByUrl('/');
      return;
    }
    this.data.getAllOrder(0);
  }

  confirmOrder(){
    this.http.post('http://localhost/jt-services/iorder/update/status',JSON.stringify(this.data.selectedOrder))
    .subscribe();
    window.location.reload();
  }
}
