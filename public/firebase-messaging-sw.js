importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-messaging.js');

// 1. Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyB6pVnU_Ln2OhILdk4ONMgNUB97tswnRZM",
    authDomain: "vue-timetable-project.firebaseapp.com",
    projectId: "vue-timetable-project",
    storageBucket: "vue-timetable-project.appspot.com",
    messagingSenderId: "85946573826",
    appId: "1:85946573826:web:653ee4ffcff0b6f3d9f31b"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 2. ------- handling background notifications
messaging.onBackgroundMessage((payload) => {
    const msgData = payload.notification || payload.data;

    const notificationTitle = msgData.title;
    const notificationOptions = {
        body: msgData.body,
        icon: "/icon-48x48.png"
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 3. ------- handling notification click action
self.addEventListener('notificationclick', event => {
    event.notification.close();

    //https://stackoverflow.com/questions/30302636/clients-openwindow-not-allowed-to-open-a-window-on-a-serviceworker-google-c?rq=4
    event.waitUntil(
        //do we have some windows of our app?
        self.clients.matchAll({includeUncontrolled: true, type: 'window'})
            .then(clientList =>{
                if(clientList.length === 0){
                    return self.clients.openWindow('/timetable')
                        .then((windowClient) => {
                            //we should focus new window and return Promise to terminate our event
                            return windowClient ? windowClient.focus() : Promise.resolve()
                        })
                }
                else clientList[0].focus()

                return Promise.resolve()
            }))
});