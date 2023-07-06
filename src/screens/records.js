import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from 'react-native';
import { Table, Row } from 'react-native-reanimated-table';

import Parse from "parse/react-native";

const Records = () => {
    const [records, setRecords] = useState([]);
    const tableHead = ['#', 'N° de clientes', 'N° de asaderas', 'Total', 'Fecha de creación'];
    const tableData = [];
    const widthArr = [60, 80, 80, 80, 120];

    const getRecords = async () => {
        const query = new Parse.Query('registros');
        const results = await query.find();
        results.map((result, index) => {
            let r = [];
            r.push(index + 1);
            r.push(result.get('n_customers'));
            r.push(result.get('n_asaderas'));
            r.push(result.get('earnings'));
            r.push(getDateString(result.get('createdAt')));
            tableData.push(r);
        })
        setRecords(tableData);
    }

    const getDateString = (recordDate) => {
        let month = recordDate.getMonth();
        let ds = recordDate.getDate().toString();
        switch (month) {
            case 0: ds += ' de Enero'; break;
            case 1: ds += ' de Febrero'; break;
            case 2: ds += ' de Marzo'; break;
            case 3: ds += ' de Abril'; break;
            case 4: ds += ' de Mayo'; break;
            case 5: ds += ' de Junio'; break;
            case 6: ds += ' de Julio'; break;
            case 7: ds += ' de Agosto'; break;
            case 8: ds += ' de Setiembre'; break;
            case 9: ds += ' de Octubre'; break;
            case 10: ds += ' de Noviembre'; break;
            case 11: ds += ' de Diciembre'; break;
            default: break;
        }
        return ds + ' de ' + recordDate.getFullYear().toString();
    }

    useEffect(() => {
        getRecords();
    }, []);

    return (<>
    <View style={styles.container}>
    <ScrollView horizontal={true}>
        <View>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text}/>
            </Table>
            <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                {
                    records.map((rowData, index) => (
                    <Row
                        key={index}
                        data={rowData}
                        widthArr={widthArr}
                        style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                    />
                    ))
                }
                </Table>
            </ScrollView>
        </View>
    </ScrollView>
    </View>
    </>);
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    header: { height: 50, backgroundColor: '#537791' },
    text: { textAlign: 'center', fontWeight: '100' },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#E7E6E1' }
});

export default Records;