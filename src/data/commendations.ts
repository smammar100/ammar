export interface Commendation {
  name: string;
  role: string;
  quote: string;
  image: string;
}

// TODO: collect real kind words. Ammar has zero public testimonials today —
// never fabricate quotes. When real ones exist, add entries matching the
// Commendation shape above (avatars live in /images/profiles/). Consumers
// (home page, /community) render nothing when this array is empty.
export const commendations: Commendation[] = [];
