import gw2Api from './client';

export interface GuildInfo {
  id: string;
  name: string;
  tag: string;
  level?: number;
  motd?: string;
  influence?: number;
  aetherium?: number;
  favor?: number;
  member_count?: number;
  member_capacity?: number;
  emblem?: {
    background?: {id: number; colors: number[]};
    foreground?: {id: number; colors: number[]; flags?: string[]};
  };
}

export interface GuildTreasuryItem {
  item_id: number;
  count: number;
  needed_by: {upgrade_id: number; count: number}[];
}

export interface GuildLogEntry {
  id: number;
  time: string;
  user?: string;
  type: string;
  invited_by?: string;
  kicked_by?: string;
  changed_by?: string;
  old_rank?: string;
  new_rank?: string;
  item_id?: number;
  count?: number;
  coins?: number;
  operation?: string;
  upgrade_id?: number;
  recipe_id?: number;
  motd?: string;
}

export interface GuildMember {
  name: string;
  rank: string;
  joined: string;
}

export async function getGuild(id: string): Promise<GuildInfo> {
  const res = await gw2Api.get(`/guild/${id}`);
  return res.data;
}

export async function getGuildTreasury(id: string): Promise<GuildTreasuryItem[]> {
  const res = await gw2Api.get(`/guild/${id}/treasury`);
  return res.data;
}

export async function getGuildLog(id: string): Promise<GuildLogEntry[]> {
  const res = await gw2Api.get(`/guild/${id}/log`);
  return res.data;
}

export async function getGuildMembers(id: string): Promise<GuildMember[]> {
  const res = await gw2Api.get(`/guild/${id}/members`);
  return res.data;
}
