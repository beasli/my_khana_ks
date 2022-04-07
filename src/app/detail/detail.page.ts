import { Component } from '@angular/core';
import { ServerService } from '../service/server.service';
import { NavController,Platform,LoadingController,Events,AlertController,ToastController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-detail',
  templateUrl: 'detail.page.html',
  styleUrls: ['detail.page.scss'],
})
export class DetailPage {
	
  data:any;
  text:any;
  status:number;
  runnerPhoneName:any;
runnerPhoneNumber:any;
pickupEta:any;
  constructor(public toastController: ToastController,public alertController: AlertController,
    private callNumber: CallNumber,public server : ServerService,private nav: NavController,public events: Events,public loadingController : LoadingController)
  {
      this.data 	= JSON.parse(localStorage.getItem('odata'));
      this.status	= this.data.status;
      if(this.data.eta){
        let eta=JSON.parse(this.data.eta);
        if(eta.pickup) 
        this.pickupEta=eta.pickup;
      }
      if(this.data.runner){
        let runner=JSON.parse(this.data.runner);
        if(runner.name) 
        this.runnerPhoneName=runner.name;
        if(runner.phone_number) 
        this.runnerPhoneNumber=runner.phone_number;
      }
  }

  ionViewWillEnter()
  {
    if(localStorage.getItem('app_text') && localStorage.getItem('app_text') != undefined)
    {
      this.text = JSON.parse(localStorage.getItem('app_text'));
    }
  }

  ngOnInit()
  {
    
  }

  async presentAlertOrderConfirm(id,status) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure?',
      mode:'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            
            this.startRide(id,status);

          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertOrderCancel(id,status) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to cancel the order ?',
      mode:'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            
            this.startRide(id,status);

          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertDeliveryConfirm(data) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to assign rider now ?',
      mode:'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Driver calling cancelled');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.assignDelivery(data);

          }
        }
      ]
    });

    await alert.present();
  }

  async startRide(id,type)
  {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.server.orderProcess(id,type).subscribe((response:any) => {
    
    if(type == 5)
    {
    	this.presentToast("Order Completed Successfully.");

    	this.nav.navigateRoot('home');
    }
    else if(type == 2)
    {
      this.presentToast("Order Cancelled Successfully.");

      this.nav.navigateRoot('home');
    }
    else
    {
    	this.presentToast("Order Status Updated Successfully.");
    }

    this.status = response.data;

    loading.dismiss();

    });
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

  detail(odata)
  {
    localStorage.setItem('odata', JSON.stringify(odata));
    
    this.nav.navigateForward('/detail');
  }

 async assignDelivery(data){
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.server.assignDelivery(JSON.parse(localStorage.getItem('user_id')),data.id).subscribe((response:any) => {
    if(response && response.data&& response.data.code==201){
      this.presentToast("Order Status Updated Successfully.");
      this.status=3;
    }
    else if(response && response.data && response.data.code!=201)
    this.presentToast(response.data.data.message);
    loading.dismiss();
  });
    
  }
  
  callRunner(mobile){
    this.callNumber.callNumber(mobile, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }
}
