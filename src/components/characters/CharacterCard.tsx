import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Card from '../ui/Card';
import ProfessionIcon from '../ui/ProfessionIcon';
import {Character} from '../../types';
import {colors, fontSize, spacing, radius} from '../../constants/theme';
import {profession as professionColors} from '../../constants/theme';

interface CharacterCardProps {
  character: Character;
  onPress?: () => void;
}

export default function CharacterCard({
  character,
  onPress,
}: CharacterCardProps) {
  const profColor =
    professionColors[character.profession as keyof typeof professionColors] ??
    '#888';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card
        style={[styles.card, {borderLeftColor: profColor, borderLeftWidth: 3}]}>
        <View style={styles.header}>
          <ProfessionIcon professionName={character.profession} size={44} />
          <View style={styles.info}>
            <Text style={styles.name}>{character.name}</Text>
            <Text style={[styles.profession, {color: profColor}]}>
              {character.profession}
            </Text>
            <Text style={styles.sub}>
              {character.race} • {character.gender}
            </Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{character.level}</Text>
            <Text style={styles.levelLabel}>LVL</Text>
          </View>
        </View>

        {character.crafting?.length > 0 && (
          <View style={styles.crafting}>
            {character.crafting.map(c => (
              <View
                key={c.discipline}
                style={[styles.craftBadge, !c.active && styles.craftInactive]}>
                <Text
                  style={[
                    styles.craftText,
                    !c.active && styles.craftTextInactive,
                  ]}>
                  {c.discipline} {c.rating}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>⚔️ {character.deaths} deaths</Text>
          <Text style={styles.footerText}>
            🕐 {Math.floor(character.age / 3600)}h played
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  profession: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  sub: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  levelBadge: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minWidth: 44,
  },
  levelText: {
    color: colors.gold,
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  levelLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  crafting: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.sm,
  },
  craftBadge: {
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  craftInactive: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  craftText: {
    color: colors.gold,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  craftTextInactive: {
    color: colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
});
