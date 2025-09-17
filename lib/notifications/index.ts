import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

type NotificationPayload = {
  title: string;
  body?: string;
  data?: Record<string, unknown>;
};

export async function ensurePushPermissions() {
  const settings = await Notifications.getPermissionsAsync();

  if (settings.granted) {
    return settings;
  }

  const request = await Notifications.requestPermissionsAsync();

  return request?.granted ? request : settings;
}

export async function scheduleLocalNotification(payload: NotificationPayload) {
  const permissions = await ensurePushPermissions();

  if (!permissions?.granted) {
    return null;
  }

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
    },
    trigger: null,
  });

  return identifier;
}

export async function cancelNotification(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}

export async function getExpoPushToken(projectId?: string) {
  const permissions = await ensurePushPermissions();

  if (!permissions?.granted) {
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });

  return tokenData?.data ?? null;
}
