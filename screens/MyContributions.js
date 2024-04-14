import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { auth, database, storage } from "../firebase/firebaseSetup";

export default function MyContributions() {
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const fetchContributions = async () => {
      if (!auth.currentUser) return;
    
      const userUid = auth.currentUser.uid;
      const userQuery = query(collection(database, "users", userUid, "contribution_list"));
    
      try {
        const querySnapshot = await getDocs(userQuery);
        const contributionsData = [];
    
        for (const doc of querySnapshot.docs) {
          const contributionData = doc.data();
    
          // Get image download URL
          if (contributionData.imageUri) {
            const imageRef = ref(storage, contributionData.imageUri);
            const imageDownloadURL = await getDownloadURL(imageRef);
    
            // Convert timestamp to date string
            const date = contributionData.date.toDate(); 
            const dateString = date.toLocaleString();
    
            contributionsData.push({
              ...contributionData,
              imageURL: imageDownloadURL,
              date: dateString 
            });
          } else {
            contributionsData.push(contributionData);
          }
        }
    
        setContributions(contributionsData);
      } catch (error) {
        console.error("Error fetching contributions:", error);
      }
    };
    

    fetchContributions();
  }, []);
  console.log("contributions", contributions)

  return (
    <View style={styles.container}>
      {contributions.map((contribution, index) => (
        <View key={index} style={styles.contributionContainer}>
          {contribution.imageURL && (
            <Image source={{ uri: contribution.imageURL }} style={styles.image} />
          )}
          <Text>Contributed Date: {contribution.date}</Text>
          <Text>Contributed Price: {contribution.price}</Text>
          <Text>Product Name: {contribution.productName}</Text>
          <Text>StoreName: {contribution.store_name}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  contributionContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginBottom: 10
  }
});
