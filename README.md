# Busk-A-Move (Frontend)

**Busk-A-Move** is a full-stack mobile application designed to help street performers (buskers) organise and promote their performances while also helping the public discover live street performances in their area. Whether you're a performer looking to showcase your talents or a fan of live music, Busk-A-Move provides an easy-to-use platform to connect performers with their audience. This repository focuses on the frontend of the app, which is built with **React Native** and **Expo**, enabling platform support for Android devices.

## Frontend Tech Stack

- **Create and Manage Performances**: Performers can easily create events, specifying details such as time, date, and location.
- **Discover Nearby Performances**: Users can browse a real-time map of busking performances happening around them.
- **Map Integration**: Integration of Google Maps for location-based event discovery and event creation.
- **Real-Time Location Markers**: Performers can drop pins to mark their event locations for users to find easily.

## Key Features

### Performer (Busker) Features:

- **Event Creation**: Buskers can create events by selecting a location, adding details like the date, time, and a description of their performance.
- **Location Selection via Map**: Buskers can easily set the location of their performance using an interactive map.
- **Profile Setup**: Performers can manage their profiles, adding information such as their skills and instruments.

### Audience Features:

- **Discover Events in Real-Time**: Users can discover nearby busking performances happening live or scheduled for the future.
- **Map-Based Event Discovery**: The app includes a real-time, geolocation-enabled map interface, allowing users to find busking performances based on proximity.

### Map Integration:

- **Interactive Map**: Built using react-native-maps, the app provides a seamless experience for users to browse events via the map interface.
- **Event Location Markers**: Performers can drop pins on the map to indicate where their event will take place, making it easy for audiences to find performances.

## 🛠️ Setup Instructions

### Technology Stack

- **React Native**: Cross-platform mobile app development framework.
- **Expo**: Managed environment for fast development and testing.
- **React Navigation**: Handles in-app navigation between different screens.
- **React Native Maps**: Powers map functionality and event geolocation.
- **Custom API Integration**: The app interfaces with a custom backend for event management and user data (details on the backend are available in the backend repository).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/LukeHarrisonDev/busk-a-move.git
   ```

   ```bash
   cd busk-a-move
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Expo development server:

   ```bash
   npx expo start
   ```

4. Run on a mobile device:

   - Download the Expo Go app.
   - Scan the QR code from the Expo CLI to load the app on your Android device.

## Backend Setup

Backend details are handled separately. The backend repository contains instructions for setting up and deploying the server, including database migrations and configurations. You can find these details here:

Backend Repository & Instructions: [Be-Busk-A-Move](https://github.com/filosoho/be-busk-a-move)

Backend (Deployed on Render): [Deployed Be-Busk-A-Move](https://be-busk-a-move.onrender.com/api)

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create your feature branch (git checkout -b feature/NewFeature).
3. Commit your changes (git commit -m 'Add some NewFeature').
4. Push to the branch (git push origin feature/NewFeature).
5. Open a pull request.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
