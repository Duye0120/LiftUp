import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useSettingsStore } from '@/stores/settings-store';

type ColorSchemeName = 'light' | 'dark';

export function useColorScheme(): ColorSchemeName {
  const themePreference = useSettingsStore((state) => state.theme);
  const systemScheme = useSystemColorScheme() ?? 'light';

  if (themePreference === 'system') {
    return systemScheme;
  }

  return themePreference;
}
