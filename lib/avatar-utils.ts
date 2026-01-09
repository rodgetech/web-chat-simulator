const AVATAR_COLORS = [
  "#00a884",
  "#0088cc",
  "#c03a82",
  "#d09337",
  "#6c4196",
  "#d35400",
  "#009688",
];

/**
 * Generate a deterministic avatar color based on the name
 * @param name - The name to generate a color for
 * @returns A hex color string
 */
export function getAvatarColor(name: string): string {
  // Simple hash function on name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
