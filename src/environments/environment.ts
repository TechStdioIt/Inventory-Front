import packageInfo from '../../package.json';

export const environment = {
  //Development Environment on 26-11-2024
  appVersion: packageInfo.version,
  production: false,
  apiUrl: 'https://c235-2404-1c40-396-5fec-44a2-f932-eb13-5aba.ngrok-free.app/api/',
  //apiUrl: 'https://192.168.1.249:45455/api/',
  reportUrl:'https://localhost:7136/',
  uploadFileUrl:'D:/project/Inventory-Front/src/assets/images/uploadedImages'



//Production Environment on 26-11-2024
  // appVersion: packageInfo.version,
  // production: true,
  // apiUrl: 'https://localhost:7136/api',
  // reportUrl:'https://localhost:7136/',
  // uploadFileUrl:'D:/project/Inventory-Front/src/assets/images/uploadedImages'
};


