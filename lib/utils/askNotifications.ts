import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"

export async function askNotification() :Promise<Boolean> {
  if (!Device.isDevice)
    return false

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Pointages",
      importance: Notifications.AndroidImportance.DEFAULT
    })
  }

  const actual = await Notifications.getPermissionsAsync();

  if (actual.granted)
    return true;

  if (!actual.canAskAgain)
    return false;

  const response = await Notifications.requestPermissionsAsync();

  return response.granted;
}