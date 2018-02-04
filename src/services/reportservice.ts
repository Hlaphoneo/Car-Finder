import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Events , AlertController } from 'ionic-angular';
import * as firebase from 'firebase/app';
import { UserInterface } from './userdata';
import { Storage } from '@ionic/storage';
import { GeneralInterface } from './generalinterface';
import { Http , Headers } from '@angular/http';


@Injectable()
export class ReportService {
  database : any;
  reportsDatabase : any;
  index: any;
  list : any;
  reports : Array<any>;
  reference : any;
  report : Array<any>;
  MyReports : Array<any>;
  prevChannel : any;
  i : any = 0; //this refeences is used inside the loadMyReports() fucntions

  constructor( public storage : Storage, public http: Http , public generalInterface : GeneralInterface , public  user : UserInterface , public ngDatabase : AngularFireDatabase , public events : Events , public alertCtrl: AlertController) {
        this.database = firebase.database();
        this.MyReports = new Array();
  }

  getLocalReports(){
    return this.storage.get("reports").then((list)=>{
      return list;
    })
  }
  loadUserReports(keys : any){
    let reports = firebase.database();
    var ref = reports.ref('UNVERIFIED').orderByPriority().limitToLast(5);
      ref.once('value',(data)=>{
      let reportList = data.val(); //object containing all the reports data
      let listKeys = Object.keys(reportList); //reference keys.
      listKeys.reverse(); //reversing array so that it appears in the right order
      let list = {
        reportList:reportList,
        listKeys  : listKeys
        }
      this.events.publish('reports:ready',list);
    },(error)=>{
      alert(error)
    });
  }
  loadMyReports(keysList : any , channel : string){
    if(this.prevChannel != null){
      this.events.unsubscribe(this.prevChannel); //unsubscribing the old channels. :) making space for a new channel
    }
    this.prevChannel = channel; //saving channel for removal public loadingCtrl : LoadingController  ,
    let service = this;    //this variable is used to reference that current object (ReportService) within scope
    let expectedLength = keysList.listKeys.length ;
    //note service.i uses the local counter variable (i);
      for(service.i ; service.i < keysList.listKeys.length ; service.i++){
          this.database.ref('UNVERIFIED/'+keysList.list[keysList.listKeys[service.i]]).once('value',(data)=>{
              this.events.publish(channel,data.val(),expectedLength);
          },(error)=>{
            alert(error)
          });
        }

    service.i = 0; //resesting the reference counter varibale so that it can  be used again
  }
  loadGetReportReferences(reference : string){
      var ref = this.database.ref('users/'+reference+"/0/reportreferences");
        return ref.once('value',(data)=>{
        let reportList = data.val(); //object containing all the reports data
          if(reportList != null){
            let listKeys = Object.keys(reportList); //reference keys.
            listKeys.reverse(); //reversing array so that it appears in the right order
            let list = {
              listKeys  : listKeys,
              list : reportList
              }
              this.events.publish('keys:ready',list);
            }
      }).catch((error)=> {
        alert("error failed to connect")
      });
  }
  incViews(key : any){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let data = {
        'key':key
    }
    var content = JSON.stringify(data);
    this.http.post('https://us-central1-konza-carfinder.cloudfunctions.net/incViews',content,headers)
    .subscribe((data) => {
    })
  }
  addHope(key : any){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
        this.user.getUserReference().then((reference) =>{ //getiing user reference as always :)
        let data = {
            'key':key,
            'userreference' : reference
        }

        var content = JSON.stringify(data);
        this.http.post('https://us-central1-konza-carfinder.cloudfunctions.net/addHopeRef',content,headers)
        .subscribe((data) => {
        })
    })
  }
  prepareReport(){
      let reports = firebase.database();
      var ref = reports.ref('UNVERIFIED').orderByPriority().limitToLast(5);
        ref.once('value',(data)=>{
        let reportList = data.val(); //object containing all the reports data
        if(reportList != null){
        let listKeys = Object.keys(reportList); //reference keys.
        listKeys.reverse(); //reversing array so that it appears in the right order
        let list = {
          reportList:reportList,
          listKeys  : listKeys
          }
        this.events.publish('reports:ready',list);
      }else{
          this.events.publish('reports:ready','empty');
      }

      },(error)=>{
        this.events.publish('reports:ready','error');
        alert(error)
      });
    }
  submitReport(data: any){
    this.user.getUserReference().then((reference) =>{
        let report = {
                      'carname' : data.carName ,
                      'buyear' : data.carDate,
                      'carregistration' : data.carReg,
                      'carcolor' : data.carColor,
                      'carstate' : data.carState,
                      'carmissingdate' : data.missingDate,
                      'carmissingcity' : data.missingLocation,
                      'carmissinglocationexact' : data.missingStrict,
                      'missingmethod' : data.methodOfLosing,
                      'moreaboutmissing' : data.missingMoreInfo,
                      'pictures' : [{"first": data.pictures[0] , "second":data.pictures[1], "third":data.pictures[2]}],
                      'usecell' : data.mobileUser1,
                      'usercellother' : data.mobileUser2,
                      'investigatorcell' : data.mobileInvestigator,
                      'supportdoc' :  data.supportUrl,
                      'reward' : data.reward,
                      'views' : 0,
                      'hope' : 0,
                      'found' : false,
                      'verified' : false,
                      'paid' : false,
                      'userreference' : reference,
                      'timestamp' :'',
                      'verimessage' :'',
                      'hopes' :''
                }

                var headers = new Headers();
                var content = JSON.stringify(report);
                headers.append('Content-Type', 'application/json');

                this.http.post('https://us-central1-konza-carfinder.cloudfunctions.net/addReport',content,headers)
                .subscribe((data) => {

                })
      })
  }
  validate(data: any , mode){
      if(mode === "personalinformation"){
        if(data.carName === ""){
          let message = "Please provide a car name or make."
          this.showAlert(message);
          return false;
        }
        if(data.carColor === ""){
          let message = "Please provide car color."
          this.showAlert(message);
          return false;
        }
        if(data.carReg === ""){
          let message = "Please provide registration number."
          this.showAlert(message);
          return false;
        }
      }
      if(mode === "location"){
        if(data.missingLocation === ""){
          let message = "Please provide a city.."
          this.showAlert(message);
          return false;
        }
        if(data.missingStrict === ""){
          let message = "Provide more accurate location."
          this.showAlert(message);
          return false;
        }
      }
      if(mode === "investigationinformation"){
        if(data.missingDate === ""){
          let message = "Please provide date."
          this.showAlert(message);
          return;
        }
        if(data.methodOfLosing === ""){
          let message = "Please fill all the required information"
          this.showAlert(message);
          return;
        }
            this.events.publish('investigationinformation:ok'); // making sure that the modal closes
      }
      if(mode === "contactinformation"){
        if(data.mobileUser1 === ""){
          let message = "Please enter your cellphone number."
          this.showAlert(message);
          return false;
        }
        if(data.mobileUser2 === ""){
          let message = "You are submitting a report without alternative mobile."
          this.showAlertWithCancelContact(message);
          return;
        }else{
          this.events.publish('contact:ok'); // making sure that the modal closes
        }

      }
      if(mode === "images"){
        //  checking if user selected at least one pictures
          var exists = false;
          for(var i = 0, exists = false ; i < data.pictures.length ; i++){
              if(data.pictures[i] != '../assets/placeholders/uploadplaceholder.png'){
                  exists = true;
              }
          }
          if(exists == false){
            let message = "Are you sure you want to continue without attaching at least one picture of your vehicle ?"
            this.showAlertWithCancel(message);
          }
          else
            this.events.publish('images:ok'); // making sure that the modal closes
      }
  }
  errData(data){
      alert(data)
  }
  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Note!',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  showAlertWithCancel(message) {
    let alert = this.alertCtrl.create({
      title: 'Note!',
      subTitle: message,
      buttons: [{
          text: 'CANCEL',
          handler: () => {
          }
        },
        {
          text: 'CONTINUE',
          handler: () => {
            this.events.publish('images:ok'); // making sure that the modal closes
          }
        }]
    });
    alert.present();
  }
  showAlertWithCancelContact(message) {
    let alert = this.alertCtrl.create({
      title: 'Note!',
      subTitle: message,
      buttons: [{
          text: 'CANCEL',
          handler: () => {
          }
        },
        {
          text: 'CONTINUE',
          handler: () => {
            this.events.publish('contact:ok'); // making sure that the modal closes
          }
        }]
    });
    alert.present();
  }
}
