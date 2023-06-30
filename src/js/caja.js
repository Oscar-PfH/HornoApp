import { Alert } from "react-native";
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import db from '../../database/firebase';

const generateRecord = async (customers) => {
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
        await deleteCustomers(customers);
    }
    catch (error) {
        throw error;
    }
}

export const getRecord = async () => {
    const customers = await getCustomersData();
    if (customers.length > 0) {
        Alert.alert('Alerta', 'Esta función borrará los datos actuales. ¿Deseas continuar?', [
            {text: 'Sí', onPress: async () => await generateRecord(customers)},
            {text: 'No', onPress: () => {return ;}}
        ]);
    }
    else {
        Alert.alert('No hay datos que registrar por hoy.');
    }
}

const getCustomersData = async () => { // id and price per customer
    const dbRef = collection(db, 'clientes');
    const snapDoc = await getDocs(dbRef);
    let customers = [];
    snapDoc.forEach(doc => {
        const {price} = doc.data();
        customers.push({id: doc.id, price: price});
    });
    return customers;
}

const getAsaderasData = async () => { // id
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

const deleteCustomers = async (customers) => {
    await deleteAsaderas();
    for (let i = 0; i < customers.length; i++) {
        await deleteDoc(doc(db, 'clientes', customers[i].id));
    }
}

const deleteAsaderas = async () => {
    const asaderas = getAsaderas()
    for (let i = 0; i < asaderas.length; i++) {
        await deleteDoc(doc(db, 'asaderas', asaderas[i].id));
    }
}

const getAsaderas = async () => { // id
    const dbRef = collection(db, 'asaderas');
    const docSnap = await getDocs(dbRef);
    let asaderas = [];
    docSnap.forEach(doc => {
      asaderas.push({id: doc.id});
    });
    return asaderas;
}

export const getRecordPDF = async () => {
    const dbRef = collection(db, 'caja');
    const docSnap = await getDocs(dbRef);
    let records = [];
    docSnap.forEach((doc, index) => {
        const {earnings, updated_date, n_asaderas, n_customers} = doc.data();
        records.push([index + 1, n_customers, n_asaderas, earnings, updated_date]);
    });
    
    const html = `
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>N° de clientes</th>
                        <th>N° de asaderas</th>
                        <th>Total</th>
                        <th>Fecha de creación</th>
                    </tr>
                </thead>
                <tbody>
                ${records.forEach((record, index) => (
                    `<tr>
                        <td>${index}</td>
                        <td>${record[0]}</td>
                        <td>${record[1]}</td>
                        <td>${record[2]}</td>
                        <td>${record[3]}</td>
                    </tr>`
                ))}
                </tbody>
            </table>
        </body>
        </html>
    `;

    const file = await printToFileAsync({
        html: html,
        base64: false,
    });

    await shareAsync(file.uri);

    //const current_date = new Date();

    //pdfDoc.save('registro_horno-' + current_date.getMonth() + '-' + current_date.getFullYear() + '.pdf');
}

