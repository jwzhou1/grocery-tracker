import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, FlatList, Dimensions } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { auth, database, storage } from "../firebase/firebaseSetup";
import LoadingScreen from "./LoadingScreen";
const windowHeight = Dimensions.get('window').height;

export default function MyContributions() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true); // set to true initially to adapt to firestore listener
  const userId = auth.currentUser.uid;

  useEffect(() => {
    // set up a listener to get realtime data from firestore
    const unsubscribe = onSnapshot(collection(database, `users/${userId}/contribution_list`),
      async (snapshot) => {
        if (snapshot.empty) {
          setLoading(false);
        }
        const contributions = []
        for (const doc of snapshot.docs) {
          const contributionData = doc.data();
          // Convert timestamp to date string
          const date = contributionData.date.toDate().toLocaleDateString("zh-cn", {timeZone: 'UTC'}); 
          // Get image download URL
          if (contributionData.uploadUri) {
            const imageRef = ref(storage, contributionData.uploadUri);
            const imageDownloadURL = await getDownloadURL(imageRef);
            contributions.push({
              ...contributionData,
              imageURL: imageDownloadURL,
              date: dateString
            });
          } else {
            contributions.push({
              ...contributionData,
              date: date
            });
          }
        }
        setContributions(contributions);
        setLoading(false)
      },
      (error) => {
        console.log(error.message);
        setLoading(false);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen/>}
      {contributions.length === 0 && !loading &&
      <Text>Make some contribution today!</Text>}
      <FlatList
        data={contributions}
        renderItem={({ item }) => {
          return (
            <View style={styles.contributionContainer}>
              <Image source={{ uri: item.imageURL || 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png'}} style={styles.image} />
              <View style={styles.infoContainer}>
                <Text style={{fontWeight: '600'}}>{item.product_name}</Text>
                <Text style={{color: 'gray'}}>{item.size}</Text>
                <Text style={{color: 'green'}}>${item.price} at {item.store_name}</Text>
                <Text style={{fontSize: 14}}>Status: pending</Text>
              </View>
              <Text>{item.date}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
  },
  contributionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ececec',
    paddingVertical: '3%'
  },
  infoContainer: {
    flex: 1, 
    borderWidth: 0, 
    height: windowHeight*0.1, 
    justifyContent: 'space-around'
  },
  image: {
    width: 80,
    height: 80,
  }
});
