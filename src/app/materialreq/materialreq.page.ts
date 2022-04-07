import { Component,ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../service/server.service';
import { ToastController,NavController,Platform,LoadingController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-materialReq',
  templateUrl: './materialReq.page.html',
  styleUrls: ['./materialReq.page.scss'],
})

export class MaterialReq {
  @ViewChild(IonContent, {static: true}) content: IonContent;

  oid:any;
  data:any;
  text:any;
  userId:any;
  userName:any;
  materialOrders:any=[];
  r450:number=0;
  f650:number=0;
  r750:number=0;
  r100:number=0;
  cpMealBox:number=0;
  foilPaper:number=0;
  clothBagsSet:number=0;
  zipLockPouches:number=0;
  cellotape:number=0;
  petBottles:number=0;
  materialRequestText="New Material Request";
  isEdit:boolean=false;

  constructor(public loadingController : LoadingController,private route: ActivatedRoute,public server : ServerService,public toastController: ToastController,private nav: NavController,public platform:Platform) {
    this.text   = JSON.parse(localStorage.getItem('app_text'));

    console.log(this.data);
  }

  ionViewWillEnter(){
    this.userId=localStorage.getItem('user_id');
    this.userName=localStorage.getItem('store');
    this.getMaterialForUser();
  }

  async assign(formData)
  {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.server.orderProcess(this.oid,'3&dboy='+formData.dboy).subscribe((response:any) => {
    
    this.presentToast("Order Assigned Successfully.");

    this.nav.navigateRoot('home');

    loading.dismiss();

    });
  }

  async getMaterialForUser(){
const loading = await this.loadingController.create({
  message: 'Please wait...',
});
await loading.present();
this.server.getMaterialForUser(this.userId).subscribe((response:any) => {
  if(response && response.data && response.data.material)
  this.materialOrders = response.data.material;
   loading.dismiss();

});

}

async update(form){
  if(!this.validateForm() || !this.checkFormForDefault()){
    return;
  }
  
  let data ={
     userId:this.userId,
     userName:this.userName,
     f650:this.f650,
     r450:this.r450,
     r750:this.r750,
     r100:this.r100,
     cpMealBox:this.cpMealBox,
     foilPaper:this.foilPaper,
     clothBagsSet:this.clothBagsSet,
     zipLockPouches:this.zipLockPouches,
     cellotape:this.cellotape,
     petBottles:this.petBottles
  }
  const loading = await this.loadingController.create({
    message: 'Please wait...',
  });
  await loading.present();
  this.server.submitMaterial(data).subscribe((response:any) => {
    if(response && response.msg=="done"){
    this.f650=0;
    this.r450=0;
    this.r750=0;
    this.r100=0;
    this.cpMealBox=0;
    this.foilPaper=0;
    this.clothBagsSet=0;
    this.zipLockPouches=0;
    this.cellotape=0;
    this.petBottles=0;
    this.presentToast("Request Submitted Successfully.");
    }
     
     loading.dismiss();
     this.getMaterialForUser();
     this.content.scrollToTop(400);
 
  });
  }


validateForm(){
  if(this.r450 <0 || this.r450 > 30 || this.r450==null){
    this.presentToast("Invalid quantity for R-450");
    return false;
  }
  else if(this.f650 <0 || this.f650 > 30 || this.f650==null){
    this.presentToast("Invalid quantity for F-650");
    return false;
  }
  else if(this.r750 <0 || this.r750 > 30 || this.r750==null){
    this.presentToast("Invalid quantity for R-750");
    return false;
  }
  else if(this.r100 <0 || this.r100 > 30 || this.r100==null){
    this.presentToast("Invalid quantity for R-100");
    return false;
  }
  else if(this.cpMealBox <0 || this.cpMealBox > 30 || this.cpMealBox==null){
    this.presentToast("Invalid quantity for 5CP Meal Box");
    return false;
  }
  else if(this.foilPaper <0 || this.foilPaper > 30 || this.foilPaper==null){
    this.presentToast("Invalid quantity for Foil Paper");
    return false;
  }
  else if(this.clothBagsSet <0 || this.clothBagsSet > 30 || this.clothBagsSet==null){
    this.presentToast("Invalid quantity for Cloth Bags Set");
    return false;
  }
  else if(this.petBottles <0 || this.petBottles > 30 || this.petBottles==null){
    this.presentToast("Invalid quantity for Pet Bottles Set");
    return false;
  }
  else if(this.zipLockPouches <0 || this.zipLockPouches > 30 || this.zipLockPouches==null){
    this.presentToast("Invalid quantity for Zip Lock Pouches");
    return false;
  }
  else if(this.cellotape <0 || this.cellotape > 30 || this.cellotape==null){
    this.presentToast("Invalid quantity for Cello Tape");
    return false;
  }

return true;
}

checkFormForDefault(){
  if(this.r450 ==0 && this.f650 ==0 && this.r750==0 && this.r100==0 && this.cpMealBox==0 && this.foilPaper==0 
    && this.clothBagsSet==0 && this.zipLockPouches==0 && this.petBottles==0 && this.cellotape==0){
    return false;
    }
return true;
}

packageDetail(order){
let selOrder=this.materialOrders.filter(data=>{
return data.id === order.id;
});
this.f650=selOrder[0].f650;
this.r450=selOrder[0].r450;
this.r750=selOrder[0].r750;
this.r100=selOrder[0].r100;
this.cpMealBox=selOrder[0].cpMealBox;
this.foilPaper=selOrder[0].foilPaper;
this.clothBagsSet=selOrder[0].clothBagsSet;
this.zipLockPouches=selOrder[0].zipLockPouches;
this.cellotape=selOrder[0].cellotape;
this.petBottles=selOrder[0].petBottles;

this.materialRequestText="View Request";
this.isEdit=true;
let el = document.getElementById("materialReq");
  el.scrollIntoView({
    behavior: 'smooth'
  });

}

back(){
this.f650=0;
this.r450=0;
this.r750=0;
this.r100=0;
this.cpMealBox=0;
this.foilPaper=0;
this.clothBagsSet=0;
this.zipLockPouches=0;
this.cellotape=0;
this.petBottles=0;
  this.materialRequestText="New Material Request";
  this.isEdit=false;
  this.content.scrollToTop(400);
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
