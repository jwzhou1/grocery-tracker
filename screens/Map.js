import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FontAwesome } from '@expo/vector-icons'; // Importing FontAwesome for the cart icon
import { GOOGLE_MAPS_API_KEY } from "@env";

export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      searchNearbySupermarkets(location.latitude, location.longitude);
    }
  }, [location]);

  const searchNearbySupermarkets = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=supermarket&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      const results = data.results.map(result => ({
        name: result.name,
        vicinity: result.vicinity,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng
      }));
      setStores(results);
    } catch (error) {
      console.error("Error fetching nearby stores:", error);
    }
  };
  

  const handleNavigation = (store) => {
    setSelectedStore(store);
  };

  const handleNavigate = () => {
    if (selectedStore) {
      const { latitude, longitude } = selectedStore;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  const renderStoreMarkers = () => {
    return stores.map((store, index) => (
      <Marker
        key={index}
        coordinate={{
          latitude: store.latitude,
          longitude: store.longitude,
        }}
        title={store.name}
        onPress={() => handleNavigation(store)}
      >
         <FontAwesome name="map-marker" size={24} color="red" />
      </Marker>
    ));
  };
  

  return (
    <View style={styles.container}>
      {errorMsg && <Text>{errorMsg}</Text>}
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
            pinColor="blue"
          />
          {renderStoreMarkers()}
        </MapView>
      )}
      {selectedStore && (
        <View style={styles.storeDetailsContainer}>
          <Text style={styles.storeName}>{selectedStore.name}</Text>
          <Text style={styles.storeAddress}>{selectedStore.vicinity}</Text>
          <TouchableOpacity onPress={handleNavigate}>
            <Text style={styles.navigationButton}>Navigate</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.legendContainer}>
      <FontAwesome name="map-marker" size={24} color="red" />
        <Text style={styles.legendText}>Supermarket</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  storeDetailsContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  storeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  storeAddress: {
    fontSize: 16,
    marginBottom: 5,
  },
  navigationButton: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
  },
  legendContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  legendText: {
    fontSize: 16,
    marginLeft: 5,
  },
});
