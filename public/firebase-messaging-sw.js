importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB0IQokSWxyX8Yl2ywoivuxtTgZkQ1yhtA",
  authDomain: "assoul-70249.firebaseapp.com",
  projectId: "assoul-70249",
  storageBucket: "assoul-70249.firebasestorage.app",
  messagingSenderId: "954784668230",
  appId: "1:954784668230:web:7422a5c2c66ff5d7e90847",
  measurementId: "G-KHK8PG09NB"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message:', payload);

  var notificationTitle = payload.notification.title;
  var notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png',
    badge: '/logo.png',
    tag: new Date().getTime().toString(),
    data: payload.data,
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'عرض'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'view') {
    // Handle click on "view" action
    clients.openWindow('/').catch(function(error) {
      console.error('Error opening window:', error);
    });
  } else {
    // Default behavior when clicking the notification
    clients.openWindow('/').catch(function(error) {
      console.error('Error opening window:', error);
    });
  }
});
