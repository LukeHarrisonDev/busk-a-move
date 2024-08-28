import axios from "axios";

const busksAPI = axios.create({
  baseURL: "https://be-busk-a-move.onrender.com/api/",
});

export const fetchAllBusks = (instrumentFilter, sortBy) => {
  if (instrumentFilter && !sortBy) {
    return busksAPI
      .get(`/busks?instruments=${instrumentFilter}`)
      .then((response) => {
        return response.data;
      });
  } else if (!instrumentFilter && sortBy) {
    return busksAPI.get(`/busks${sortBy}`).then((response) => {
      return response.data;
    });
  } else if (instrumentFilter && sortBy) {
    return busksAPI
      .get(`/busks${sortBy}&instruments=${instrumentFilter}`)
      .then((response) => {
        return response.data;
      });
  } else {
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
    return response.data;
  });
};

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
  return busksAPI.post("/users", body);
};

export const updateBusk = (id, buskLocation) => {
  console.log(id, "<<< ID", buskLocation, "<<<< Busk Loc")
  return busksAPI.patch(`/busks/${id}`, { busk_location_name: buskLocation })
}

export const addBusk = (busk) => {
  return busksAPI
    .post("/busks", busk)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        console.error("Error response data from addBusk:", error.response.data);
        console.error("Error status from addBusk:", error.response.status);
        console.error("Error headers from addBusk:", error.response.headers);
      } else {
        console.error("Error message from addBusk:", error.message);
      }
      throw error;
    });
};

export const deleteBusk = (id) => {
  return busksAPI
    .delete(`/busks/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        console.error(
          "Error response data from deleteBusk:",
          error.response.data
        );
        console.error("Error status from deleteBusk:", error.response.status);
        console.error("Error headers from deleteBusk:", error.response.headers);
      } else {
        console.error("Error message from deleteBusk:", error.message);
      }
      throw error;
    });
};
