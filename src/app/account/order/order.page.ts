import { Component, OnInit,ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ServerService } from '../../service/server.service';
import { ToastController,NavController,Platform,LoadingController,AlertController } from '@ionic/angular';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})

export class OrderPage implements OnInit {

  data:any;
  disabledItems:any;
  specialItems:any;
  quickItems:any;
  text:any;
  pet:number = 2;
  store:any;
  complete:any;
  completeOrders:number=0;
  overview:any;
  interval:any;
  newOrders:any;
  cancelledOrders:any;
  startDate:any=new Date();
  endDate:any=new Date();
  maxTime:any;
  isLoading:boolean = false;
  searchText:string="Search Orders";
  completeOrdersValue:number = 0;
  constructor(public datepipe: DatePipe,public server : ServerService,public toastController: ToastController,private nav: NavController,public loadingController: LoadingController,public alertController: AlertController){

    this.text = JSON.parse(localStorage.getItem('app_text'));
  
  }

  ngOnInit()
  {
    this.startDate='2020-12-01';
    this.endDate=this.datepipe.transform(this.endDate.setDate(new Date().getDate()), 'yyyy-MM-dd');
    this.maxTime=this.endDate;
    console.log(this.endDate)
  }

  ionViewWillEnter()
  {
    if(localStorage.getItem('app_text') && localStorage.getItem('app_text') != undefined)
    {
      this.text = JSON.parse(localStorage.getItem('app_text'));
    }
    if(!localStorage.getItem('user_id') || localStorage.getItem('user_id') == 'null')
    {
      this.nav.navigateRoot('/login');

      this.presentToast("Please login for access your profile");
    }
    else
    {
      this.loadData();
    }
  }

  async loadData()
  {
    this.completeOrdersValue =0;
    this.isLoading = true;
    this.searchText="Please wait..."
    this.server.homepage(localStorage.getItem('user_id'),0,this.startDate,this.endDate).subscribe((response:any) => {
    this.data      = response.data;
    this.store     = response.store;
    this.text      = response.text;
    this.overview  = response.overview;
    this.complete       = response.complete;
    this.completeOrders = response.complete?response.complete.length:0;
    this.newOrders=this.data.filter(item=>{
       return item.status != 2;
    });
    this.cancelledOrders=this.data.filter(item=>{
      return item.status == 2;
   });
   this.complete.forEach(order => {
     this.completeOrdersValue = this.completeOrdersValue + Number(order.subTotal);
   });
   this.isLoading = false;
   this.searchText="Search Orders";
    });
  }

  detail(odata)
  {
    localStorage.setItem('odata', JSON.stringify(odata));

    this.nav.navigateForward('/detail');
  }

  searchOrders(){
    this.startDate=this.datepipe.transform(new Date(this.startDate), 'yyyy-MM-dd');
    this.endDate=this.datepipe.transform(new Date(this.endDate), 'yyyy-MM-dd');
    this.loadData();
  }

  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 3000,
      position : 'top',
      mode:'ios',
      cssClass: 'my-custom-class',
    });
    toast.present();
  }
}
