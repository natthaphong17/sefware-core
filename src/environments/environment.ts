// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCJ6CdoCtHtMTIFv4RNWR3MHop3G4awbpg",
    authDomain: "sefware-pos.firebaseapp.com",
    databaseURL: "https://sefware-pos.firebaseio.com",
    projectId: "sefware-pos",
    storageBucket: "sefware-pos.appspot.com",
    messagingSenderId: "75989758405"
  },
  api: 'https://us-central1-sefware-pos.cloudfunctions.net'
};
