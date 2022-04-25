import { Component, OnInit } from "@angular/core";
import { NativeAudio } from "@ionic-native/native-audio/ngx";
import { OneSignal } from "@ionic-native/onesignal/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import {
  ActionSheetController,
  Events,
  NavController,
  Platform,
} from "@ionic/angular";
import { ServerService } from "./service/server.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  appType: number = 0;
  dir: string = "ltr";
  text: any;
  store: any = "";
  public appPages: any = [];

  geoLatitude = null;
  geoLongitude = null;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public nav: NavController,
    private oneSignal: OneSignal,
    public events: Events,
    public server: ServerService,
    private nativeAudio: NativeAudio,
    private actionSheetController: ActionSheetController
  ) {
    this.events.subscribe("lang_change", (type) => {
      this.assginAppType(type);
    });
    if (
      localStorage.getItem("user_id") &&
      localStorage.getItem("user_id") != "null" &&
      localStorage.getItem("user_id") != undefined
    ) {
      this.updateAppVersion(localStorage.getItem("user_id"));
    }

    if (localStorage.getItem("app_text")) {
      this.text = JSON.parse(localStorage.getItem("app_text"));

      this.appPages = [
        {
          title: this.text.home,
          url: "/home",
          icon: "home",
        },
        // {
        // title: this.text.language,
        // url: '/lang',
        // icon: 'flag'
        // },
        {
          title: this.text.account,
          url: "/profile",
          icon: "person",
        },
        {
          title: this.text.s_menu_title,
          url: "/item",
          icon: "restaurant",
        },
        {
          title: "Packaging Request",
          url: "/material",
          icon: "paper-plane",
        },
        {
          title: "Order History",
          url: "/order",
          icon: "arrow-round-forward",
        },
        {
          title: "Menu Request",
          url: "/menuadd",
          icon: "menu",
        },
        {
          title: "Payments History",
          url: "/payments",
          icon: "cash",
        },
        {
          title: "Privacy Policy",
          url: "/policy",
          icon: "arrow-round-forward",
        },
        {
          title: "Terms of Use",
          url: "/terms",
          icon: "arrow-round-forward",
        },
      ];
    } else {
      var home: any = "Home";
      var lang: any = "Language";
      var profile: any = "My Account";
      var menuItem: any = "Menu Item";

      this.appPages = [
        {
          title: home,
          url: "/home",
          icon: "home",
        },
        // {
        // title: lang,
        // url: '/lang',
        // icon: 'flag'
        // },
        {
          title: profile,
          url: "/profile",
          icon: "person",
        },
        {
          title: menuItem,
          url: "/item",
          icon: "restaurant",
        },
        {
          title: "Packaging Request",
          url: "/material",
          icon: "paper-plane",
        },
        {
          title: "Order History",
          url: "/order",
          icon: "arrow-round-forward",
        },
        {
          title: "Menu Request",
          url: "/menuadd",
          icon: "menu",
        },
        {
          title: "Payments History",
          url: "/payments",
          icon: "cash",
        },
        {
          title: "Policy",
          url: "/policy",
          icon: "arrow-round-forward",
        },
        {
          title: "Terms",
          url: "/terms",
          icon: "arrow-round-forward",
        },
      ];
    }

    this.events.subscribe("text", (text) => {
      this.text = text;
      let storeData = JSON.parse(localStorage.getItem("storeData"));
      this.appPages = [
        {
          title: text.home,
          url: "/home",
          icon: "home",
          isVisible: true,
        },
        // {
        // title: text.language,
        // url: '/lang',
        // icon: 'flag'
        // },
        {
          title: text.account,
          url: "/profile",
          icon: "person",
          isVisible: true,
        },
        {
          title: "Meals & Beverages Menu",
          url: "/item",
          icon: "restaurant",
          isVisible: storeData.is_ks,
        },
        {
          title: "Bakery Menu",
          url: "/bakery",
          icon: "restaurant",
          isVisible: storeData.is_baker,
        },
        {
          title: "Packaging Request",
          url: "/material",
          icon: "paper-plane",
          isVisible: storeData.is_ks,
        },
        {
          title: "Order History",
          url: "/order",
          icon: "arrow-round-forward",
          isVisible: true,
        },
        {
          title: "Meals & Beverages Request",
          url: "/menuadd/meals",
          icon: "menu",
          isVisible: storeData.is_ks,
        },
        {
          title: "Bakery Menu Request",
          url: "/menuadd/bakery",
          icon: "menu",
          isVisible: storeData.is_baker,
        },
        {
          title: "Payments History",
          url: "/payments",
          icon: "cash",
          isVisible: true,
        },
        {
          title: "Privacy Policy",
          url: "/policy",
          icon: "arrow-round-forward",
          isVisible: true,
        },
        {
          title: "Terms of Use",
          url: "/terms",
          icon: "arrow-round-forward",
          isVisible: true,
        },
      ];
    });

    if (localStorage.getItem("app_type")) {
      if (localStorage.getItem("app_type") == "1") {
        this.dir = "rtl";
      } else {
        this.dir = "ltr";
      }
    }

    if (
      localStorage.getItem("user_id") &&
      localStorage.getItem("user_id") != "null"
    ) {
      this.nav.navigateRoot("/home");
    } else {
      this.nav.navigateRoot("/login");
    }

    this.initializeApp();

    this.events.subscribe("user_login", (id) => {
      this.subPush(id);
    });
  }

  ngOnInit(): void {}
  assginAppType(ty) {
    this.dir = ty == 0 ? "ltr" : "rtl";
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#f44336");
      this.statusBar.styleLightContent();

      this.subPush();
    });
  }

  subPush(id = 0) {
    this.oneSignal.startInit(
      "9a5ab3ff-3e62-40ea-b791-c7f840a10507",
      "546948059643"
    );

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.Notification
    );

    this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
      this.nativeAudio
        .preloadSimple("audio", "assets/alert.mp3")
        .then(
          (data: any) => {
            console.log("dupletx", data);
            this.nativeAudio.loop("audio").catch((error) => console.log(error));
            this.nativeAudio.setVolumeForComplexAsset("audio", 1);
            this.presentActionSheet();
          },
          (error) => {
            console.log(error);
          }
        )
        .catch((error) => {
          console.log(error);
        });
    });
    this.nativeAudio.unload;

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
    });

    if (
      localStorage.getItem("user_id") &&
      localStorage.getItem("user_id") != "null"
    ) {
      this.oneSignal.sendTags({ user_id: localStorage.getItem("user_id") });
    }

    if (id > 0) {
      this.oneSignal.sendTags({ user_id: id });
    }

    this.oneSignal.endInit();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "New Notification",
      mode: "ios",
      buttons: [
        {
          text: "OK",
          icon: "volume-mute",
          handler: () => {
            console.log("Delete clicked");
            this.nativeAudio.stop("audio").then(
              () => console.log("done"),
              () => console.log("error")
            );
            this.nativeAudio.unload("audio");
          },
        },
      ],
    });

    await actionSheet.present();
  }

  updateAppVersion(id) {
    this.server.updateAppVersion(id, "1.0.7").subscribe((response: any) => {});
  }
}
