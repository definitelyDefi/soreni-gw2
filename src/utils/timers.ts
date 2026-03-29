import {WorldBoss} from '../types';

export function getUTCMinutes(): number {
  const now = new Date();
  return now.getUTCHours() * 60 + now.getUTCMinutes();
}

export function getNextSpawn(boss: WorldBoss): {
  nextSpawn: Date;
  minutesUntil: number;
  isActive: boolean;
} {
  const nowMinutes = getUTCMinutes();
  const now = new Date();

  // Check if currently active
  for (const spawnMinute of boss.schedule) {
    if (nowMinutes >= spawnMinute && nowMinutes < spawnMinute + boss.duration) {
      const spawnTime = new Date();
      spawnTime.setUTCHours(Math.floor(spawnMinute / 60));
      spawnTime.setUTCMinutes(spawnMinute % 60);
      spawnTime.setUTCSeconds(0);
      return {nextSpawn: spawnTime, minutesUntil: 0, isActive: true};
    }
  }

  // Find next spawn
  let nextSpawnMinute = boss.schedule.find(s => s > nowMinutes);

  // If no spawn today, wrap to tomorrow
  const wrapToTomorrow = nextSpawnMinute === undefined;
  if (wrapToTomorrow) {
    nextSpawnMinute = boss.schedule[0];
  }

  const nextSpawn = new Date();
  if (wrapToTomorrow) {
    nextSpawn.setUTCDate(nextSpawn.getUTCDate() + 1);
  }
  nextSpawn.setUTCHours(Math.floor(nextSpawnMinute! / 60));
  nextSpawn.setUTCMinutes(nextSpawnMinute! % 60);
  nextSpawn.setUTCSeconds(0);
  nextSpawn.setUTCMilliseconds(0);

  const minutesUntil = Math.round(
    (nextSpawn.getTime() - now.getTime()) / 60000,
  );

  return {nextSpawn, minutesUntil, isActive: false};
}

export function formatCountdown(minutes: number): string {
  if (minutes <= 0) return 'Active now';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatTime(date: Date): string {
  return date.toUTCString().slice(17, 22) + ' UTC';
}

export function getNextDailyReset(): {resetTime: Date; hoursUntil: number; minutesUntil: number} {
  const now = new Date();
  const reset = new Date();
  reset.setUTCHours(0, 0, 0, 0);
  if (now >= reset) {
    reset.setUTCDate(reset.getUTCDate() + 1);
  }
  const msUntil = reset.getTime() - now.getTime();
  const hoursUntil = Math.floor(msUntil / 3600000);
  const minutesUntil = Math.floor(msUntil / 60000);
  return {resetTime: reset, hoursUntil, minutesUntil};
}
