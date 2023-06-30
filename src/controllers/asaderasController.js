import { collection, getDocs, getDoc, doc, query, where } from "firebase/firestore";
import db from "../../database/firebase";

export const getAsaderasByCustomer = async (customer_id) => {
  const qry = query(collection(db, 'asaderas'), where('customer_id', '==', customer_id));
  const docSnap = await getDocs(qry);
  let asaderas = [];
  docSnap.forEach(doc => {
    const {customer_id, content, description, oven, entry_time, state} = doc.data();
    asaderas.push({id: doc.id, customer_id, content, description, oven, entry_time, state});
  });

  return asaderas;
}

export const getAsaderasByOven = async (oven) => {
  const qry = query(collection(db, 'asaderas'), where('oven', '==', oven));
  const docSnap = await getDocs(qry);
  let asaderas = [];
  docSnap.forEach(doc => {
    const {customer_id, content, description, oven, entry_time, state} = doc.data();
    asaderas.push({id: doc.id, customer_id, content, description, oven, entry_time, state});
  });

  return asaderas;
}

export const getAsadera = async (id) => {
  const docRef = doc(db, 'asaderas', id)
  const docSnap = await getDoc(docRef);
  if(docSnap.exists()) {
    const {customer_id, content, description, entry_time, oven, state} = docSnap.data();
    const asadera = {id: docSnap.id, customer_id, content, description, entry_time, oven, state};
    return asadera;
  }

  return null;
}