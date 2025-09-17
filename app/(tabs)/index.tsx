import { useCallback, useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';

import { useLocalSessions } from '@/hooks/use-local-sessions';
import { useMotionTracking } from '@/lib/sensors/use-motion';
import { scheduleLocalNotification } from '@/lib/notifications';
import { createSession } from '@/lib/db/repository';
import { useCreateSessionMutation, useLiftSessionsQuery } from '@/lib/api/hooks';
import { useSyncQueue } from '@/lib/sync/use-sync-queue';
import type { LiftSession, NewLiftSession } from '@/lib/db/schema';

const ATHLETE_PLACEHOLDER = 'local-athlete';

function SessionItem({ session }: { session: LiftSession }) {
  const completed = Boolean(session.completedAt);
  const completedAt = session.completedAt
    ? format(new Date(session.completedAt), 'MM-dd HH:mm')
    : '进行中';

  return (
    <View className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-slate-100">{session.notes ?? '力量训练'}</Text>
        <View className="flex-row items-center gap-1">
          <Feather
            name={completed ? 'check-circle' : 'clock'}
            color={completed ? '#22D3EE' : '#94A3B8'}
            size={16}
          />
          <Text className="text-xs text-slate-400">{completedAt}</Text>
        </View>
      </View>
      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-xs uppercase tracking-widest text-slate-500">总负重</Text>
        <Text className="text-lg font-bold text-cyan-300">{Math.round(session.totalVolume ?? 0)} kg</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { sessions, reload, isLoading: loadingLocal } = useLocalSessions();
  const remoteQuery = useLiftSessionsQuery();
  const motion = useMotionTracking();
  const mutation = useCreateSessionMutation();
  const { queue } = useSyncQueue();

  const combinedSessions = useMemo(() => {
    if (sessions.length > 0) {
      return sessions;
    }

    return remoteQuery.data ?? [];
  }, [sessions, remoteQuery.data]);

  const onRefresh = useCallback(async () => {
    await reload();
    await remoteQuery.refetch();
  }, [reload, remoteQuery]);

  const handleAddSession = useCallback(async () => {
    const timestamp = Date.now();
    const payload: NewLiftSession = {
      athleteId: ATHLETE_PLACEHOLDER,
      startedAt: timestamp,
      completedAt: null,
      totalVolume: (motion?.acceleration?.z ?? 0) * 10,
      notes: motion?.rotation ? '传感器驱动训练' : '快速记录训练',
      createdAt: timestamp,
      updatedAt: timestamp,
      remoteId: null,
    };

    await createSession(payload);
    await reload();
    await mutation.mutateAsync(payload).catch(() => null);
    await scheduleLocalNotification({
      title: '训练已保存',
      body: '离线情况下也会自动同步，稍后留意同步队列。',
      data: { type: 'session', createdAt: timestamp },
    });
  }, [mutation, reload, motion]);

  return (
    <View className="flex-1 bg-slate-950 px-5 pt-10">
      <View className="mb-6">
        <Text className="text-sm text-slate-400">本地会优先展示最新训练记录</Text>
        <Text className="mt-1 text-2xl font-bold text-slate-100">LiftUp 训练面板</Text>
        <Text className="mt-2 text-xs text-slate-500">
          传感器最近一次读数：加速度 {motion?.acceleration?.z?.toFixed?.(2) ?? '0.00'}，角速度{' '}
          {motion?.rotation?.z?.toFixed?.(2) ?? '0.00'}
        </Text>
      </View>

      <Pressable
        className="mb-5 flex-row items-center justify-center rounded-2xl bg-cyan-500 py-3"
        onPress={handleAddSession}
      >
        <Feather name="plus-circle" size={18} color="#0F172A" />
        <Text className="ml-2 font-semibold text-slate-900">快速记录一次训练</Text>
      </Pressable>

      <FlatList
        data={combinedSessions}
        keyExtractor={(item) => `${item.id}`}
        ItemSeparatorComponent={() => <View className="h-4" />}
        renderItem={({ item }) => <SessionItem session={item} />}
        refreshControl={
          <RefreshControl
            tintColor="#22D3EE"
            refreshing={loadingLocal || remoteQuery.isFetching}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <View className="items-center justify-center rounded-2xl border border-dashed border-slate-700/80 px-6 py-12">
            <Text className="text-base font-semibold text-slate-300">暂未记录训练</Text>
            <Text className="mt-2 text-center text-sm text-slate-500">
              点击上方按钮即可离线写入，稍后联网会自动同步。
            </Text>
          </View>
        }
        ListFooterComponent={
          <View className="mt-6">
            <Text className="text-xs text-slate-500">
              同步队列：{queue.length} 条，远端数据 {remoteQuery.data?.length ?? 0} 条
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}
