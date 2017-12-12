// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAmG0sHZzS7wzdDpKCaf_3NL31g4ry6wDI',
    authDomain: 'sefware-core01.firebaseapp.com',
    databaseURL: 'https://sefware-core01.firebaseio.com',
    projectId: 'sefware-core01',
    storageBucket: 'sefware-core01.appspot.com',
    messagingSenderId: '838571103215'
  },
  // api: 'https://us-central1-sefware-pos.cloudfunctions.net'
};
