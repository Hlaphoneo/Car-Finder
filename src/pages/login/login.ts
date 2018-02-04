import { Component } from '@angular/core';
import { NavController , Platform , Events , ViewController} from 'ionic-angular'
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { ModalController ,ToastController } from 'ionic-angular';
import * as firebase from 'firebase/app';
import { LoadingController } from 'ionic-angular';
import { PasswordRecoverPage } from '../passwordrecover/passwordrecover';
import { SignupPage } from '../signup/signup';
// import { Facebook} from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { UserInterface } from '../../services/userdata';
import { AccountService } from '../../services/accountservice';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: any;
  password: any;
  user: Observable<firebase.User>;
  modal : any;

  constructor(public twitter: TwitterConnect , public account : AccountService , public toastCtrl : ToastController , public view : ViewController ,public events : Events , public userData : UserInterface ,public modalCtrl: ModalController, public afAuth: AngularFireAuth,public navCtrl: NavController,public loadingCtrl: LoadingController,public platform: Platform) {
        this.user = afAuth.authState;
        this.events.subscribe('user:login', () => {
            if(this.modal){
                this.modal.dismiss();
            }  //dissmiss the modal login only if the user is successfully loggedIn
        });



  }

  createLoader() {
    var ldobject = this.loadingCtrl.create({
      content: "Sending data..."
      });
      return ldobject;
  }
  emailSignupModal(){
    this.modal = this.modalCtrl.create(SignupPage);
    this.modal.present();
  }
  emailLogin(){
      if(this.validateEmail(this.email)){
        if(this.validatePassword()){
            this.account.emailLogin(this.email,this.password);
        }
      }
      else
        this.errorToast("Invalid email entered");
  }
  validatePassword(){
    if(this.password == null){
        this.errorToast("Please provide password")
        return false;
    }
    return true;
  }
  validateEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
    }
  facebookLogin(){
      // if(this.platform.is('cordova')){
      //     this.facebook.login(['email','public_profile']).then(response =>{
      //       const facebookCreds = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      //         firebase.auth().signInWithCredential(facebookCreds).then((response) =>{
      //           let currentUser = firebase.auth().currentUser;
      //             this.account.facebookLogin(JSON.stringify(currentUser.displayName),JSON.stringify(currentUser.uid),JSON.stringify(currentUser.photoURL));
      //       })
      //     })
      // }
  }
  presentModal() {
    let modal = this.modalCtrl.create(PasswordRecoverPage);
    modal.present();
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
