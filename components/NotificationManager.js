import { Alert } from "react-native";
import * as Notifications from "expo-notifications";

export const verifyPermission = async () => {
  const status = await Notifications.getPermissionsAsync();
  if (status.granted) {
    return true;
  }
  const response = await Notifications.requestPermissionsAsync({
    ios: { allowBadge: true },
  });
  return response.granted;
};

export const schedulePriceChangeNotification = async (productId, currentPrice, newPrice) => {
  try {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      Alert.alert("You need to give permission to send notifications");
      return;
    }
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Price Change Notification",
        body: `The price of product ${productId} has changed from $${currentPrice} to $${newPrice}.`,
      },
      trigger: null, // Send immediately
    });
  } catch (err) {
    console.log("Error scheduling price change notification:", err);
  }
};

export async function cancelPriceChangeNotification() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
