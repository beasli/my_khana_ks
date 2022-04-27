import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  Events,
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { ServerService } from "../service/server.service";

@Component({
  selector: "app-bakery",
  templateUrl: "./bakery.page.html",
  styleUrls: ["./bakery.page.scss"],
})
export class BakeryPage implements OnInit {
  data: any;
  dataCopy: any;
  disabledItems: any;
  disabledItemsCopy: any = [];
  specialItems: any = [];
  quickItems: any;
  beveragesItems: any;
  specialItemsCopy: any = [];
  quickItemsCopy: any = [];
  beveragesItemsCopy: any = [];
  text: any;
  pet: number;

  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public server: ServerService,
    private nav: NavController,
    public events: Events,
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
  }

  ngOnInit() {}

  async loadData() {
    const loading = await this.loadingController.create({
      message: "Please wait...",
    });
    await loading.present();

    this.server
      .getBakeryData(localStorage.getItem("user_id"))
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataCopy = JSON.stringify(response.data);
        this.pet = this.data && this.data[0] ? this.data[0].id : 10;

        loading.dismiss();
      });
  }

  changeStatus(id, status, tabId) {
    this.pet = tabId;
    this.server.changeStatus(id, status).subscribe((response: any) => {
      this.loadData();
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

  async filterList(evt) {
    console.log(evt);
    const searchTerm = evt.target.value;
    if (searchTerm != "") {
      this.data.find((e) => e.id == this.pet).items = this.data
        .find((e) => e.id == this.pet)
        .items.filter((e) => {
          let name = e.name.toLowerCase();
          let value = searchTerm.toLowerCase();
          return name.includes(value);
        });
    } else {
      console.log(this.dataCopy);
      this.data = JSON.parse(this.dataCopy);
      console.log(this.data);
    }
  }

  changeVisiblity(c, i) {
    this.data.forEach((element, cat_index) => {
      element.items.forEach((item, item_index) => {
        if (cat_index == c && item_index == i) {
          item.isVariationVisible = !item.isVariationVisible;
        } else {
          item.isVariationVisible = 0;
        }
      });
    });
    // this.data[c].items[i].isVariationVisible =
    //   !this.data[c].items[i].isVariationVisible;
  }
}
