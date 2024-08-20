import axios from "axios";

const busksAPI = axios.create({
	baseURL: "https://jsonplaceholder.typicode.com/",
});

export const fetchAllBusks = () => {
	return busksAPI.get("/posts").then((response) => {
		return response.data;
	});
};

export const fetchAllUsers = () => {
	return busksAPI.get("/users").then((response) => {
		return response.data;
	});
};

export const fetchSingleBusk = (id) => {
	return busksAPI.get(`/posts/${id}`).then((response) => {
		return response.data;
	});
};
