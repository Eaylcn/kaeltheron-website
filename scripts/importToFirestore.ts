require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('../src/service-account.json');
const regionsData = require('../src/data/regions.json');

// Firebase Admin başlatma
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

interface ConvertedData {
  [key: string]: any;
}

function convertArraysToObjects(data: any): ConvertedData {
  if (Array.isArray(data)) {
    return data.reduce((acc: ConvertedData, item: any, index: number) => {
      acc[index.toString()] = Array.isArray(item) ? 
        { x: item[0], y: item[1] } : 
        convertArraysToObjects(item);
      return acc;
    }, {});
  }

  if (typeof data === 'object' && data !== null) {
    const result: ConvertedData = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === 'coordinates' && Array.isArray(value)) {
        result[key] = { x: value[0], y: value[1] };
      } else {
        result[key] = convertArraysToObjects(value);
      }
    }
    return result;
  }

  return data;
}

async function importRegions() {
  try {
    const regions = regionsData.regions;
    const batch = db.batch();
    
    for (const [regionId, regionData] of Object.entries(regions)) {
      console.log(`${regionId} aktarılıyor...`);
      const convertedData = convertArraysToObjects(regionData);
      const regionRef = db.collection('regions').doc(regionId);
      batch.set(regionRef, convertedData);
      console.log(`${regionId} batch'e eklendi`);
    }

    await batch.commit();
    console.log('Tüm bölgeler başarıyla içe aktarıldı');
    process.exit(0);
  } catch (error) {
    console.error('İçe aktarma hatası:', error);
    process.exit(1);
  }
}

importRegions(); 