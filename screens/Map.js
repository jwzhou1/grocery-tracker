import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { GOOGLE_MAPS_API_KEY } from "@env";

const storesToSearch = [
  "Walmart",
  "Save-On-Foods",
  "T&T",
  "Real Canadian Superstore",
  "Costco",
  "Safeway",
  "Hannam"
];

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
      searchNearbyStores(location.latitude, location.longitude);
    }
  }, [location]);

  const searchNearbyStores = async (lat, lng) => {
    try {
      const promises = storesToSearch.map(async (storeName) => {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=grocery_or_supermarket&keyword=${encodeURIComponent(storeName)}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        if (data.results.length > 0) {
          return {
            name: storeName,
            locations: data.results.map(store => ({
              latitude: store.geometry.location.lat,
              longitude: store.geometry.location.lng,
              name: store.name,
              vicinity: store.vicinity,
            })),
          };
        }
        return null;
      });
      const results = await Promise.all(promises);
      setStores(results.filter(result => result !== null));
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
            longitudeDelta: 0.0421
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
          {stores.map((storeGroup, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: storeGroup.locations[0].latitude,
                longitude: storeGroup.locations[0].longitude,
              }}
              title={storeGroup.name}
              description={`${storeGroup.locations.length} locations`}
              onPress={() => handleNavigation(storeGroup.locations[0])}
            />
          ))}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  storeDetailsContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
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
});
