import { useEffect, useState } from 'react';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { useSettingsStore } from '@/stores/settings-store';

export type MotionSample = {
  acceleration?: {
    x?: number;
    y?: number;
    z?: number;
  };
  rotation?: {
    x?: number;
    y?: number;
    z?: number;
  };
  timestamp: number;
};

const SAMPLE_INTERVAL = 1000;

export function useMotionTracking() {
  const motionTrackingEnabled = useSettingsStore((state) => state.motionTrackingEnabled);
  const [sample, setSample] = useState<MotionSample | null>(null);

  useEffect(() => {
    let accelSubscription: { remove: () => void } | null = null;
    let gyroSubscription: { remove: () => void } | null = null;

    Accelerometer.setUpdateInterval(SAMPLE_INTERVAL);
    Gyroscope.setUpdateInterval(SAMPLE_INTERVAL);

    if (motionTrackingEnabled) {
      accelSubscription = Accelerometer.addListener((acceleration) => {
        setSample((current) => ({
          acceleration,
          rotation: current?.rotation,
          timestamp: Date.now(),
        }));
      });

      gyroSubscription = Gyroscope.addListener((rotation) => {
        setSample((current) => ({
          acceleration: current?.acceleration,
          rotation,
          timestamp: Date.now(),
        }));
      });
    } else {
      setSample(null);
    }

    return () => {
      accelSubscription?.remove?.();
      gyroSubscription?.remove?.();
    };
  }, [motionTrackingEnabled]);

  return sample;
}
