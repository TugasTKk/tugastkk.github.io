var axios = require('axios');
var webPush = require('web-push');
const args = process.argv;
const vapidKeys = {
   "publicKey": "BBQCgsfhPdtihL2Niymr3dbZS8yV6C6bbtjIkXGhShiT3TfTaap7VcQAgLw-kWrazDCFwJ2gVBtOcVgO9YPL0fQ",
   "privateKey": "_6NceOTEVYCgYJID-1j1s8S9C5ijQKLvszSfa9IuHOM"
};

const command = args.splice(2).join(" ");
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)

let config = {
  method: 'get',
  url: 'http://206.189.35.93/public/index.php/subscription',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjEzNTY5OTk1MjQsIm5iZiI6MTM1NzAwMDAwMCwidWlkIjoiMSIsImVtYWlsIjoiYWRtaW4xQGdtYWlsLmNvbSJ9._kzwCIgc5Pbd-nz4AxxsXYb8kqMploD5KFE4XhVAmSQ'
  }
};

function sendPushNotification(endpoint, p256dh, auth){
    var pushSubscription = {
        "endpoint": endpoint,
        "keys": {
            "p256dh": p256dh,
            "auth": auth
        }
    };
    var payload = command;
    var options = {
        gcmAPIKey: '1020513000173',
        TTL: 60
    };
    webPush.sendNotification(
        pushSubscription,
        payload,
        options
     )
     .catch((err)=>{
        console.log(err);
     })
}


axios(config)
.then(function (response) {
    // console.log(response.data)
    response.data.forEach(i =>{
        sendPushNotification(i.endpoint, i.p256dh, i.auth);
    })
//   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});