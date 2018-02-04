import { Component } from '@angular/core';
import {  NavController, NavParams  ,ToastController ,Events , ModalController  } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { UserInterface } from '../../services/userdata';
import { AppHome } from '../home/home';
import { PaymentInfo } from '../paymentinfo/paymentinfo';
import { Faq } from '../faq/faq';
import { SupportInboxPage } from '../supportinbox/supportinbox';

import { GeneralInterface } from '../../services/generalinterface';
import { AppData } from '../../services/appdata';





/**
 * Generated class for the SupsportPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage {
  supportMessage : string;

  constructor(public appData : AppData , public modalCtrl : ModalController , public events : Events ,public user : UserInterface ,public genInterface : GeneralInterface ,public toastCtrl : ToastController ,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupportPage');
  }
  submit(form: NgForm) {
    if (form.valid) {
        this.genInterface.addSupportMessage(this.supportMessage,this.user.getUserReference() , this.user.getUsername()); //sending information from the UserInterface

      //if information sending is successful
      this.supportMessage = '';
      let toast = this.toastCtrl.create({
        message: 'Your support has been sent.',
        duration: 3000
      });
        toast.present();

    }
  }
  close(){
    this.navCtrl.pop();
  }
  faq(){
      let modal = this.modalCtrl.create(Faq);
        modal.present();
  }

  openInbox(){
    let modal = this.modalCtrl.create(SupportInboxPage);
      modal.present();
  }

  contact(){
    let toast = this.toastCtrl.create({
      message: 'CAR FINDER \n  \n Phone : '+this.appData.contacts.Phone+' \n Email : '+this.appData.contacts.Email+' \n  Website : '+this.appData.contacts.Website+'\n Facebook : Car Finder - '+this.appData.contacts.Facebook+' \n Twitter : '+this.appData.contacts.Twitter,
      position:"middle",
      showCloseButton : true,
      closeButtonText  : "Close",
      dismissOnPageChange : true,
      cssClass : "contacttoast"
    });
      toast.present();
  }
  payment(){
    let modal = this.modalCtrl.create(PaymentInfo);
      modal.present();
    }
}
