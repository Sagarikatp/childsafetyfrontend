import { PushNotifications } from "@capacitor/push-notifications";

export const registerPushNotifications = () => {
  PushNotifications.requestPermissions().then((result) => {
    if (result.receive === "granted") {
      PushNotifications.register();
    }
  });

  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    alert(`Notification: ${notification.title}\n${notification.body}`);
  });
};
