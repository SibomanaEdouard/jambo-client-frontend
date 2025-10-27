export const generateDeviceId = (): string => {
  let deviceId = localStorage.getItem('deviceId');
  
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + 
               '_' + Date.now().toString(36);
    localStorage.setItem('deviceId', deviceId);
  }
  
  return deviceId;
};