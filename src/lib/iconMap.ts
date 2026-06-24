export const ICON_EMOJI: Record<string, string> = {
  star: "⭐",
  fire: "🔥",
  trophy: "🏆",
  bolt: "⚡",
  coin: "🪙",
  snowflake: "❄️",
  heart: "💜",
  warning: "⚠️",
  gift: "🎁",
  party: "🎉",
  brain: "🧠",
  check: "✅",
  cross: "❌",
  hourglass: "⏳",
  retry: "🔄",
  thumbup: "👍",
  thumbdown: "👎",
  dragon: "🐲",
  sprout: "🌱",
  ten: "🔟",
  muscle: "💪",
  volcano: "🌋",
  sword: "⚔️",
  crown: "👑",
  "cat-reading": "📖",
  "cat-study": "✏️",
  "cat-language": "🌍",
  "cat-sport": "⚽",
  "cat-routine": "🧹",
  "cat-other": "✨",
  "rw-digital": "💳",
  "rw-physical": "📦",
  "rw-experience": "🎟️",
  "rw-privilege": "⭐",
  lock: "🔒",
  ticket: "🎟️",
  robux: "🟢",
  vbucks: "🎮",
  steam: "🕹️",
  spotify: "🎵",
  battlenet: "🎮",
  riotpoints: "⚔️",
  cellphone: "📱",
  pizza: "🍕",
  icecream: "🍦",
  tent: "⛺",
  books: "📚",
  moon: "🌙",
  film: "🎬",
  cinema: "🍿",
  cupstrickers: "🃏",
  orcboss: "👹",
  slime: "🟢",
};

export const ICON_FILE: Record<string, string> = {
  thumbup: "Thumbs up",
  thumbdown: "Thumbs down",
  "cat-sport": "soccer ball",
  sprout: "plant",
  sword: "swords",
  lock: "locked",
  "cat-other": "flare",
  "cat-study": "pencil",
  "cat-language": "globe",
  "cat-routine": "broom",
  "cat-reading": "cat-reading",
  "rw-digital": "creditcard",
  "rw-physical": "box",
  "rw-experience": "ticket",
  "rw-privilege": "star",
  cellphone: "cellphone",
  pizza: "pizza",
  icecream: "icecream",
  tent: "tent",
  books: "books",
  moon: "moon",
  film: "film",
  cinema: "cinema",
  cupstrickers: "cupstrickers",
  orcboss: "orcboss",
};

const ICONS_WITHOUT_FILE = new Set(["heart", "warning", "gift", "party", "retry", "ten", "muscle", "volcano"]);

const EMOJI_TO_ICON: Record<string, string> = {};
for (const [name, emoji] of Object.entries(ICON_EMOJI)) {
  if (!ICONS_WITHOUT_FILE.has(name)) EMOJI_TO_ICON[emoji] = name;
}

export function emojiToIconName(emoji: string): string | null {
  if (ICON_EMOJI[emoji]) return emoji;
  return EMOJI_TO_ICON[emoji] ?? null;
}

export function getIconEmoji(name: string): string {
  return ICON_EMOJI[name] ?? "✨";
}

export function getIconFile(name: string): string {
  return ICON_FILE[name] ?? name;
}
