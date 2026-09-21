/**
 * The backend's Section model enum only allows these 8 types (verified from
 * src/models/Section.js) — the admin section builder must only ever offer
 * these, even though the seed script references other, unsupported type
 * strings.
 */
export const SECTION_TYPES = [
  "hero",
  "featured",
  "spotlight",
  "story",
  "editorial",
  "testimonials",
  "social",
  "newsletter",
];

const LABELS = {
  hero: "Hero Banner",
  featured: "Featured Products",
  spotlight: "Spotlight",
  story: "Brand Story",
  editorial: "Editorial Banner",
  testimonials: "Testimonials",
  social: "Social Grid",
  newsletter: "Newsletter Signup",
};

export function getSectionTypeLabel(type) {
  return LABELS[type] ?? type;
}
