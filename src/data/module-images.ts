// Cover images per module. Replace any URL anytime — if a load fails, the
// component falls back to the abstract GlassThumb so layout never breaks.
//
// Curated for striking African imagery with strong colour saturation so the
// new green-glow thumb shadow reads as deliberate, not muddy. All Unsplash.

const P = "?w=1400&q=85&auto=format&fit=crop";

export const MODULE_IMAGES: Record<string, string> = {
  // m1 — Introduction to Carbon Markets — savanna sunset / acacia silhouette
  m1: `https://images.unsplash.com/photo-1516426122078-c23e76319801${P}`,
  // m2 — Organizational GHG Accounting — Lagos / Nairobi business skyline at dusk
  m2: `https://images.unsplash.com/photo-1580060839134-75a5edca2e99${P}`,
  // m3 — Project-level GHG Accounting — reforestation, hands holding a sapling
  m3: `https://images.unsplash.com/photo-1542601906990-b4d3fb778b09${P}`,
  // m4 — Carbon Finance — coastal Lagos / Mombasa skyline with port
  m4: `https://images.unsplash.com/photo-1611348586804-61bf6c080437${P}`,
  // m5 — Article 6 of the Paris Agreement — global summit, flags, diplomacy
  m5: `https://images.unsplash.com/photo-1593115057322-e94b77572f20${P}`,
  // a1 — Foundations of AI for Climate — practitioner with laptop on terrain
  a1: `https://images.unsplash.com/photo-1573164713988-8665fc963095${P}`,
  // a2 — AI for Carbon Monitoring & MRV — Earth from space / satellite over Africa
  a2: `https://images.unsplash.com/photo-1451187580459-43490279c0fa${P}`,
  // a3 — AI for Climate Modelling — atmosphere / cloud system / weather radar
  a3: `https://images.unsplash.com/photo-1561553590-267fc716698a${P}`,
  // a4 — GenAI for Sustainability Teams — green leaf detail / data with nature
  a4: `https://images.unsplash.com/photo-1518495973542-4542c06a5843${P}`,
};
