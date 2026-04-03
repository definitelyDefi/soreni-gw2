import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Card from '../ui/Card';
import {useCharacters} from '../../hooks/useGW2';
import {useAppStore} from '../../store/appStore';
import {colors, fontSize, spacing, radius} from '../../constants/theme';

const PROF_COLORS: Record<string, string> = {
  Elementalist:  '#f48fb1',
  Necromancer:   '#52c41a',
  Mesmer:        '#e040fb',
  Guardian:      '#72c1d9',
  Warrior:       '#ffc107',
  Revenant:      '#a1887f',
  Engineer:      '#ff8f00',
  Ranger:        '#8bc34a',
  Thief:         '#9e9e9e',
};

const PROF_EMOJI: Record<string, string> = {
  Elementalist: '🔥',
  Necromancer:  '💀',
  Mesmer:       '🌀',
  Guardian:     '✨',
  Warrior:      '⚔️',
  Revenant:     '🔮',
  Engineer:     '⚙️',
  Ranger:       '🏹',
  Thief:        '🗡️',
};

export default function CharactersWidget() {
  const {settings} = useAppStore();
  const {data: characters, isLoading} = useCharacters();

  if (!settings.apiKey) return null;

  const displayed = (characters ?? []).slice(0, 5);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>⚔️ Characters</Text>
        {characters && (
          <Text style={styles.count}>{characters.length} total</Text>
        )}
      </View>
      {isLoading ? (
        <ActivityIndicator color={colors.gold} size="small" />
      ) : (
        <View style={styles.list}>
          {displayed.map(char => {
            const profColor = PROF_COLORS[char.profession] ?? colors.textMuted;
            const profEmoji = PROF_EMOJI[char.profession] ?? '🧙';
            return (
              <View key={char.name} style={styles.row}>
                <View style={[styles.profDot, {backgroundColor: profColor + '33', borderColor: profColor + '88'}]}>
                  <Text style={styles.profEmoji}>{profEmoji}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={1}>{char.name}</Text>
                  <Text style={[styles.prof, {color: profColor}]}>{char.profession}</Text>
                </View>
                <View style={styles.right}>
                  <Text style={styles.level}>Lv {char.level}</Text>
                  <Text style={styles.deaths}>{char.deaths} ☠</Text>
                </View>
              </View>
            );
          })}
          {(characters?.length ?? 0) > 5 && (
            <Text style={styles.more}>+{characters!.length - 5} more</Text>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {marginBottom: spacing.md, gap: spacing.sm},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {color: colors.gold, fontSize: fontSize.md, fontWeight: '700'},
  count: {color: colors.textMuted, fontSize: fontSize.xs},
  list: {gap: spacing.xs},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 3,
  },
  profDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  profEmoji: {fontSize: 16},
  info: {flex: 1},
  name: {color: colors.text, fontSize: fontSize.sm, fontWeight: '600'},
  prof: {fontSize: fontSize.xs, fontWeight: '600'},
  right: {alignItems: 'flex-end', gap: 1},
  level: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '700'},
  deaths: {color: colors.textMuted, fontSize: fontSize.xs},
  more: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
  },
});
