// run "node upload.js" to upload data to firestore
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const serviceAccount = require('./grocery-tracker-40a3b-firebase-adminsdk-p4aya-95ccbf45c4.json');
const admin = require('firebase-admin');

initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

const XLSX = require('xlsx');
const workbook = XLSX.readFile('sample_data.xlsx');
const sheetName = workbook.SheetNames[1]; // change if need
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
createProductToDB(data)
//mock(data)

async function mock(data) {
  for (const row of data.slice(1)) { // Skipping header row
    const [name, altName, brand, price, quantity, unit, unitPrice, restrictions, category, source, date] = row;
    console.log(date)
    dateObject = new Date(Date.UTC(0, 0, date - 1))
    console.log(dateObject)
    console.log(dateObject.toLocaleDateString("zh-cn", {timeZone: 'UTC'}))
  }
}

// 1.create a price document and get the id
// 2.check if the product is already in db
// if not create a new product document, and add that id to prices array
// else find the document, and add that id to prices array
async function createProductToDB(data) {
  for (const row of data.slice(1)) { // Skipping header row
    const [name, altName, brand, price, quantity, unit, unitPrice, restrictions, category, source, date, image_url] = row;

    // Check if name is non-empty (assuming name is a required field)
    if (!name) {
      console.error('Skipping row: Name is empty');
      continue; // Skip processing this row if name is empty
    }

    // Check if the product already exists
    const querySnapshot = await db.collection('products').where('name', '==', name).get();

    if (querySnapshot.empty) {
      // If the product doesn't exist, create a new product document
      const productData = {
        name,
        altName: altName || '', // Use altName if available, otherwise use an empty string
        category: category,
        brand: brand || '', // Use brand if available, otherwise use an empty string
        quantity: quantity || '', // Use quantity if available, otherwise use an empty string
        unit: unit || '', // Use unit if available, otherwise use an empty string
        image_url: image_url || '', // Add image URL if available
        prices: [], // Initialize prices array
      };
      const productRef = await db.collection('products').add(productData);

      // Add the new product's ID to prices array
      await updatePricesArray(productRef.id, price, source, restrictions, date);
    } else {
      //If the product already exists, update its prices array
      querySnapshot.forEach(async (doc) => {
        await updatePricesArray(doc.id, price, source, restrictions, date);
      });
    }
  }
}

async function updatePricesArray(productId, date, price, storeName, restrictions) {
  const productRef = db.collection('products').doc(productId);

  // Check if the document exists before updating it
  const productSnapshot = await productRef.get();
  if (!productSnapshot.exists) {
    console.error(`Product with ID ${productId} does not exist. Skipping update.`);
    return; // Skip the update operation
  }

  // Create a new prices document
  const priceRef = await db.collection('prices').add({
    product_id: productId, // Storing Product ID in Price Document
    date: new Date(Date.UTC(0, 0, date - 1)), // convert excel serial number to normal date, -17 is for PST
    price,
    store_name: storeName,
    restrictions,
  });

  // Update product document to include the new price ID in prices array
  await productRef.update({
    prices: admin.firestore.FieldValue.arrayUnion(priceRef.id)
  });
}