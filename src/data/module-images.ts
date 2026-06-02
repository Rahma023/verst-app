// Cover images per module. Replace any URL anytime — if a load fails, the
// component falls back to the abstract GlassThumb so layout never breaks.

const UNSPLASH_PARAMS = "?w=1200&q=80&auto=format&fit=crop";

export const MODULE_IMAGES: Record<string, string> = {
  // m1 — Introduction to Carbon Markets — African savanna, climate as a place
  m1: `https://images.unsplash.com/photo-1547471080-7cc2caa01a7e${UNSPLASH_PARAMS}`,
  // m2 — Organizational GHG Accounting — African corporate / industrial setting
  m2: `https://images.unsplash.com/photo-1497366754035-f200968a6e72${UNSPLASH_PARAMS}`,
  // m3 — Project-level GHG Accounting — reforestation / tree planting
  m3: `https://images.unsplash.com/photo-1542038784456-1ea8e935640e${UNSPLASH_PARAMS}`,
  // m4 — Carbon Finance — African city / business district (Lagos/Nairobi)
  m4: `https://images.unsplash.com/photo-1486325212027-8081e485255e${UNSPLASH_PARAMS}`,
  // m5 — Article 6 of the Paris Agreement — flags / diplomacy
  m5: `https://images.unsplash.com/photo-1568393691080-9c0e74f01809${UNSPLASH_PARAMS}`,
  // a1 — Foundations of AI for Climate — tech + practitioner
  a1: `https://images.unsplash.com/photo-1518770660439-4636190af475${UNSPLASH_PARAMS}`,
  // a2 — AI for Carbon Monitoring & MRV — Earth from space / satellite
  a2: `https://images.unsplash.com/photo-1446776877081-d282a0f896e2${UNSPLASH_PARAMS}`,
  // a3 — AI for Climate Modelling — weather / clouds / patterns
  a3: `https://images.unsplash.com/photo-1561484930-998b6a7b22e8${UNSPLASH_PARAMS}`,
  // a4 — GenAI for Sustainability Teams — laptop + greenery
  a4: `https://images.unsplash.com/photo-1542601906990-b4d3fb778b09${UNSPLASH_PARAMS}`,
};
