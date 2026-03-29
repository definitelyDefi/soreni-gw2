import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {getErrorMessage, isAuthError} from '../../utils/errors';
import {colors, fontSize, spacing, radius} from '../../constants/theme';

interface ErrorMessageProps {
  error: unknown;
  onRetry?: () => void;
  compact?: boolean;
}

export default function ErrorMessage({
  error,
  onRetry,
  compact = false,
}: ErrorMessageProps) {
  const message = getErrorMessage(error);
  const isAuth = isAuthError(error);

  if (compact) {
    return (
      <View style={styles.compact}>
        <Text style={styles.compactText}>⚠️ {message}</Text>
        {onRetry && (
          <TouchableOpacity onPress={onRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{isAuth ? '🔑' : '⚠️'}</Text>
      <Text style={styles.message}>{message}</Text>
      {isAuth && (
        <Text style={styles.hint}>Go to Settings → API Key to fix this</Text>
      )}
      {onRetry && (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryBtnText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  emoji: {
    fontSize: 36,
  },
  message: {
    color: colors.text,
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  hint: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  retryBtnText: {
    color: '#000',
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: radius.md,
    padding: spacing.sm,
    margin: spacing.md,
    gap: spacing.sm,
  },
  compactText: {
    color: colors.red,
    fontSize: fontSize.xs,
    flex: 1,
  },
  retryText: {
    color: colors.gold,
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
});
