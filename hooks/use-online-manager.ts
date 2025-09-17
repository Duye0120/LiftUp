import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

export function useOnlineManager() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = Boolean(state?.isConnected && state.isInternetReachable);
      onlineManager.setOnline(isOnline);
    });

    return () => unsubscribe();
  }, []);
}
