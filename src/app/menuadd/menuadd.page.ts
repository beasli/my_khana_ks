import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  IonContent,
  LoadingController,
  NavController,
  Platform,
  ToastController,
} from "@ionic/angular";
import { ServerService } from "../service/server.service";

@Component({
  selector: "app-menuadd",
  templateUrl: "./menuadd.page.html",
  styleUrls: ["./menuadd.page.scss"],
})
export class MenuAdd {
  @ViewChild(IonContent, { static: true }) content: IonContent;

  oid: any;
  data: any;
  text: any;
  userId: any;
  userName: any;
  menuRequests: any = [];
  r450: number = 0;
  f650: number = 0;
  r750: number = 0;
  r100: number = 0;
  cpMealBox: number = 0;
  foilPaper: number = 0;
  clothBagsSet: number = 0;
  zipLockPouches: number = 0;
  cellotape: number = 0;
  materialRequestText = "New Material Request";
  isEdit: boolean = false;

  menu1: any = "";
  menu2: any = "";
  menu3: any = "";
  menuDesc1: any = "";
  menuDesc2: any = "";
  menuDesc3: any = "";
  price1: number = 0;
  price2: number = 0;
  price3: number = 0;
  type1: number = -1;
  type2: number = -1;
  type3: number = -1;
  form2: boolean = false;
  form3: boolean = false;
  menuItems: any = [];

  type: string;

  constructor(
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    public server: ServerService,
    public toastController: ToastController,
    private nav: NavController,
    public platform: Platform
  ) {
    this.type = this.route.snapshot.paramMap.get("type");
    this.text = JSON.parse(localStorage.getItem("app_text"));
  }

  ionViewWillEnter() {
    this.userId = localStorage.getItem("user_id");
    this.userName = localStorage.getItem("store");
    this.getMenuRequests();
  }

  onSelectChange(selectedValue: any, type) {
    if (type == 1) this.type1 = Number(selectedValue.detail.value);
    else if (type == 2) this.type2 = Number(selectedValue.detail.value);
    else if (type == 3) this.type3 = Number(selectedValue.detail.value);
  }

  addItem(number) {
    if (number == 2) {
      this.form2 = true;
      this.scrollToForm("reqform2");
    } else if (number == 3) {
      this.form3 = true;
      this.scrollToForm("reqform3");
    }
  }

  resetForm1() {
    this.menu1 = "";
    this.menuDesc1 = "";
    this.price1 = 0;
    this.type1 = -1;
  }

  resetForm2() {
    this.form2 = false;
    this.menu2 = "";
    this.menuDesc2 = "";
    this.price2 = 0;
    this.type2 = -1;
  }

  resetForm3() {
    this.form3 = false;
    this.menu3 = "";
    this.menuDesc3 = "";
    this.price3 = 0;
    this.type3 = -1;
  }

  removeItem(number) {
    if (number == 2) {
      this.resetForm2();
    } else if (number == 3) {
      this.resetForm3();
    }
  }

  async addMenuItems() {
    this.menuItems = [];
    if (
      !this.validateForm1() ||
      !this.validateForm2() ||
      !this.validateForm3()
    ) {
      return;
    }
    let data = {
      store_id: this.userId,
      store_name: this.userName,
      items: this.menuItems,
    };
    console.log(data);
    const loading = await this.loadingController.create({
      message: "Please wait...",
    });
    await loading.present();
    this.server.submitMenuItems(data, this.type).subscribe(
      (response: any) => {
        if (response && response.msg == "done") {
          this.presentToast("Menu Request Submitted Successfully.");
        } else if (response && response.msg) {
          this.presentToast(response.msg);
        }
        this.scrollToForm("requests");
        this.resetForm1();
        this.resetForm2();
        this.resetForm3();
        this.getMenuRequests();
        loading.dismiss();
      },
      (error) => {
        loading.dismiss();
        this.presentToast("Please try again.");
      }
    );
  }

  scrollToForm(id) {
    let el = document.getElementById(id);
    el.scrollIntoView({
      behavior: "smooth",
    });
  }

  validateForm1() {
    if (
      this.menu1 == null ||
      this.menu1 == undefined ||
      this.menu1 == "" ||
      this.menu1.trim() == ""
    ) {
      this.presentToast("Please enter a Menu name.");
      this.scrollToForm("menuReq");
      return false;
    } else if (
      this.menuDesc1 == null ||
      this.menuDesc1 == undefined ||
      this.menuDesc1 == "" ||
      this.menuDesc1.trim() == ""
    ) {
      this.presentToast("Please enter a menu description.");
      this.scrollToForm("menuReq");
      return false;
    } else if (this.price1 <= 0 || this.price1 == null) {
      this.presentToast("Please enter a valid price");
      this.scrollToForm("menuReq");
      return false;
    } else if (this.type1 == -1) {
      this.presentToast("Please select item type");
      this.scrollToForm("menuReq");
      return false;
    }
    let item = {
      menu_name: this.menu1,
      menu_description: this.menuDesc1,
      menu_price: this.price1,
      nonveg: this.type1,
    };
    this.menuItems.push(item);
    return true;
  }

  validateForm2() {
    if (!this.form2) return true;
    if (
      this.menu2 == null ||
      this.menu2 == undefined ||
      this.menu2 == "" ||
      this.menu2.trim() == ""
    ) {
      this.presentToast("Please enter a Menu name.");
      this.scrollToForm("reqform2");
      return false;
    } else if (
      this.menuDesc2 == null ||
      this.menuDesc2 == undefined ||
      this.menuDesc2 == "" ||
      this.menuDesc2.trim() == ""
    ) {
      this.presentToast("Please enter a menu description.");
      this.scrollToForm("reqform2");
      return false;
    } else if (this.price2 <= 0 || this.price2 == null) {
      this.presentToast("Please enter a valid price");
      this.scrollToForm("reqform2");
      return false;
    } else if (this.type2 == -1) {
      this.presentToast("Please select item type");
      this.scrollToForm("reqform2");
      return false;
    }
    let item = {
      menu_name: this.menu2,
      menu_description: this.menuDesc2,
      menu_price: this.price2,
      nonveg: this.type2,
    };
    this.menuItems.push(item);
    return true;
  }

  validateForm3() {
    if (!this.form3) return true;
    if (
      this.menu3 == null ||
      this.menu3 == undefined ||
      this.menu3 == "" ||
      this.menu3.trim() == ""
    ) {
      this.presentToast("Please enter a Menu name.");
      this.scrollToForm("reqform3");
      return false;
    } else if (
      this.menuDesc3 == null ||
      this.menuDesc3 == undefined ||
      this.menuDesc3 == "" ||
      this.menuDesc3.trim() == ""
    ) {
      this.presentToast("Please enter a menu description.");
      this.scrollToForm("reqform3");
      return false;
    } else if (this.price3 <= 0 || this.price3 == null) {
      this.presentToast("Please enter a valid price");
      this.scrollToForm("reqform3");
      return false;
    } else if (this.type3 == -1) {
      this.presentToast("Please select item type");
      this.scrollToForm("reqform3");
      return false;
    }
    let item = {
      menu_name: this.menu3,
      menu_description: this.menuDesc3,
      menu_price: this.price3,
      nonveg: this.type3,
    };
    this.menuItems.push(item);
    return true;
  }

  async getMenuRequests() {
    const loading = await this.loadingController.create({
      message: "Please wait...",
    });
    await loading.present();
    this.server
      .getMenuRequests(this.userId, this.type)
      .subscribe((response: any) => {
        if (response && response.data) this.menuRequests = response.data;
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
}
