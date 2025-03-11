import packageInfo from '../../package.json';

export const environment = {
  //Development Environment on 26-11-2024
  appVersion: packageInfo.version,
  production: false,
  apiUrl: 'https://3c5c-2404-1c40-390-c34c-c1e2-6921-237-8115.ngrok-free.app/api/',
  //apiUrl: 'https://ims.techstdio.com/api/',
  reportUrl:'https://localhost:7136/',
  uploadFileUrl:'D:/project/Inventory-Front/src/assets/images/uploadedImages'



//Production Environment on 26-11-2024
  // appVersion: packageInfo.version,
  // production: true,
  // apiUrl: 'https://localhost:7136/api',
  // reportUrl:'https://localhost:7136/',
  // uploadFileUrl:'D:/project/Inventory-Front/src/assets/images/uploadedImages'
};


