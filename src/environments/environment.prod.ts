import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'https://ims.techstdio.com/api/',
  reportUrl:'https://localhost:7136/',
  uploadFileUrl:'D:/project/Inventory-Front/src/assets/images/uploadedImages'
};
