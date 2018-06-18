import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

@Component({
  selector: 'page-devices',
  templateUrl: 'devices.html',
})
export class DevicesPage {
  bluetooth: BluetoothSerial;
  devices: any[] = [];
  loader: any;

  connectSubscribe: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    this.bluetooth = this.navParams.get('bluetooth');
  }

  ionViewDidLeave() {
    //if (this.connectSubscribe && this.connectSubscribe.unsubscribe) { this.connectSubscribe.unsubscribe(); }
  }

  deviceSelected(device: any) {
    this.presentLoading('Đang kết nối với thiết bị ' + device.name);

    this.connectSubscribe = this.bluetooth.connect(device.id).subscribe(
      value => { this.presentToast('Đã kết nối với thiết bị ' + device.name); this.loader.dismiss(); },
      error => { this.presentToast('Không kết nối được với thiết bị ' + device.name); this.loader.dismiss(); },
      () => { }
    );
  }

  searchDevices() {
    this.presentLoading('Đang dò tìm thiết bị');

    this.bluetooth.list().then(data => {
      this.devices = data;
    }).catch(error => {
      this.presentToast("Có lỗi xảy ra! Vui lòng kiểm tra Bluetooth");
    }).then(data => {
      this.loader.dismiss();
    });
  }

  presentToast(data: any) {
    let toast = this.toastCtrl.create({
      message: data,
      duration: 1000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  presentLoading(msg: string) {
    this.loader = this.loadingCtrl.create({
      content: msg,
      dismissOnPageChange: true 
    });
    this.loader.present();
  }

}
