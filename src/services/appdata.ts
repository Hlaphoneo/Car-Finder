import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import { Events} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as firebase from 'firebase/app';
import * as $ from 'jquery'

@Injectable()
export class AppData {
  database : any;
  paymentinfo : any;
  contacts : any;
  faq : any
  tos : any ; //terms of service
  constructor(public events: Events,public ngDatabase : AngularFireDatabase ,public storage: Storage) {
      this.database = firebase.database();
  }

  loadData(){
    this.loadTerms();
    this.loadContacts();
    this.loadFaq();
    this.loadPaymentInfo();

  }
  loadPaymentInfo(){
      this.database.ref('/static_app_info/paymentinfo').once('value').then((snapshot) => {
        this.paymentinfo = snapshot.val();
    })
  }
  loadContacts(){
        this.database.ref('/static_app_info/contacts').once('value').then((snapshot) => {
          this.contacts = snapshot.val();
      })
  }
  loadFaq(){
        this.database.ref('/static_app_info/faq').once('value').then((snapshot) => {
          this.faq = Array(snapshot.val());
          this.faq  = $.map(snapshot.val(), (el) => { //converting the jason data to array
             return el });
      })
  }
  loadTerms(){
      this.database.ref('/static_app_info/tos').once('value').then((snapshot) => {
        this.tos = snapshot.val();
    })
  }
}
