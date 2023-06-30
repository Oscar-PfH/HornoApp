import { collection, doc, getDocs, getDoc, query, where } from "firebase/firestore";
import db from "../../database/firebase";

export const getCustomers = async (state = null) => {
  const customers = [];

  if (state === null) {
    const dbRef = collection(db, 'clientes');
    const docSnap = await getDocs(dbRef);

    docSnap.forEach((doc) => {
      const {full_name, price, phone, arrival_time, state} = doc.data();
      customers.push({
          id: doc.id, full_name, price, phone, arrival_time, state
      });
    });
  }
  else {
    const qry = query(collection(db, 'clientes'), where('state', '==', state));
    const docSnap = await getDocs(qry);

    docSnap.forEach(async (doc) => {
      const {full_name, price, phone, arrival_time, state} = doc.data();
      customers.push({
          id: doc.id, full_name, price, phone, arrival_time, state
      });
    });
  }
  
  return customers;
}

export const getCustomer = async (id) => {
  const docRef = doc(db, 'clientes', id);
  const docSnap = await getDoc(docRef);
  if(docSnap.exists()) {
      const {full_name, price, phone, arrival_time, state} = docSnap.data();
      const customer = {id: docSnap.id, full_name, price, phone, arrival_time, state};
      return customer;
  }

  return null;
}