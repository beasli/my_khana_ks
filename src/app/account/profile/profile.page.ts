import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { ServerService } from "../../service/server.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  @ViewChild("content", { static: false }) private content: any;

  data: any;
  action: any;
  text: any;
  order: any;

  constructor(
    private route: ActivatedRoute,
    public server: ServerService,
    public toastController: ToastController,
    private nav: NavController,
    public loadingController: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public alertController: AlertController
  ) {
    this.text = JSON.parse(localStorage.getItem("app_text"));
  }

  ngOnInit() {}

  ionViewWillEnter() {
    if (
      !localStorage.getItem("user_id") ||
      localStorage.getItem("user_id") == "null"
    ) {
      this.nav.navigateRoot("/login");

      this.presentToast("Please login to access your profile");
    } else {
      this.loadData();
    }
  }

  async takeAction(type) {
    this.action = type;
  }

  async loadData() {
    const loading = await this.loadingController.create({
      message: "Please wait...",
    });
    await loading.present();

    this.server
      .userInfo(localStorage.getItem("user_id"))
      .subscribe((response: any) => {
        this.data = response.data;
        this.order = response.order;

        loading.dismiss();
      });
  }

  async update(data) {
    const loading = await this.loadingController.create({
      message: "Please wait...",
    });
    await loading.present();

    var allData = {
      id: localStorage.getItem("user_id"),
      password: data.password,
      min_cart_value: data.min_cart_value,
      delivery_charges_value: data.delivery_charges_value,
    };

    this.server.updateInfo(allData).subscribe((response: any) => {
      this.action = 0;
      this.data = response.data;

      this.presentToast("Updated Successfully");

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

  logout() {
    localStorage.clear();
    this.nav.navigateForward("/login");
  }

  storeOpen(type) {
    this.server
      .storeOpen(type + "?user_id=" + localStorage.getItem("user_id"))
      .subscribe((response: any) => {});
  }
  storeAvaibility(type) {
    this.server
      .storeAvaibility(type + "?user_id=" + localStorage.getItem("user_id"))
      .subscribe((response: any) => {
        this.loadData();
      });
  }

  async goForHolyday(e, res) {
    if (res) {
      this.storeAvaibility(res);
    } else {
      const alert = await this.alertController.create({
        header: "Alert",
        message:
          "Careful! Holiday Mode ON means you will not be available for more than 3 days & your profile will not be seen by customers.",
        buttons: [
          {
            text: "OK",
            handler: () => {
              this.storeAvaibility(0);
            },
          },
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              console.log(e);
              e.srcElement.checked = false;
              e.srcElement.value = "off";
              //  this.data.availablity = 0;
            },
          },
        ],
      });
      await alert.present();
    }
  }
}
