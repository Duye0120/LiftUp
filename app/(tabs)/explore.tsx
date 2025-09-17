import { useCallback } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useSettingsStore } from '@/stores/settings-store';
import { ensurePushPermissions } from '@/lib/notifications';
import { useSyncQueue } from '@/lib/sync/use-sync-queue';
import { useLiftSessionsQuery } from '@/lib/api/hooks';

export default function InsightsScreen() {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const notificationsEnabled = useSettingsStore((state) => state.notificationsEnabled);
  const toggleNotifications = useSettingsStore((state) => state.toggleNotifications);
  const motionTrackingEnabled = useSettingsStore((state) => state.motionTrackingEnabled);
  const toggleMotionTracking = useSettingsStore((state) => state.toggleMotionTracking);
  const { queue } = useSyncQueue();
  const remoteQuery = useLiftSessionsQuery();

  const handleNotificationPermission = useCallback(async () => {
    const permission = await ensurePushPermissions();
    toggleNotifications(Boolean(permission?.granted));
  }, [toggleNotifications]);

  return (
    <ScrollView className="flex-1 bg-slate-950 px-5 pt-10" contentContainerStyle={{ paddingBottom: 80 }}>
      <Text className="text-2xl font-bold text-slate-100">系统偏好</Text>
      <Text className="mt-2 text-sm text-slate-400">配置主题、通知以及传感器以匹配你的训练场景。</Text>

      <View className="mt-6 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5">
        <Text className="text-base font-semibold text-slate-100">主题</Text>
        <View className="mt-4 gap-3">
          {(['system', 'light', 'dark'] as const).map((option) => (
            <Pressable
              key={option}
              className="flex-row items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/70 px-4 py-3"
              onPress={() => setTheme(option)}
            >
              <Text className="capitalize text-slate-100">{option}</Text>
              {theme === option && <Feather name="check" size={18} color="#22D3EE" />}
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mt-6 gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5">
        <Text className="text-base font-semibold text-slate-100">通知与传感器</Text>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-medium text-slate-200">训练提醒</Text>
            <Text className="text-xs text-slate-500">启用后可安排本地推送，随时提醒计划</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={(next) => {
              if (next) {
                handleNotificationPermission().catch(() => null);
              } else {
                toggleNotifications(false);
              }
            }}
          />
        </View>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-medium text-slate-200">传感器采样</Text>
            <Text className="text-xs text-slate-500">开启后将持续监听加速度与陀螺仪</Text>
          </View>
          <Switch value={motionTrackingEnabled} onValueChange={toggleMotionTracking} />
        </View>
      </View>

      <View className="mt-6 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5">
        <Text className="text-base font-semibold text-slate-100">同步概览</Text>
        <Text className="mt-2 text-sm text-slate-400">
          当前同步队列 {queue.length} 条，远端已缓存 {remoteQuery.data?.length ?? 0} 条，状态：
          {remoteQuery.isFetching ? '同步中' : '空闲'}。
        </Text>
        <View className="mt-4 gap-2">
          {queue.map((item) => (
            <View
              key={item.id}
              className="rounded-xl border border-slate-800/80 bg-slate-900/80 px-4 py-3"
            >
              <Text className="text-sm text-slate-200">
                {item.entity} · {item.operation}
              </Text>
              <Text className="mt-1 text-xs text-slate-500">
                最近尝试：{item.lastTriedAt ? new Date(item.lastTriedAt).toLocaleString() : '未同步'}
              </Text>
              {item.error ? (
                <Text className="mt-1 text-xs text-amber-400">错误：{item.error}</Text>
              ) : null}
            </View>
          ))}
          {queue.length === 0 ? (
            <Text className="rounded-xl bg-slate-900/60 px-4 py-5 text-center text-sm text-slate-500">
              队列为空，本地与云端已经同步。
            </Text>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}
