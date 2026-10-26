import { supabase } from "@/lib/supabase"
import Constants from "expo-constants"
import { askNotification } from "@/lib/utils/askNotifications"
import * as Notifications from "expo-notifications"

export async function handleSaveNotifToken(userId: string) {
  const response = await askNotification();

  if (!response) return;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) {
    console.error("Project Id not found");
    return;
  }

  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });

    const { error } = await supabase.from("assmat").update({ notif_token: token }).eq("id", userId);

    if (error) {
      console.error("Failed to save token");
      return;
    }
  }  catch(e) {
    console.error("Can't catch token:" , e);
  }
}