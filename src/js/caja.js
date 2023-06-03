import { collection, addDoc, getDocs } from "firebase/firestore";
import { Alert } from "react-native";
import db from '../../database/firebase';

export const getSummary = async () => {
    const customers = await getCustomersData();
    const asaderas = await getAsaderasData();
    const totalEarnings = getTotalEarnings(customers);
    try {
        const dbRef = collection(db, 'cajas');
        const caja = {
            n_customers: customers.length,
            n_asaderas: asaderas.length,
            earnings: totalEarnings,
            created_at: new Date(),
        };
        const snapDoc = await addDoc(dbRef, caja);
        Alert.alert('Se creó un registro del día (' + snapDoc.id + ')');
    }
    catch (error) {
        throw error;
    }
}

const getCustomersData = async () => {
    const dbRef = collection(db, 'clientes');
    const snapDoc = await getDocs(dbRef);
    let customers = [];
    snapDoc.forEach(doc => {
        const {price} = doc.data();
        customers.push({id: doc.id, price: price});
    });
    return customers;
}

const getAsaderasData = async () => {
    const dbRef = collection(db, 'asaderas');
    const snapDoc = await getDocs(dbRef);
    let asaderas = [];
    snapDoc.forEach(doc => {
        asaderas.push({id: doc.id});
    });
    return asaderas;
}

const getTotalEarnings = (customers) => {
    let total = 0;
    for (let i = 0; i < customers.length; i++) {
        total += customers[i].price;
    }
    return total;
}

export const getTotalCustomers = async () => {
    const customers = await getCustomersData();
    return customers.length;
}