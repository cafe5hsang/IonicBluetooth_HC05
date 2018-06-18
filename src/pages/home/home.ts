import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { ToastController } from 'ionic-angular';

import { DevicesPage } from '../devices/devices';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	I1: number;
	I2: number;
	U1: number;
	U2: number;
	P1: number;
	P2: number;
	DP: number;

	DIM: number;

	timeOnStart = '00:00';
	timeOnEnd = '00:00';

	constructor(
			public navCtrl: NavController, 
			private toastCtrl: ToastController, 
			private bluetooth: BluetoothSerial) {
		this.bluetooth.enable();
	}

	ionViewDidEnter() {
        this.bluetooth.isConnected().then(() => {
        	this.presentToast('Đã kết nối với thiết bị');

	  		this.bluetooth.subscribeRawData().subscribe((dt) => {
				this.bluetooth.read().then((data) => {
					if (data.indexOf('U1') >= 0) {
	        			this.U1 = +data.replace('U1:', '');
	        		} else if (data.indexOf('U2') >= 0) {
	        			this.U2 = +data.replace('U2:', '');
	        		} else if (data.indexOf('I1') >= 0) {
	        			this.I1 = +data.replace('I1:', '');
	        		} else if (data.indexOf('I2') >= 0) {
	        			this.I2 = +data.replace('I2:', '');
	        		} else if (data.indexOf('P1') >= 0) {
	        			this.P1 = +data.replace('P1:', '');
	        		} else if (data.indexOf('P2') >= 0) {
	        			this.P2 = +data.replace('P2:', '');
	        		} else if (data.indexOf('DP') >= 0) {
	        			this.DP = +data.replace('DP:', '');
	        		}
				});
	  		});

        }, () => {
        	this.presentToast('Chưa kết nối với thiết bị');
        });
    }

    changeTimeStart() {
    	let data: string = 'O' + this.timeOnStart.replace(':', '');
		this.bluetooth.isConnected().then(() => {
			this.bluetooth.write(data);
		}, () => {
			this.presentToast('Chưa kết nối với thiết bị');
		});
    }

    changeTimeEnd() {
    	let data: string = 'F' + this.timeOnEnd.replace(':', '');
		this.bluetooth.isConnected().then(() => {
			this.bluetooth.write(data);
		}, () => {
			this.presentToast('Chưa kết nối với thiết bị');
		});
    }

	// device list
	openDevicePage() {
	  this.navCtrl.push(DevicesPage, {
	    bluetooth: this.bluetooth
	  });
	}

	sendDim() {
		let dimData: string = 'D' + this.DIM;
		this.bluetooth.isConnected().then(() => {
			this.bluetooth.write(dimData);
		}, () => {
			this.presentToast('Chưa kết nối với thiết bị');
		});
	}

	presentToast(msg: string) {
		let toast = this.toastCtrl.create({
		  message: msg,
		  duration: 500
		});
		toast.present();
	}
}
