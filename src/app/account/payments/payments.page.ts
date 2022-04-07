import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ServerService } from '../../service/server.service';
import { ToastController,NavController,LoadingController,AlertController } from '@ionic/angular';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})

export class PaymentsPage implements OnInit {
  payments:any;
  
  constructor(public datepipe: DatePipe,public server : ServerService,public toastController: ToastController,private nav: NavController,public loadingController: LoadingController,public alertController: AlertController){
  }

  ngOnInit()
  {
 
  }

  ionViewWillEnter()
  {
   
      this.loadData();
  }

  async loadData()
  {
 
    this.server.getPayments(localStorage.getItem('user_id'),1).subscribe((response:any) => {
    this.payments  = response.data[0];
    });
  }

  email(){
    let webLink="mailto:kspay@mykhaana.in";
    window.open(webLink, "_system");
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
