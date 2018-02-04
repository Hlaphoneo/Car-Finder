import { Component } from '@angular/core';
import { NavController, NavParams , ModalController , ToastController  } from 'ionic-angular';
import { TermsOfService } from '../termsofservice/termsofservice';
import { AccountService } from  '../../services/accountservice'

/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  email : string;
  password: any;
  name: string;
  toastTracker : any;

  constructor(public account : AccountService ,public toastCtrl : ToastController , public modalCtrl : ModalController , public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  presentTerms(){
      let modal = this.modalCtrl.create(TermsOfService);
      modal.present();
  }
  signupEmail(){
    if(this.validateInput()){
      this.account.emailSignUp(this.email,this.password,this.name);

    }
  }
  validateInput(){
    if(this.name == null){
        this.errorToast("Please provide a name");
        return false;
    }
    else {
      if(this.name.length > 35){
        this.errorToast("Name too long");
        return false
      }
      if(this.name.length < 2){
        this.errorToast("Name too short")
        return false
      }
      for(var i =  0; i < this.name.length; i ++){
          if(!(this.name.charCodeAt(i) >= 97 && this.name.charCodeAt(i) <= 122) && !(this.name.charCodeAt(i) >= 65 && this.name.charCodeAt(i) <= 90) && this.name.charCodeAt(i) != 32){
                this.errorToast("Name can only contain letters");
                return false;
          }
      }
    }
    if(this.email == null){
        this.errorToast("Please provide email")
        return false;
    }else {
        if(this.validateEmail(this.email)){
        }
        else {
          this.errorToast("Invalid email entered");
          return false;
        }
    }
    if(this.password == null){
        this.errorToast("Please provide password")
        return false;
    }
    else {
      if (this.password.length < 6) {
        this.errorToast("Password too short , at least 6 characters");
        return false;
      }
    }

    return true;
  }
  validateEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
    }
  errorToast(messageData : string) {
      let toast = this.toastCtrl.create({
        message: messageData,
        duration: 3000,
        dismissOnPageChange: true,
        cssClass: "toastStyle"
      });
      toast.present();
    }
}
