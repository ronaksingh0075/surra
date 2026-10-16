/* Surra configuration for the installable app.
   `firebase` switches on profiles (email sign-up + cloud backup). These values identify the Firebase project
   and are meant to be public; access is controlled by the Firestore security rules in firebase/firestore.rules. */
window.SURRA_CONFIG = {
  firebase: {
    apiKey: 'AIzaSyBaBeOcIPgqIzDaxsNUX5loRxzDP6Gp0aM',
    authDomain: 'surra-abf91.firebaseapp.com',
    projectId: 'surra-abf91',
    storageBucket: 'surra-abf91.firebasestorage.app',
    messagingSenderId: '245377506736',
    appId: '1:245377506736:web:8419ae20f3deb37182ca75',
  },
  // The Surra notifier (notifier/README.md): its web app address and the public half of its push key.
  notifier: {
    url: 'https://script.google.com/macros/s/AKfycbxeVyXfOAJF9yEkUNF11DTKgbT8GCE6vbWZ7S3cSYLaocsRtBZSXlNNKQhPCfXVg2M/exec',
    vapid: 'BOkzVvdO9K8nWs1QKxvNWAcWF3pzb6oIkhI8MRb87fiXdVTabd_Y_dqzeLkGBdz0o8PmOPXK4XNuTBBqZYKL_h4',
  },
};
