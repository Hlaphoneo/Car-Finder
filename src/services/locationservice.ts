import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder,  NativeGeocoderReverseResult} from '@ionic-native/native-geocoder';
import { Events} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GeneralInterface } from './generalinterface';


@Injectable()
export class LocationService {
  database : any;
  constructor(public generalInterface : GeneralInterface , public events: Events,public decoder: NativeGeocoder,private geolocation: Geolocation,public storage: Storage) {
  }

  updateLocation(){
    var options = {
      enableHighAccuracy: true,
      timeout: 25000,
      maximumAge: 0
    };
    this.geolocation.getCurrentPosition(options).then((repsonse)=>{
      this.events.publish("locationchange",repsonse.coords.longitude,repsonse.coords.latitude); //im working here lol
    }).catch((error)=>{
      this.events.publish("locationchange",0,0);
    })
  }
  setDefaults(){
    this.setListeningState(false); //resetting the listening state to false , application must start listening again
    let currentLocation = {
        'x'     : '0',
        'y'     : '0',
        'city'  : 'Unknown',
        'dist'  : 'Unknown'
    }
    this.storage.set('currentLocation', currentLocation);
  }
  decodePositionAndSend(longitude: any , latitude: any){
    this.decoder.reverseGeocode(latitude, longitude).then((result: NativeGeocoderReverseResult) => {
      let currentLocation = {
          'x'     : latitude,
          'y'     : longitude,
          'city'  : result.city,
          'dist'  : result.district
      }

      this.storage.set('currentLocation', currentLocation);
     this.events.publish("locationchange",result.city,result.district,latitude,longitude); //im working here lol
     this.generalInterface.notify("Your location is now " + result.district + " ," + result.city);
    }).catch((error: any) =>{
      let currentLocation = {
          'x'     : '0',
          'y'     : '0',
          'city'  : 'Unknown',
          'dist'  : 'Unknown'
      }
      this.storage.set('currentLocation', currentLocation);
      this.events.publish("locationchange");
    });
  }
  setListeningState(state){
    this.storage.set("listening",state); //means the device is subscribed to location changes
  }
  getListeningState(){
    return this.storage.get('listening').then((state) => {
        return state;
    })
  }
}
