import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { GOOGLE_MAPS_API_KEY } from "@env";

const storesToSearch = [
  { name: "Walmart", color: "red" },
  { name: "Save-On-Foods", color: "pink" },
  { name: "T&T Supermarket", color: "green" },
  { name: "Real Canadian Superstore", color: "purple" },
  { name: "Costco Wholesale", color: "orange" },
  { name: "Safeway", color: "yellow" },
  { name: "Hannam", color: "cyan" }
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
      const promises = storesToSearch.map(async (store) => {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=grocery_or_supermarket&keyword=${encodeURIComponent(store.name)}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        if (data.results.length > 0) {
          return {
            name: store.name,
            color: store.color,
            locations: data.results.map((result) => ({
              latitude: result.geometry.location.lat,
              longitude: result.geometry.location.lng,
              name: result.name,
              vicinity: result.vicinity,
            })),
          };
        }
        return null;
      });
      const results = await Promise.all(promises);
      const filteredResults = results.filter(result => {
        return storesToSearch.some(store => result && result.name.includes(store.name));
      });
      setStores(filteredResults.filter((result) => result !== null));
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
    return stores.map((storeGroup, index) =>
      storeGroup.locations.map((store, idx) => (
        <Marker
          key={`${index}-${idx}`}
          coordinate={{
            latitude: store.latitude,
            longitude: store.longitude,
          }}
          title={storeGroup.name}
          pinColor={storeGroup.color}
          onPress={() => handleNavigation(store)}
        />
      ))
    );
  };

  const renderLegend = () => {
    return (
      <View style={styles.legendContainer}>
        {storesToSearch.map((store, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: store.color }]} />
            <Text>{store.name}</Text>
          </View>
        ))}
      </View>
    );
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
      {renderLegend()}
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
  legendContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderRadius: 10,
  },
});