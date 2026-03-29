import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {profession} from '../../constants/theme';
import {radius} from '../../constants/theme';

const PROFESSION_EMOJI: Record<string, string> = {
  Guardian: '🛡️',
  Warrior: '⚔️',
  Engineer: '⚙️',
  Ranger: '🏹',
  Thief: '🗡️',
  Elementalist: '🔥',
  Mesmer: '🔮',
  Necromancer: '💀',
  Revenant: '👁️',
};

interface ProfessionIconProps {
  professionName: string;
  size?: number;
  showLabel?: boolean;
}

export default function ProfessionIcon({
  professionName,
  size = 36,
  showLabel = false,
}: ProfessionIconProps) {
  const color = profession[professionName as keyof typeof profession] ?? '#888';
  const emoji = PROFESSION_EMOJI[professionName] ?? '⚔️';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.icon,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color + '22',
            borderColor: color,
          },
        ]}>
        <Text style={{fontSize: size * 0.5}}>{emoji}</Text>
      </View>
      {showLabel && (
        <Text style={[styles.label, {color}]}>{professionName}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
});
