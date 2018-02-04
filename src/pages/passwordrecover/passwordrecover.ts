import { Component } from '@angular/core';
import {  NavController, NavParams , ViewController , Events } from 'ionic-angular';
import { AccountService } from '../../services/accountservice'; //userdate provider
import { LoadingController , ModalController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the LoginmodalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-loginmodal',
  templateUrl: 'passwordrecover.html',
})
export class PasswordRecoverPage {
  email: any;
  name: any;
  status : any;
  error : any;

  constructor(public modalCtrl : ModalController , public account : AccountService , public events: Events , public loadingCtrl: LoadingController,public afAuth: AngularFireAuth,public view : ViewController ,public navCtrl: NavController, public navParams: NavParams) {
    this.events.subscribe('recovered', (message) => {
        this.error = null;
        this.status = message;
        this.email = "";
        this.name = null
      })
    this.events.subscribe('error', (message) => {
        this.status = null;
        this.error = message;
      })
  }
  recoverPassword(){
    this.account.recoverPassword(this.email)
    //you can send the name of the person making the recovery to the firebase real time database
  }
  showSignup(){
    // this.modal = this.modalCtrl.create(SignupPage);
    // this.modal.present();
    this.navCtrl.push(SignupPage)
  }
}
