import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { scheduleDailyNotification, cancelNotification } from '../components/NotificationManager';
import { useEffect } from 'react';
import { database, auth } from '../firebase/firebaseSetup';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { updateToUsersDB } from '../firebase/firebaseHelper';
import Colors from '../styles/Colors';

const NotificationSetting = () => {
  const [chosenTime, setChosenTime] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date()); 
  const [notificationTime, setNotificationTime] = useState(new Date());
  const userUid = auth.currentUser.uid;
  const [entryId, setEntryId] = useState('')
  const [isNotification, setIsNotification] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(database, 'users'), where('uid', '==', userUid)),
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const entryId = userDoc.id;
          setEntryId(entryId);
          const userData = userDoc.data();
          setIsNotification(userData.isNotification || false);
          setNotificationTime(userData.notificationTime || new Date());
        } else {
          console.log('User document not found.');
        }
      },
      (err) => {
        console.log(err);
        if (err.code === 'permission-denied') {
          console.log('User does not have permission to access this collection');
        }
      }
    );
  
    return () => unsubscribe(); 
  }, [notificationTime]);
  
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const confirmTime = (time) => {
    hideDatePicker();
    setSelectedTime(time);
    const updatedEntry = {
      isNotification: true,
      notificationTime: time,
    };
    updateToUsersDB(entryId, updatedEntry);
    setIsNotification(true)
    setNotificationTime(time)

    const formattedHour = parseInt(time.getHours());
    const formattedMinute = parseInt(time.getMinutes());
    const formattedTime = `${formattedHour}:${formattedMinute}`;
    scheduleDailyNotification(formattedHour,formattedMinute)
  };   
  const cancelNotificationHandler = () => {
    setIsNotification(false);
    cancelNotification();
    const updatedEntry = {
      isNotification: false,
    };

    updateToUsersDB(entryId, updatedEntry);
  };
  function formatTime(time) {
    const date = new Date(time.seconds * 1000 + time.nanoseconds / 1000000);
    const formattedHour = date.getHours().toString().padStart(2, '0');
    const formattedMinute = date.getMinutes().toString().padStart(2, '0');
    return `${formattedHour}:${formattedMinute}`;
  }
  return (
    <View style={styles.container}>
      {!isNotification &&
        <Button
          title="Set Shopping Notifications"
          onPress={showDatePicker}
          color={Colors.buttonBackground}
        />
      }
      <DateTimePickerModal
        testID="dateTimePicker"
        isVisible={isDatePickerVisible}
        value={chosenTime}
        onCancel={hideDatePicker}
        mode="time"
        is24Hour={true}
        onConfirm={confirmTime}
      />

      {isNotification && (
        <View style={styles.notificationTimeContainer}>
          <Text style={styles.notificationText}>Your Shopping Notification is at: {formatTime(notificationTime)}</Text>
          <Button
            title="Cancel Notification"
            onPress={cancelNotificationHandler}
            color={Colors.buttonBackground}
          />
        </View>
      )}
    </View>
  );
};

export default NotificationSetting;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: '10%',
    marginBottom: '10%',
    width: '90%',
    alignSelf: 'center',
  },
  notificationTimeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white', 
    fontSize: 22,
    fontWeight: 'bold',
  },
  notificationText: {
    fontSize: 22,
    marginBottom: '5%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
