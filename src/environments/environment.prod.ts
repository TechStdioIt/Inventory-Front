import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'https://ims.techstdio.com/api/',
  reportUrl:'https://ims.techstdio.com/',
  uploadFileUrl:'D:/project/Inventory-Front/src/assets/images/uploadedImages'
};
