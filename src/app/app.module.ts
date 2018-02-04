import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import {AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule} from 'angularfire2/auth';
import { MyApp } from './app.component';
import { TwitterConnect } from '@ionic-native/twitter-connect';


// --------------------------------------------------- Services --------------------------------------------------------------------

import { UserInterface } from '../services/userdata';
import { ReportService } from '../services/reportservice';
import { LocationService } from '../services/locationservice';
import { MessagingService } from '../services/messageservice';
import { AccountService } from '../services/accountservice';
import { Tracker } from '../services/tracker';
import { GeneralInterface } from '../services/generalinterface';
import { TrackerService } from '../services/tracker_service';
import { ChatMessage } from '../services/chat-service';
import { ChatService } from '../services/chat-service';
import { UserInfo } from '../services/chat-service';
import { AppData } from '../services/appdata';

//================================================== Pipes =======================================================================

// --------------------------------------------------- Pages --------------------------------------------------------------------
import { ModeSelectPage } from '../pages/mode-select/mode-select';
import { AppAboutPage } from '../pages/app-about/app-about';
import { WelcomePage } from '../pages/welcome/welcome';
import { SupportPage } from '../pages/support/support';
import { SignupPage} from '../pages/signup/signup';
import { PasswordRecoverPage } from '../pages/passwordrecover/passwordrecover';
import { AppHome } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TermsOfService } from '../pages/termsofservice/termsofservice';
import { StartBlankPage } from '../pages/start-blank/start-blank';
import { TrackerHomePage } from '../pages/tracker-home/tracker-home';
import { SettingsPopOverPage } from '../pages/settings-pop-over/settings-pop-over';
import { SelectTrackerPage } from '../pages/select-tracker/select-tracker';
import { ManageTrackersPage } from '../pages/manage-trackers/manage-trackers';
import { TrackerDevicePage } from '../pages/tracker-device/tracker-device';
import { PrivacySettingsPage } from '../pages/privacy-settings/privacy-settings';
import { NewTrackerPage } from '../pages/new-tracker/new-tracker';
import { PaymentInfo } from '../pages/paymentinfo/paymentinfo';
import { Faq } from '../pages/faq/faq';
import { SupportInboxPage } from '../pages/supportinbox/supportinbox';






import { IonicStorageModule } from '@ionic/storage';
import {GoogleMaps} from '@ionic-native/google-maps';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { BatteryStatus } from '@ionic-native/battery-status';
import { HttpModule } from '@angular/http';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Network } from '@ionic-native/network';
import { RestProvider } from '../providers/rest/rest';


export const firebaseConfig = {
       apiKey: "AIzaSyDQL21yq5O5RIqBuUk-NW8t4YgpyCvd_yA",
      authDomain: "konza-carfinder.firebaseapp.com",
      databaseURL: "https://konza-carfinder.firebaseio.com",
      projectId: "konza-carfinder",
      storageBucket: "konza-carfinder.appspot.com",
      messagingSenderId: "1080628398431"
};


@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    ModeSelectPage,
    LoginPage,
    SignupPage,
    SupportPage,
    PasswordRecoverPage ,
    AppHome,
    AppAboutPage,
    TermsOfService,
    StartBlankPage,
    TrackerHomePage,
    SettingsPopOverPage,
    SelectTrackerPage,
    ManageTrackersPage,
    TrackerDevicePage,
    PrivacySettingsPage,
    NewTrackerPage,
    PaymentInfo,
    Faq,
    SupportInboxPage
//
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
     AngularFireDatabaseModule,
     HttpModule,
     AngularFireAuthModule,
     IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    ModeSelectPage,
    LoginPage,
    SignupPage,
    SupportPage,
    PasswordRecoverPage ,
    AppHome,
    AppAboutPage,
    TermsOfService,
    StartBlankPage,
    TrackerHomePage,
    SettingsPopOverPage,
    SelectTrackerPage,
    ManageTrackersPage,
    TrackerDevicePage,
    PrivacySettingsPage,
    NewTrackerPage,
    PaymentInfo,
    Faq,
    SupportInboxPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GeneralInterface,
    TrackerService,
    ChatMessage,
    ChatService,
    UserInfo,
    AppData,
    Geolocation,
    BatteryStatus,
    GoogleMaps,
    BackgroundMode,
    TwitterConnect,
    LocalNotifications,
    UserInterface,
    ReportService,
    NativeGeocoder,
    LocationService,
    MessagingService,
    AccountService,
    Tracker,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider
  ]
})
export class AppModule {}
