// run "node upload.js" to upload data to firestore
import { collection, addDoc, setDoc, deleteDoc, doc } from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";

async function writeToDB(data, col, docId, subCol) {
  try {
    if (docId) {
      await addDoc(collection(database, col, docId, subCol), data);
    } else {
      const newData = {...data, owner: auth.currentUser.uid}
      await addDoc(collection(database, col), newData);
    }
  } catch (err) {
    console.log(err);
  }
}

async function createProductToDB(data) {
  // 1.create a price document and get the id
  // 2.check if the product is already in db
  // if no create a new product document, and add that id to prices array
  // else find the document, and add that id to prices array
}

const XLSX = require('xlsx');
const workbook = XLSX.readFile('sample_data.xlsx');
const sheetName = workbook.SheetNames[2];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//console.log(data)