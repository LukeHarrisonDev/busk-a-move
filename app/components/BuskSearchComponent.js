import { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { fetchAllBusks } from '../api';
import colours from '../config/colours';

function BuskSearchComponent({setBusksList}) {
    const [instrumentFilter, setInstrumentFilter] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [listOfIntruments, setListOfInstruments] = useState([])

    function handleInstrumentChange(value) {
        fetchAllBusks(value).then((response) => {
            setIsLoading(true)
            const busks = response.busks
            setBusksList(busks)
        })
    }

    useEffect(() => {
		fetchAllBusks().then((response) => {
            setIsLoading(true)
            const busks = response.busks
            let listOfIntruments =[]
            busks.forEach((busk) => {
                listOfIntruments.push(busk.busk_selected_instruments)
            })
            const uniqueInstruments = [...new Set(listOfIntruments.flat().sort())]
            setListOfInstruments(uniqueInstruments)
			setIsLoading(false);
		});
	}, []);

    const selectInstrumentData = []

    listOfIntruments.forEach((instrument) => {
        selectInstrumentData.push({label: instrument, value: instrument})
    })
    console.log(selectInstrumentData, "<<<< SID")

    return (
        <View style={styles.filterContainer}>
            <RNPickerSelect
                style={styles.picker}
                onValueChange={handleInstrumentChange}
                placeholder={{label: "Select an Instrument...", value: null}}
                // value={}
                items={
                    selectInstrumentData
            }
            />
        </View>
    );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		paddingTop: StatusBar.currentHeight,
	},
    filterContainer: {
        padding: 5,
        backgroundColor: colours.secondaryBackground,
        borderWidth: 3,
        borderColor: colours.primaryHighlight,
        //Temporary, since the thing will not go to the centre.
        marginHorizontal: 90,
        maxWidth: 200,
    },
    picker: {
        color: "red",
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 3,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: "F5F5F5",
        paddingTop: StatusBar.currentHeight,
        justifyContent: "center",
        alignItems: "center",
    }
});

export default BuskSearchComponent;