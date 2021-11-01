import * as api from "../js/api.js";
if (!('serviceWorker' in navigator)) {
    console.log("Service worker tidak didukung browser ini.");
} else {
    registerServiceWorker();
    requestPermission();
}
// Register service worker
function registerServiceWorker() {
return navigator.serviceWorker.register('./service-worker.js')
    .then(function (registration) {
        console.log('Registrasi service worker berhasil.');
    return registration;
    })
    .catch(function (err) {
        console.error('Registrasi service worker gagal.', err);
    });
}
function requestPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(function (result) {
            if (result === "denied") {
                console.log("Fitur notifikasi tidak diijinkan.");
                return;
            } else if (result === "default") {
                console.error("Pengguna menutup kotak dialog permintaan ijin.");
                return;
            }
                
            if (('PushManager' in window)) {
                navigator.serviceWorker.getRegistration().then(function(registration) {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array("BBQCgsfhPdtihL2Niymr3dbZS8yV6C6bbtjIkXGhShiT3TfTaap7VcQAgLw-kWrazDCFwJ2gVBtOcVgO9YPL0fQ")
                    }).then(function(subscribe) {
                        const endpoint = subscribe.endpoint; 
                        const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('p256dh'))));
                        const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('auth'))));
                        api.subscribeUser(endpoint,p256dh,auth);
                        console.log('Berhasil melakukan subscribe dengan endpoint: ', endpoint);
                        console.log('Berhasil melakukan subscribe dengan p256dh key: ', p256dh);
                        console.log('Berhasil melakukan subscribe dengan auth key: ', auth);
                    }).catch(function(e) {
                        console.error('Tidak dapat melakukan subscribe ', e.message);
                    });
                });
            }
        });
    }
}
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function startPattern(){
    navigator.vibrate([200,100,200,100,200,100,200]);
    let sound = new Audio('sound.mp3');
    sound.play();
}

function deleteAllNotif(){
    navigator.serviceWorker.ready.then(function(registration){
        registration.getNotifications().then(function(notifications){
            for(let i=0; i< notifications.length; i+=1){
                notifications[i].close();
            }
        })
    })
}

function cekNotification(){
    navigator.serviceWorker.ready.then(function(registration){
        registration.getNotifications().then(function(notifications){
            // console.log(notifications);
            if(notifications.length > 0){
                if(notifications[notifications.length-1].title == "Notifikasi Mobil"){
                    startPattern();
                }
            }
        })
    })
}

deleteAllNotif();

setInterval(function(){
    cekNotification();
}, 1200);