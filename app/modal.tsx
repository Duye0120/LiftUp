import { Pressable, ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';

import { useSyncQueue } from '@/lib/sync/use-sync-queue';
import { useSyncProcessor } from '@/lib/sync/runner';

export default function SyncModal() {
  const { queue } = useSyncQueue();
  const { syncNow } = useSyncProcessor();

  return (
    <ScrollView className="flex-1 bg-slate-950 px-6 pt-14" contentContainerStyle={{ paddingBottom: 40 }}>
      <Text className="text-2xl font-bold text-slate-100">同步队列详情</Text>
      <Text className="mt-2 text-sm text-slate-400">
        本地写入会首先保存在 SQLite，然后进入队列。联网后可再次触发同步，采用最后写入覆盖策略。
      </Text>

      <View className="mt-6 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-5">
        <Text className="text-base font-semibold text-cyan-200">手动触发同步</Text>
        <Text className="mt-1 text-xs text-cyan-100/70">
          如果你确认已经恢复网络，可点击下方按钮强制尝试同步。
        </Text>
        <Pressable
          className="mt-4 flex-row items-center justify-center rounded-xl bg-cyan-500 py-3"
          onPress={() => {
            syncNow().catch(() => null);
          }}
        >
          <Feather name="refresh-ccw" size={18} color="#0F172A" />
          <Text className="ml-2 font-semibold text-slate-900">立即同步</Text>
        </Pressable>
      </View>

      <View className="mt-6 gap-4">
        {queue.map((item) => (
          <View key={item.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4">
            <Text className="text-sm font-semibold text-slate-100">
              {item.entity} · {item.operation}
            </Text>
            <Text className="mt-1 text-xs text-slate-500">
              创建时间：{new Date(item.createdAt).toLocaleString()}
            </Text>
            <Text className="mt-1 text-xs text-slate-500">
              最近更新：{new Date(item.updatedAt).toLocaleString()}
            </Text>
            <Text className="mt-1 text-xs text-slate-500">
              最近尝试：{item.lastTriedAt ? new Date(item.lastTriedAt).toLocaleString() : '未重试'}
            </Text>
            {item.error ? (
              <Text className="mt-2 text-xs text-amber-400">错误：{item.error}</Text>
            ) : null}
          </View>
        ))}

        {queue.length === 0 ? (
          <View className="items-center rounded-2xl border border-slate-800/80 bg-slate-900/70 px-6 py-12">
            <Feather name="check-circle" size={24} color="#22D3EE" />
            <Text className="mt-3 text-base font-semibold text-slate-200">队列为空</Text>
            <Text className="mt-1 text-center text-sm text-slate-500">
              所有变更已同步至服务器，继续保持训练节奏！
            </Text>
          </View>
        ) : null}
      </View>

      <Link href="/" asChild>
        <Pressable className="mt-8 flex-row items-center justify-center rounded-xl border border-slate-800/70 py-3">
          <Feather name="arrow-left" size={18} color="#cbd5f5" />
          <Text className="ml-2 text-sm font-semibold text-slate-200">返回主界面</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}
