const functions = require('firebase-functions');
const cors = require('cors')({
  origin: true
});

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.disconnect_tracker = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', "*") //allowing cross origin

  let data = JSON.parse(req.body);
  let tracker_id = data.id;
  //setting link status to false;
  admin.database().ref('/tracker_ids/'+tracker_id+'/0').update({
        'link_status': 0,
        'link_ref':'none'
      });

  //Removing tracke snapshot
  admin.database().ref('/trackers/'+tracker_id).remove();
  res.set('Content-Type', 'text/html');
  res.status(200).send('trackerremoved');
});
exports.update_battery = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', "*") //allowing cross origin

  let data = JSON.parse(req.body);
  let tracker_id = data.id;
  let battery_level = data.battery_level;
  //setting link status to false;
  admin.database().ref('/trackers/'+tracker_id).update({
        'link_status': 0,
        'link_ref':'none',
        'battery_level' : battery_level
      });
  res.status(200) //sending back response and stoping the timeout
  res.send();
});
exports.updatecords = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', "*") //allowing cross origin

  let data = JSON.parse(req.body);
  let x = data.x;
  let y = data.y;
  //setting link status to false;
  admin.database().ref('/trackers/'+tracker_id).update({
        'x': x,
        'y':y
      });
  res.status(200) //sending back response and stoping the timeout
  res.send('update success');
});
exports.register_new_id = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', "*") //allowing cross origin

  let data = JSON.parse(req.body);
  let tracker_id = data.id;
  let user_reference = data.user_ref;
  //setting link status to false;
  admin.database().ref('/tracker_ids/'+tracker_id+'/0/').update({
        'link_ref': 0,
        'tracker_id': tracker_id,
        'link_status': 0,
        'payment_status': 0,
        'user_ref':user_reference
      });
  admin.database().ref('/users/'+user_reference+'/0/tracker_ids/'+tracker_id).update({
        'id': tracker_id
      });
  res.status(200) //sending back response and stoping the timeout
  res.send();
});

exports.connect_tracker = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")
    let data = JSON.parse(req.body)

                                //CHECK IF ID IS AVAILABLE IN THE DATABASE
    let tracker_id = data.id;
    let tracker_name = data.tracker_name;
    let link_ref = data.link_ref;
    console.log("link_ref : " + link_ref);
    admin.database().ref('/tracker_ids').once('value',(data)=>{  //checking if  the tracker id exist
          if(data.hasChild(tracker_id)){ //checking if the tracker id exists
            // tracker reference is valid
            // now checking the tracker status - paymnet and link status
              admin.database().ref('/tracker_ids/'+tracker_id+'/0').once('value',(data)=>{
                let payment = data.val().payment_status; //extracing user
                let link_status = data.val().link_status; //extracing user
                let link_reference = data.val().link_ref; //extracing user
                if(payment == 1){ //account paid , connecting tracker
                  if(link_status == 1){
                      if(link_ref == link_reference){  //if the user owns this tracker and they have not been disconnected from it.
                        res.set('Content-Type', 'text/html');
                        res.status(200).send('linkedalready'); //you must link the tracker in that case
                      }else{
                          res.set('Content-Type', 'text/html');
                          res.status(200).send('trackerinuse');
                        }
                  }else {
                    createTracker(tracker_id,tracker_name,link_ref); //creating and connecting the tracker
                    res.set('Content-Type', 'text/html');
                    res.status(200).send('trackerlinked');
                  }
                }else {
                  res.set('Content-Type', 'text/html');
                  res.status(200).send('paymenterror');
                }
            },(error)=>{
              console.log(error);
            });
          }else{
            res.set('Content-Type', 'text/html');
            res.status(200).send('trackernotfound');
          }
    },(error)=>{
      // console.log(error);
    });
    // res.end();
    return;
});

function createTracker(tracker_id,tracker_name,link_ref){
  console.log(link_ref);
    //Updating tracker's listenting status.
      admin.database().ref('/tracker_ids/'+tracker_id+'/0').update({
            'link_status': 1,
            'payment_status': 1,
            'link_ref' : link_ref
          });
    //Creating a tracker object
    let new_tracker = {
        'tracker_name' : tracker_name,
        'tracker_id' : tracker_id,
        'state' :0 ,
        'update_int' : 1000,
        'x' : -0,
        'y' : -0,
        'network_status' : "Unknown" ,
        'battery_level' : 0 ,
        'mode' : 'Normal',
    }
    admin.database().ref('/trackers/'+tracker_id).update(new_tracker).then(snapshot => {

      })
  }
