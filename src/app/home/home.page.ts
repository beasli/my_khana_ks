import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import {
  AlertController,
  Events,
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { ServerService } from "../service/server.service";
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  data: any;
  text: any;
  store: any;
  complete: any;
  completeOrders: number = 0;
  pet: number = 1;
  overview: any;
  interval: any;
  newOrders: any;
  cancelledOrders: any;
  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public server: ServerService,
    private nav: NavController,
    public events: Events,
    public datepipe: DatePipe,
    public loadingController: LoadingController
  ) {}

  ionViewWillEnter() {
    if (
      localStorage.getItem("app_text") &&
      localStorage.getItem("app_text") != undefined
    ) {
      this.text = JSON.parse(localStorage.getItem("app_text"));
    }
    this.loadData();
    this.interval = setInterval(() => {
      this.loadData();
    }, 60000);
  }

  ngOnInit() {}

  async loadData() {
    const loading = await this.loadingController.create({
      message: "Please wait...",
    });
    await loading.present();

    this.server
      .homepage(
        localStorage.getItem("user_id"),
        0,
        this.datepipe.transform(new Date(), "yyyy-MM-dd"),
        ""
        //  this.datepipe.transform(new Date(), "yyyy-MM-dd")
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.store = response.store;
        this.text = response.text;
        this.overview = response.overview;
        this.complete = response.complete;
        this.completeOrders = response.complete ? response.complete.length : 0;
        this.newOrders = this.data.filter((item) => {
          return item.status != 2;
        });
        this.cancelledOrders = this.data.filter((item) => {
          return item.status == 2;
        });

        localStorage.setItem("app_text", JSON.stringify(response.text));
        localStorage.setItem("app_type", response.app_type);
        localStorage.setItem("store", response.store.name);
        localStorage.setItem("storeData", JSON.stringify(response.store));
        this.events.publish("text", this.text);
        loading.dismiss();
      });
  }

  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 3000,
      position: "top",
      mode: "ios",
      cssClass: "my-custom-class",
    });
    toast.present();
  }

  detail(odata) {
    localStorage.setItem("odata", JSON.stringify(odata));

    this.nav.navigateForward("/detail");
  }

  ordersHistory() {
    this.nav.navigateForward("/order");
  }

  ionViewWillLeave() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
