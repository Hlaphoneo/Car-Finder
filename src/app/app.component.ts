import { Component , ViewChild  } from '@angular/core';
import { Platform ,MenuController,Events} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { GeneralInterface } from '../services/generalinterface';
import { LocationService } from '../services/locationservice';
import { AccountService } from '../services/accountservice';
import { AppData } from '../services/appdata';

//providers
import { UserInterface } from '../services/userdata';
import { ChatService } from '../services/chat-service'; //dont rempve this injection , it is used to initialized to tracker on start

// --------------------------------------pages----------------------------------------------------

import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { ModeSelectPage } from '../pages/mode-select/mode-select';
import { TrackerHomePage } from '../pages/tracker-home/tracker-home';
import { AppHome } from '../pages/home/home';
import { StartBlankPage } from '../pages/start-blank/start-blank';

//-------------------------------------- Ionic plugins ------------------------------------------

import { Storage } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode';


export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
}

@Component({
  templateUrl: 'app.html',

})
export class MyApp {
  @ViewChild('content') navCtrl: NavController;
  loader: any;
  username: any = "Error";
  email: string = "Email error";
  rootPage:any = StartBlankPage; //the program starts with a blank page , so that the login page is not showed when the user passes from it the the application home tabs page

  constructor(public appData : AppData , public chatService : ChatService , public backgroundMode: BackgroundMode , public storage  : Storage , public user : UserInterface , public locationService : LocationService , public generalInterface : GeneralInterface , public loginListen : Events , public  account : AccountService, public loadingCtrl : LoadingController, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public menu : MenuController) {
    platform.ready().then(() => { //wait for the platform to be ready in order to use native plugins
      this.backgroundMode.enable(); // enabling background mode
      this.backgroundMode.disableWebViewOptimizations(); // enables background geo location
      statusBar.styleDefault();
      splashScreen.hide();
      this.locationService.setDefaults(); //resetting old location data
      this.appData.loadData(); //loading static application information

          account.loggedIn().then((loginState)=>{ //getting user login state
            //check if the user has seen the tut
                this.generalInterface.checkTutState().then((results)=>{
                  if(results !== true){
                     this.navCtrl.setRoot(WelcomePage);
                  }
                })

              if(loginState === true ) {      //user is already logged in
                  //getting the application mode
                  this.account.getAppMode().then((mode)=>{
                      if(mode == "tracker"){
                        this.navCtrl.setRoot(TrackerHomePage);
                      }
                      else if(mode =="reciever"){
                        this.navCtrl.setRoot(AppHome);
                      }
                      else{
                        this.navCtrl.setRoot(ModeSelectPage); //goto mode select page because the user didn't select any mode
                      }
                  })
              }else {
                //the user is not logged in , wait for the log in event
                this.loginListen.subscribe('user:login', () => {
                  this.chatService.getMsgList()// getting the message list after the login
                  this.navCtrl.setRoot(ModeSelectPage);  // after the user successfuly logins in in the login page , goto Mode Select Page
                })
                this.navCtrl.setRoot(LoginPage) //if the user is not logged in , please take them to the login page
              }
          });
    });
  }
  prepareUserInfo(name : string , email : string){
        this.email = email;
        this.username = name;
  }
}
