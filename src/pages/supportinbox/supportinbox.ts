import { Component , ViewChild } from '@angular/core';
import {  NavController, NavParams  ,ToastController , ModalController , Events, Content, TextInput  } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { UserInterface } from '../../services/userdata';
import { GeneralInterface } from '../../services/generalinterface';
import { AppHome } from '../home/home';
import { PaymentInfo } from '../paymentinfo/paymentinfo';
import { Faq } from '../faq/faq';
import { ChatService, ChatMessage, UserInfo } from "../../services/chat-service";
import {RelativeTime} from "../../pipes/relative-time";



/**
 * Generated class for the SupsportPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-supportinbox',
  templateUrl: 'supportinbox.html',
})
export class SupportInboxPage{

    @ViewChild(Content) content: Content;
    editorMsg = '';
    status : any;

    constructor(public navParams: NavParams, public message: ChatMessage ,public chatService: ChatService,public events: Events,public navCtrl : NavController) {
      this.scrollToBottom();
      this.events.subscribe("newMessage",()=>{
        this.status = "done";
        this.onFocus(); //focusing on new message
      })
    }

    close(){
      this.navCtrl.pop()
    }
    sendMsg() {
      if(this.editorMsg != ''){
        this.status  = 'pending';
        this.chatService.sendMsg(this.editorMsg);
        this.onFocus();
        this.editorMsg = '';
      }
    }
    onFocus() {
      this.content.resize();
      try {
          this.scrollToBottom();
      } catch (e) {
          console.log(e);
      }

    }
    scrollToBottom() {
        setTimeout(() => {
              try {
                  this.content.scrollToBottom();
              } catch (e) {
              }
        }, 500)
    }
}
