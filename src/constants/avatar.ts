export const AVATAR_SEEDS = [
  "Felix",
  "Aneka",
  "Zoe",
  "Midnight",
  "Bear",
  "Tiger",
  "Leo",
  "Sky",
  "Ginger",
  "Max",
  "Luna",
] as const;

export const getAvatarUrl = (seed: string) =>
  `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`;
