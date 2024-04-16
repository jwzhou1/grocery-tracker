import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { auth, database, storage } from "../firebase/firebaseSetup";

// Next steps:
// 1.improve UI
export default function MyContributions() {
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const fetchContributions = async () => {
      const contributionsData = [];
      const userId = auth.currentUser.uid;
      try {
        const querySnapshot = await getDocs(collection(database, "users", userId, "contribution_list"));
    
        for (const doc of querySnapshot.docs) {
          const contributionData = doc.data();
          // Convert timestamp to date string
          const date = contributionData.date.toDate(); 
          const dateString = date.toLocaleString();
          // Get image download URL
          const imageRef = ref(storage, contributionData.uploadUri);
          const imageDownloadURL = await getDownloadURL(imageRef);
          
          if (imageDownloadURL) {
            contributionsData.push({
              ...contributionData,
              imageURL: imageDownloadURL,
              date: dateString
            });
          } else {
            contributionsData.push({
              ...contributionData,
              date: dateString
            });
          }
        }
    
        setContributions(contributionsData);
      } catch (error) {
        console.error("Error fetching contributions:", error);
      }
    };
    fetchContributions();
  }, []);
  //console.log("contributions", contributions)

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        {contributions.length === 0 && 
        <Text>Make some contribution today!</Text>}
        
        {contributions.map((contribution, index) => (
          <View key={index} style={styles.contributionContainer}>
            {contribution.imageURL && (
              <Image source={{ uri: contribution.imageURL }} style={styles.image} />
            )}
            <Text>Contributed Date: {contribution.date}</Text>
            <Text>Contributed Price: {contribution.price}</Text>
            <Text>Product Name: {contribution.productName}</Text>
            <Text>Store Name: {contribution.store_name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  contributionContainer: {
    width: 400, 
    height: 300,
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center", 
    alignItems: "center" 
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginBottom: 10
  }
});
