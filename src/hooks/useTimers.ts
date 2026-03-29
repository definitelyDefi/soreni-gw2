import {useState, useEffect} from 'react';
import {WORLD_BOSSES, META_EVENTS} from '../constants/worldBosses';
import {WorldBoss, MetaEvent} from '../types';

export interface BossTimer {
  boss: WorldBoss | MetaEvent;
  secondsUntil: number;
  minutesUntil: number;
  isActive: boolean;
  secondsRemaining: number;
  nextSpawn: Date;
  countdown: string;
  type: 'boss' | 'meta';
  category?: string;
  startTime: string; // "HH:MM" local time
  endTime: string;   // "HH:MM" local time
}

// Convert UTC minutes-from-midnight to the phone's local HH:MM
function utcMinsToLocal(utcMins: number): string {
  const normalized = ((utcMins % 1440) + 1440) % 1440;
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setTime(d.getTime() + normalized * 60 * 1000);
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
}

function fmtLocalTime(spawnMinute: number, durationMinutes: number, offset: number = 0): [string, string] {
  const startTotal = spawnMinute + offset;
  const endTotal = startTotal + durationMinutes;
  return [utcMinsToLocal(startTotal), utcMinsToLocal(endTotal)];
}

function getUTCSeconds(): number {
  const now = new Date();
  return (
    now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds()
  );
}

function computeTimer(
  boss: WorldBoss | MetaEvent,
  type: 'boss' | 'meta',
): BossTimer {
  const nowSecs = getUTCSeconds();
  const now = new Date();

  for (const spawnMinute of boss.schedule) {
    const spawnSec = spawnMinute * 60;
    const endSec = spawnSec + boss.duration * 60;
    if (nowSecs >= spawnSec && nowSecs < endSec) {
      const secondsRemaining = endSec - nowSecs;
      const [startTime, endTime] = fmtLocalTime(spawnMinute, boss.duration);
      return {
        boss,
        secondsUntil: 0,
        minutesUntil: 0,
        isActive: true,
        secondsRemaining,
        nextSpawn: new Date(),
        countdown: 'Active',
        type,
        category: (boss as MetaEvent).category,
        startTime,
        endTime,
      };
    }
  }

  if (boss.schedule.length === 0) {
    return {
      boss,
      secondsUntil: Infinity,
      minutesUntil: Infinity,
      isActive: false,
      secondsRemaining: 0,
      nextSpawn: new Date(0),
      countdown: '—',
      type,
      category: (boss as MetaEvent).category,
      startTime: '—',
      endTime: '—',
    };
  }

  let nextSpawnMinute = boss.schedule.find((s: number) => s * 60 >= nowSecs);
  const wrapToTomorrow = nextSpawnMinute === undefined;
  if (wrapToTomorrow) nextSpawnMinute = boss.schedule[0];

  const nextSpawn = new Date();
  if (wrapToTomorrow) nextSpawn.setUTCDate(nextSpawn.getUTCDate() + 1);
  nextSpawn.setUTCHours(Math.floor(nextSpawnMinute! / 60));
  nextSpawn.setUTCMinutes(nextSpawnMinute! % 60);
  nextSpawn.setUTCSeconds(0);
  nextSpawn.setUTCMilliseconds(0);

  const secondsUntil = Math.round((nextSpawn.getTime() - now.getTime()) / 1000);
  const minutesUntil = Math.floor(secondsUntil / 60);

  const h = Math.floor(secondsUntil / 3600);
  const m = Math.floor((secondsUntil % 3600) / 60);
  const s = secondsUntil % 60;
  const countdown =
    h > 0 ? `${h}h ${m}m` : `${m}:${s.toString().padStart(2, '0')}`;

  const [startTime, endTime] = fmtLocalTime(nextSpawnMinute!, boss.duration);

  return {
    boss,
    secondsUntil,
    minutesUntil,
    isActive: false,
    secondsRemaining: 0,
    nextSpawn,
    countdown,
    type,
    category: (boss as MetaEvent).category,
    startTime,
    endTime,
  };
}

export function useTimers(
  includeType: 'boss' | 'meta' | 'all' = 'all',
): BossTimer[] {
  const [timers, setTimers] = useState<BossTimer[]>([]);

  useEffect(() => {
    function update() {
      const bosses =
        includeType !== 'meta'
          ? WORLD_BOSSES.map(b => computeTimer(b, 'boss'))
          : [];
      const metas =
        includeType !== 'boss'
          ? META_EVENTS.map(b => computeTimer(b, 'meta'))
          : [];
      const all = [...bosses, ...metas].sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return a.secondsUntil - b.secondsUntil;
      });
      setTimers(all);
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [includeType]);

  return timers;
}

export function useNextBoss(): BossTimer | null {
  const timers = useTimers('boss');
  return timers.find(t => !t.isActive) ?? timers[0] ?? null;
}

export function useActiveBosses(): BossTimer[] {
  const timers = useTimers('all');
  return timers.filter(t => t.isActive);
}
