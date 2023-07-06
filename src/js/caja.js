import { Alert } from "react-native";
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

import Parse from "parse/react-native.js";

const generateRecord = async (customers) => {
    const asaderas = await getAsaderasData();
    const totalEarnings = getTotalEarnings(customers);
    try {
        const newRecord = new Parse.Object('registros');
        newRecord.set('n_customers', customers.length);
        newRecord.set('n_asaderas', asaderas.length);
        newRecord.set('earnings', totalEarnings);
        
        const result = await newRecord.save();
        Alert.alert('Se creó un registro del día (' + result.id + ')');
        await deleteCustomers();
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

const getCustomersData = async () => {
    const query = new Parse.Query('clientes');
    const results = await query.find();
    return results.map(result => result.toJSON());
}

const getAsaderasData = async () => {
    const query = new Parse.Query('asaderas');
    const results = await query.find(); 
    return results.map(result => result.toJSON());
}

const getTotalEarnings = (customers) => {
    let total = 0;
    for (let i = 0; i < customers.length; i++) {
        total += customers[i].price;
    }
    return total;
}

const deleteCustomers = async () => {
    const query = new Parse.Query('clientes');
    
    let results = await query.find();
    results.forEach(async (result) => {
        await result.destroy();
    });
    await deleteAsaderas();
}

const deleteAsaderas = async () => {
    const query = new Parse.Query('asaderas');
    
    let results = await query.find();
    results.forEach(async (result) => {
        await result.destroy();
    });
}

const getRecordsData = async () => {
    const query = new Parse.Query('registros');
    const results = await query.find();

    return results.map(result => result.toJSON());
}

const getHTMLstring = (records) => {
    const html = `
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body>
            <h1>Tabla de registros</h1>

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
                ${records.map((record, index) => (
                    `<tr>
                        <td>${index + 1}</td>
                        <td>${record.n_customers}</td>
                        <td>${record.n_asaderas}</td>
                        <td>${record.earnings}</td>
                        <td>${record.updatedAt}</td>
                    </tr>`
                ))}
                </tbody>
            </table>
        </body>
        </html>
    `;
    return html;
}

export const getRecordPDF = async () => {
    const records = await getRecordsData();

    const html = getHTMLstring(records);

    const file = await printToFileAsync({
        html: html,
        base64: false,
    });


    Alert.alert('El archivo se guardó en: ', file.uri);

    //await shareAsync(file.uri, { UTI: '.pdf', mimeType: 'application/pdf' });

    //const current_date = new Date();

    //pdfDoc.save('registro_horno-' + current_date.getMonth() + '-' + current_date.getFullYear() + '.pdf');
}