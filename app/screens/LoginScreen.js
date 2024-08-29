// import React, { useState, useEffect } from "react";
// import {
//   Text,
//   TextInput,
//   ScrollView,
//   StyleSheet,
//   View,
//   Button,
//   Alert,
// } from "react-native";
// import { TouchableOpacity } from "react-native-web";
// import { useFocusEffect } from "@react-navigation/native";

// import colours from "../config/colours";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// function LoginScreen({ navigation }) {
//   const [form, setForm] = useState({
//     emailOrUsername: "",
//     password: "",
//   });

//   useFocusEffect(
//     React.useCallback(() => {
//       setForm({
//         emailOrUsername: "",
//         password: "",
//       });
//     }, [])
//   );
//   const handleInputChange = (name, value) => {
//     setForm({
//       ...form,
//       [name]: value,
//     });
//   };

//   const fetchUsers = () => {
//     return fetch("https://be-busk-a-move.onrender.com/api/users")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("unable to fetch users");
//         }
//         return response.json();
//       })
//       .then((data) => data.users);
//   };

//   const authenticateUser = (emailOrUsername, password) => {
//     return fetchUsers()
//       .then((users) => {
//         const foundUser = users.find(
//           (user) =>
//             (user.user_email === emailOrUsername ||
//               user.username === emailOrUsername) &&
//             user.user_password === password
//         );

//         if (foundUser) {
//           return foundUser;
//         } else {
//           throw new Error("invalid username/email or password");
//         }
//       })
//       .catch((error) => {
//         console.error("error during authentication:", error.message);
//         throw error;
//       });
//   };
//   const handleSubmit = () => {
//     const { emailOrUsername, password } = form;

//     authenticateUser(emailOrUsername, password)
//       .then((user) => {
//         AsyncStorage.setItem("isAuthenticated", "true").then(() => {
//           navigation.reset({
//             index: 0,
//             routes: [{ name: "MyProfile", params: { userId: user.user_id } }],
//           });
//         });
//       })
//       .catch((error) => {
//         Alert.alert("login failed", error.message);
//       });
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.label}>Email or Username:</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your email or username"
//         value={form.emailOrUsername}
//         onChangeText={(text) => handleInputChange("emailOrUsername", text)}
//       />

//       <Text style={styles.label}>Password:</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your password"
//         value={form.password}
//         onChangeText={(text) => handleInputChange("password", text)}
//         secureTextEntry
//       />

//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//         <Text style={styles.submitText}>Login</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: colours.blueExtraLight,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: colours.gunmetal,
//     padding: 10,
//     marginBottom: 15,
//     borderRadius: 5,
//     backgroundColor: colours.white,
//   },
//   submitButton: {
//     backgroundColor: colours.primaryHighlight,
//     padding: 15,
//     alignItems: "center",
//     borderRadius: 5,
//   },
//   submitText: {
//     color: "#fff",
//     fontSize: 18,
//   },
// });

// export default LoginScreen;
import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { fetchAllUsers } from "../api";

import colours from "../config/colours";
import AsyncStorage from "@react-native-async-storage/async-storage";

function LoginScreen({ navigation }) {
  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });

  useEffect(() => {
    setForm({
      emailOrUsername: "",
      password: "",
    });
  }, []);

  const handleInputChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const authenticateUser = (emailOrUsername, password) => {
    return fetchAllUsers()
      .then((data) => {
        const users = data.users;

        const normalizedInput = emailOrUsername.trim().toLowerCase();
        const trimmedPassword = password.trim();

        const foundUser = users.find(
          (user) =>
            (user.user_email.toLowerCase() === normalizedInput ||
              user.username.toLowerCase() === normalizedInput) &&
            user.user_password === trimmedPassword
        );

        if (foundUser) {
          return foundUser;
        } else {
          throw new Error("invalid username/email or password");
        }
      })
      .catch((error) => {
        console.error("error during authentication:", error.message);
        throw error;
      });
  };

  const handleSubmit = () => {
    const { emailOrUsername, password } = form;
  
    authenticateUser(emailOrUsername, password)
      .then((user) => {
        AsyncStorage.setItem("isAuthenticated", "true")
          .then(() => {
            
            navigation.reset({
              index: 0,
              routes: [{ name: "MyProfile", params: { userId: user.user_id } }],
            });
          })
          .catch((error) => {
            console.error("Failed to set authentication status:", error);
          });
      })
      .catch((error) => {
        Alert.alert("Login failed", error.message);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Email or Username:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email or username"
        value={form.emailOrUsername}
        onChangeText={(text) => handleInputChange("emailOrUsername", text)}
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) => handleInputChange("password", text)}
        secureTextEntry
      />

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Login</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colours.blueExtraLight,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colours.gunmetal,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: colours.white,
  },
  submitButton: {
    backgroundColor: colours.primaryHighlight,
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default LoginScreen;
