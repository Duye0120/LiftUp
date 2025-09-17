import * as Sentry from 'sentry-expo';

let initialized = false;

export function initSentry() {
  if (initialized) {
    return;
  }

  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    enableInExpoDevelopment: false,
    debug: process.env.NODE_ENV === 'development',
  });

  initialized = true;
}

export function trackError(error: unknown) {
  if (!initialized) {
    initSentry();
  }

  if (error instanceof Error) {
    Sentry.Native.captureException(error);
  } else {
    Sentry.Native.captureException(new Error(JSON.stringify(error)));
  }
}
