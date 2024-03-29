// run "node upload.js" to upload data to firestore
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./grocery-tracker-40a3b-firebase-adminsdk-p4aya-95ccbf45c4.json');
const admin = require('firebase-admin');
const XLSX = require('xlsx');

initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

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

// 1.check if the product is already in db
// if not create a new product document
// 2.get product id and store it
// 3.create a new price document
async function createProductToDB(data) {
  for (const row of data.slice(1)) { // Skipping header row
    const [name, altName, brand, price, quantity, unit, unitPrice, restrictions, category, source, date, imageUrl] = row;

    // Check if name is non-empty (assuming name is a required field)
    if (!name) {
      console.error('Skipping row: Name is empty');
      continue; // Skip processing this row if name is empty
    }

    // Check if the product already exists
    const querySnapshot = await db.collection('products').where('name', '==', name).get();
    let productId;
    if (querySnapshot.empty) {
      // If the product doesn't exist, create a new product document
      const productData = {
        name,
        alt_name: altName || '',
        category: category,
        brand: brand || '',
        quantity: quantity || '',
        unit: unit || '',
        image_url: imageUrl || '',
      };
      const productRef = db.collection('products').doc();
      await productRef.set(productData)
      productId = productRef.id
      
    } else {
      querySnapshot.forEach(doc => {
        productId = doc.id;
      });
    }
    const priceData = {
      product_id: productId,
      date: new Date(Date.UTC(0, 0, date - 1)), // convert excel serial number to normal date
      price: parseFloat(price),
      unit_price: unitPrice || '',
      store_name: source || '',
      restrictions: restrictions || '',
    };
    await db.collection('prices').add(priceData);
  }
}

// LEGACY WAY TO STRUCTURE DATA
async function updatePricesArray(productId, price, storeName, restrictions, date) {
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