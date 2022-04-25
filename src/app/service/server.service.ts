import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ServerService {
  //put /api/store/ after your url e.g https://www.abc.com/api/store/
  url = "https://www.mykhaana.in/" + "testenv/" + "api/store/";
  api = "https://www.mykhaana.in/api/";
  // url = "http://delivery.test/api/store/";
  //api = "http://delivery.test/api/";

  constructor(private http: HttpClient) {}

  login(data) {
    return this.http
      .post(this.url + "login", data)
      .pipe(map((results) => results));
  }

  homepage(id, status, from, to) {
    return this.http
      .get(
        this.url +
          "homepage_v1?id=" +
          id +
          "&lid=" +
          localStorage.getItem("lid") +
          "&status=" +
          status +
          "&from=" +
          from +
          "&to=" +
          to
      )
      .pipe(map((results) => results));
  }

  getPayments(id, pageNo) {
    return this.http
      .get(this.api + "kspayment_details/" + id + "?pageno=" + pageNo)
      .pipe(map((results) => results));
  }

  lang() {
    return this.http.get(this.url + "lang").pipe(map((results) => results));
  }

  userInfo(id) {
    return this.http
      .get(this.url + "userInfo/" + id)
      .pipe(map((results) => results));
  }

  updateInfo(data) {
    return this.http
      .post(this.url + "updateInfo", data)
      .pipe(map((results) => results));
  }

  upLocation(data) {
    return this.http
      .post(this.url + "updateLocation", data)
      .pipe(map((results) => results));
  }

  forgot(data) {
    return this.http
      .post(this.url + "forgot", data)
      .pipe(map((results) => results));
  }

  verify(data) {
    return this.http
      .post(this.url + "verify", data)
      .pipe(map((results) => results));
  }

  updatePassword(data) {
    return this.http
      .post(this.url + "updatePassword", data)
      .pipe(map((results) => results));
  }

  storeOpen(type) {
    return this.http
      .get(this.url + "storeOpen/" + type)
      .pipe(map((results) => results));
  }

  orderProcess(id, status) {
    return this.http
      .get(this.url + "orderProcess?id=" + id + "&status=" + status)
      .pipe(map((results) => results));
  }

  getItem(id) {
    return this.http
      .get(
        this.url +
          "getItemData?id=" +
          id +
          "&lid=" +
          localStorage.getItem("lid") +
          "&isStore=true"
      )
      .pipe(map((results) => results));
  }

  getDisabledItem(id) {
    return this.http
      .get(
        this.url +
          "getItemData?id=" +
          id +
          "&lid=" +
          localStorage.getItem("lid")
      )
      .pipe(map((results) => results));
  }

  getBakeryData(id) {
    return this.http
      .get(
        this.url +
          "getBakeryData?id=" +
          id +
          "&lid=" +
          localStorage.getItem("lid") +
          "&isStore=true"
      )
      .pipe(map((results) => results));
  }

  changeStatus(id, status) {
    return this.http
      .get(this.url + "changeStatus?id=" + id + "&status=" + status)
      .pipe(map((results) => results));
  }

  assignDelivery(store_id, order_id) {
    return this.http
      .post(this.api + "dunzo/createtask/" + store_id + "/" + order_id, {})
      .pipe(map((results) => results));
  }

  getMaterialForUser(store_id) {
    return this.http
      .get(this.url + "getMaterial/" + store_id)
      .pipe(map((results) => results));
  }

  getMenuRequests(store_id, type) {
    let endPoint = type == "meals" ? "getMenu/" : "getBakeryMenu/";
    return this.http
      .get(this.url + endPoint + store_id)
      .pipe(map((results) => results));
  }

  submitMaterial(data) {
    return this.http
      .post(this.url + "createMaterialOrder", data)
      .pipe(map((results) => results));
  }

  submitMenuItems(data, type) {
    let endPoint = type == "meals" ? "createMenu" : "createBakeryMenu";
    return this.http
      .post(this.url + endPoint, data)
      .pipe(map((results) => results));
  }
  pages() {
    return this.http
      .get(this.api + "pages?lid=" + localStorage.getItem("lid"))
      .pipe(map((results) => results));
  }

  updateAppVersion(store_id, version) {
    return this.http
      .get(this.url + "updateversion/" + store_id + "?version=" + version)
      .pipe(map((results) => results));
  }

  addImage(data) {
    return this.http
      .post(this.url + "addImage", data)
      .pipe(map((results) => results));
  }

  getImages(store_id) {
    return this.http
      .get(this.url + "getUserImage/" + store_id)
      .pipe(map((results) => results));
  }

  deleteImage(id) {
    return this.http
      .get(this.url + "deleteImage/" + id)
      .pipe(map((results) => results));
  }
}
