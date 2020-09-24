// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCmYDpSZK6evIEsWUTOJ76R8WMgv0RlOmw",
    authDomain: "mayoeats-41ccd.firebaseapp.com",
    databaseURL: "https://mayoeats-41ccd.firebaseio.com",
    projectId: "mayoeats-41ccd",
    storageBucket: "mayoeats-41ccd.appspot.com",
    messagingSenderId: "1038205364467",
    appId: "1:1038205364467:web:b1e826a048415763f3af86",
    measurementId: "G-PMVTYPQPJM"
  },
  onesignal: {
    appId: '',
    googleProjectNumber: '',
    restKey: ''
  },
  stripe: {
    sk: 'sk_test_6FGt8mPIPTSXAKata4cMNw64'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
