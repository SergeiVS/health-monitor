// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  GAPI_CLIENT_ID:
    '484210831778-dtgeom5m2ppqhhs19dou8ouqimhlgvr1.apps.googleusercontent.com',
  GAPI_API_KEY: 'AIzaSyDSjtnu-Q41BpMztjVLcebW4QftJ-akEDc',
  GAPI_DISCOVERY_DOCS: [
    // 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    'https://sheets.googleapis.com/$discovery/rest?version=v4',
  ],
  GAPI_SCOPE:'https://www.googleapis.com/auth/drive.file'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
