import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DatapassService } from 'src/app/datapass.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit{

  constructor(private http : HttpClient,
    public data:DatapassService,
    private router:Router) {}

  ngOnInit(){
    if(!this.data.isLoginAdmin){
      this.router.navigateByUrl('/');
      return;
    }
    this.data.getAllOrder(1);
  }
}
