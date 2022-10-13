import { Component } from '@angular/core';
import { AlertController, Events, LoadingController, NavController, ToastController } from '@ionic/angular';
import { ServerService } from '../service/server.service';

@Component({
  selector: 'app-item',
  templateUrl: 'item.page.html',
  styleUrls: ['item.page.scss'],
})
export class ItemPage {
	
  data:any;
  disabledItems:any;
  disabledItemsCopy:any=[];
  specialItems:any=[];
  quickItems:any;
  beveragesItems:any;
  specialItemsCopy:any=[];
  quickItemsCopy:any=[];
  beveragesItemsCopy:any=[];
  text:any;
  pet:number = 7;

  constructor(public toastController: ToastController,public alertController: AlertController,public server : ServerService,private nav: NavController,public events: Events,public loadingController : LoadingController)
  {
   
  }

  ionViewWillEnter()
  {
    if(localStorage.getItem('app_text') && localStorage.getItem('app_text') != undefined)
    {
      this.text = JSON.parse(localStorage.getItem('app_text'));
    }

    this.loadData();
  }

  ngOnInit()
  {
    
  }

  async loadData()
  {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.server.getItem(localStorage.getItem('user_id')).subscribe((response:any) => {
   
    this.data      = response.data;
      if(response.data){
           this.quickItemsCopy = response.data.filter(item => {
            return (item.id==7);
            });
            this.quickItems = JSON.parse(JSON.stringify(this.quickItemsCopy));

           this.specialItemsCopy = response.data.filter(item => {
            return (item.id==8);
              });
           this.specialItems = JSON.parse(JSON.stringify(this.specialItemsCopy));

           this.beveragesItemsCopy = response.data.filter(item => {
            return (item.id==6);
              });
           this.beveragesItems = JSON.parse(JSON.stringify(this.beveragesItemsCopy));
 
   }
    loading.dismiss();

    });

    // this.server.getDisabledItem(localStorage.getItem('user_id')).subscribe((response:any) => {
   
    //   this.disabledItemsCopy = response.data;
    //   this.disabledItems = JSON.parse(JSON.stringify(this.disabledItemsCopy));
     
    //   loading.dismiss();
  
    //   });
  }

  changeStatus(id,status,tabId)
  {
    this.pet=tabId;
    this.server.changeStatus(id,status).subscribe((response:any) => {
      this.loadData();
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

  async filterList(evt) {
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      this.quickItems[0].items=this.quickItemsCopy[0].items;
      this.specialItems[0].items=this.specialItemsCopy[0].items;
    //  this.disabledItems[0].items==this.disabledItemsCopy[0].items;
    //  this.disabledItems[1].items=this.disabledItemsCopy[1].items;
      return;
    }
      let items=[];
      if (this.specialItemsCopy.length>0 && searchTerm) {
        this.specialItemsCopy[0].items.forEach(item => {
          if((item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1))
              items.push(item);
        });
        this.specialItems[0].items=items;
      }

      items=[];
      if (this.quickItemsCopy.length>0 && searchTerm) {
        this.quickItemsCopy[0].items.forEach(item => {
          if((item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1))
              items.push(item);
        });
        this.quickItems[0].items=items;
      }

      items=[];
      if (this.disabledItemsCopy.length>0 && searchTerm) {
        this.disabledItemsCopy[0].items.forEach(item => {
          if((item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1))
              items.push(item);
        });
        this.disabledItems[0].items=items;
      }
      items=[];
      if (this.disabledItemsCopy.length>0 && searchTerm) {
        this.disabledItemsCopy[1].items.forEach(item => {
          if((item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1))
              items.push(item);
        });
        this.disabledItems[1].items=items;
      }
  }

  changePreOrderStatus(item) {
      this.server.changePreOrderStatus(item.id,item.isPreOrder ? 1 : 0).subscribe((response:any) => {
        console.log(item);
        console.log(response);
      });
    
  }
}
