export function getErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error';

  if (typeof error === 'string') return error;

  if (error instanceof Error) {
    // Network errors
    if (
      error.message.includes('Network Error') ||
      error.message.includes('fetch')
    ) {
      return 'No internet connection. Check your network and try again.';
    }
    // GW2 API specific
    if (error.message.includes('401')) {
      return 'Invalid API key. Check your key in Settings.';
    }
    if (error.message.includes('403')) {
      return 'Missing API key permissions. Regenerate your key with all required permissions.';
    }
    if (error.message.includes('429')) {
      return 'Too many requests. Wait a moment and try again.';
    }
    if (error.message.includes('500') || error.message.includes('503')) {
      return 'GW2 API is currently down. Try again later.';
    }
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes('Network Error') || error.message.includes('fetch'))
  );
}

export function isAuthError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes('401') || error.message.includes('403'))
  );
}
