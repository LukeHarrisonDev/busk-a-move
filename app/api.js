import axios from "axios";

const busksAPI = axios.create({
	baseURL: "https://be-busk-a-move.onrender.com/api/",
});

export const fetchAllBusks = (instrumentFilter) => {
	if(instrumentFilter) {
		return busksAPI.get(`/busks?instruments=${instrumentFilter}`).then((response) => {
			return response.data
		})
	} else{
		return busksAPI.get("/busks").then((response) => {
			return response.data;
		});
	}
};

export const fetchAllUsers = () => {
	return busksAPI.get("/users").then((response) => {
		return response.data;
	});
};

export const fetchSingleUser = (user_id) => {
	return busksAPI.get(`/users/${user_id}`).then((response) => {
		return response.data
	})
}

export const fetchSingleBusk = (id) => {
	return busksAPI.get(`/busks/${id}`).then((response) => {
		return response.data.busk;
	});
};

export const fetchSingleBusker = (id) => {
	return busksAPI.get(`/users/${id}`).then((response) => {
		return response.data;
	});
};

export const createUser = (body) => {
	return busksAPI.post('/users', body)
};
