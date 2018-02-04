const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);



exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.addReport = functions.https.onRequest((req, res) => {
                                // ADD TO UNVERIFIED REPORTS
    let data = JSON.parse(req.body)
    console.log(data);
            admin.database().ref('/UNVERIFIED').push(data).then(snapshot => {
          // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
          appendReportToUser(data.userreference,snapshot.key);
        })
          console.log(req);
          res.status(200);
          res.send();

        return;
});

// exports.addHope = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.incViews = functions.https.onRequest((request, response) => {
  let reportKey = JSON.parse(request.body);
  console.log(reportKey);
  admin.database().ref('/UNVERIFIED/'+reportKey.key+"/views")
  .transaction(count => {
        return (count || 0) + 1;
  })

  return;
});

exports.addHopeRef = functions.https.onRequest((request, response) => {
  let data = JSON.parse(request.body);
  let uid = {
    [data.userreference] : '0'
  } ;

  let reportId = data.key
  console.log(uid);
  console.log(reportId);

  admin.database().ref('/UNVERIFIED/'+reportId+"/hopes").update(uid).then(snapshot => {

      //nothing at the moment watiting to pay cloud functions to get respsonses


  })
  // admin.database().ref('/UNVERIFIED/'+reportKey.key+"/views")
  // .transaction(count => {
  //       return (count || 0) + 1;
  // })
  return;
});


// exports.incPostCount = functions.database.ref('/threadsMeta/{threadId}/posts')
// .onWrite(event => {
//     admin.database().ref('/analytics/postCount')
//     .transaction(count => {
//         if (count === null) {
//             return count = 1
//         } else {
//             return count + 1
//         }
//     })
// });



                                              // LOCAL HELPER FUCNTIONS

function appendReportToUser(userReference,reportReference){
    admin.database().ref('users/'+userReference+'/0/reportreferences').push(reportReference).then(snapshot =>{
      console.log('user:append-done')

    })
  }

exports.triangle = functions.database.ref('/reports')
    .onWrite(event => {
      const original = event.data.val();;
      admin.database().ref('/messages').push({original: original}).then(snapshot => {
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    });

});


































                                  // CLOUD HELPER FUNCTIONS
//
// submitReport(data: any){
//     this.database = firebase.database(); //creating a new database instance
//     this.user.getUserReference().then((reference) =>{
//       let reportID = this.generalInterface.generateUid(reference); //generating unique id
//       this.database = firebase.database();
//       this.database.ref('reports/').push(
//         {
//             'carname' : data.carName ,
//             'buyear' : data.carDate,
//             'carregistration' : data.carReg,
//             'carcolor' : data.carColor,
//             'carstate' : data.carState,
//             'carmissingdate' : data.missingDate,
//             'carmissingcity' : data.missingLocation,
//             'carmissinglocationexact' : data.missingStrict,
//             'missingmethod' : data.methodOfLosing,
//             'moreaboutmissing' : data.missingMoreInfo,
//             'pictures' : [{"first": data.pictures[0] , "second":data.pictures[1], "third":data.pictures[2]}],
//             'usecell' : data.mobileUser1,
//             'usercellother' : data.mobileUser2,
//             'investigatorcell' : data.mobileInvestigator,
//             'supportdoc' :  data.supportUrl,
//             'views' : '0',
//             'hope' : '0',
//             'found' : 'false',
//             'shares' : '0',
//             'verified' : 'false',
//             'reportreference' : reportID,
//             'userreference' : reference
//
//       }).then((snapshot)=>{
//           this.appendReportToLocation(snapshot.key,data.missingLocation) //saving the report location for quick referencing for the pinning systems
//           this.appendReportToUser(snapshot.key,reference);
//           this.events.publish('report:submitted');
//       }).catch((error)=>{
//         let message = "The system failed to recieve your report, Please try again later."
//         this.showAlert(message);
//       })
//   })
// }
// appendReportToUser(reportID: string,userReference: any){
//   // VAR database = firebase.database(); //creating a new database instance
//   // this.user.getUserReference().then((reference) =>{
//   //   this.database = firebase.database();
//   //   this.database.ref('users/'+userReference+'/reportreferences').push(
//   //     { [reportID] : reportID})
//   //   })
//   }
// appendReportToLocation(reportID: string,location : string){
//   // this.database = firebase.database(); //creating a new database instance
//   // this.user.getUserReference().then((reference) =>{
//   //   this.database = firebase.database();
//   //   this.database.ref('location/'+location).push(
//   //     { [reportID] : reportID})
//   //   })
//   }
