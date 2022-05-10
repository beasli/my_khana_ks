import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Camera, CameraOptions } from "@awesome-cordova-plugins/camera/ngx";
import {
  ActionSheetController,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { ServerService } from "src/app/service/server.service";

@Component({
  selector: "app-kitchen-pics",
  templateUrl: "./kitchen-pics.page.html",
  styleUrls: ["./kitchen-pics.page.scss"],
})
export class KitchenPicsPage implements OnInit {
  imageURI: any = "";
  photo: any;
  images: any;
  text: any;
  constructor(
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    public server: ServerService
  ) {}

  ngOnInit() {
    this.text = JSON.parse(localStorage.getItem("app_text"));
    this.loadImages();
  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(",");
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }

  public async ImageSelectionOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Select Image Source",
      buttons: [
        {
          text: "Load from Gallery",
          handler: () => {
            this.getImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "Use Camera",
          handler: () => {
            this.getImage(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }

  getImage(source) {
    console.log("get", source);
    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: source,
      targetWidth: 1500,
      targetHeight: 900,
      correctOrientation: true,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then(
      (imageData) => {
        this.photo = `data:image/png;base64,${imageData}`;
        this.imageURI = this.photo;
        console.log(this.imageURI);
        this.submitImage();
      },
      (err) => {
        console.log(JSON.stringify(err));
        this.toastController.create({
          message: JSON.stringify(err),
        });
      }
    );
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Please wait...",
    });
    await loading.present();
  }

  async dismissLoading() {
    this.loadingController.dismiss();
  }

  submitImage() {
    if (this.imageURI) {
      this.presentLoading();
      const formdata = new FormData();
      formdata.append("store_id", localStorage.getItem("user_id"));
      const file = this.DataURIToBlob(this.imageURI);
      console.log(file);
      formdata.append("gallery", file, "my_img.jpg");
      this.server.addImage(formdata).subscribe((response: any) => {
        this.dismissLoading();
        this.toastController.create({
          message: "Image added successfully.",
        });
        this.loadImages();
      });
    } else {
      this.toastController.create({
        message: "Please add an image.",
      });
    }
  }

  loadImages() {
    this.server
      .getImages(localStorage.getItem("user_id"))
      .subscribe((response: any) => {
        this.images = response.data;
      });
  }

  deleteImage(imgId) {
    this.server.deleteImage(imgId).subscribe((response: any) => {
      this.loadImages();
    });
  }

  public async ImageDeletionOptions(id) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Are you really want to delete this image?",
      buttons: [
        {
          text: "Delete",
          handler: () => {
            this.deleteImage(id);
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }
}
