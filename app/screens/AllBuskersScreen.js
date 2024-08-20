import { useEffect, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import { fetchAllUsers } from "../api";

function AllBuskersScreen() {
	const [buskersList, setBuskersList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = () => {
		setRefreshing(true);
		fetchAllUsers();
		setRefreshing(false);
	};

	useEffect(() => {
		fetchAllUsers().then((response) => {});
	});

	return (
		<ScrollView>
			<Text>AllBuskersScreen</Text>
		</ScrollView>
	);
}

export default AllBuskersScreen;
