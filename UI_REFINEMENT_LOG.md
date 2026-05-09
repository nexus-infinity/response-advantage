---

## UI Refinement Phase (Session 2026-05-10, Part 3)

### Changes Made

**1. Coherence HUD ("Burger Coherence") - Always Visible**
- New component: `/components/coherence-hud.tsx`
- Fixed position (bottom-right, z-40) to never overlap critical content
- Compact collapsed state: shows score % + 6-vertex strip
- Expandable panel with:
  - Vertex status details (pending/active/complete)
  - Score breakdown (Evidence Quality, Legal Grounding, Pattern Recognition)
  - Quick actions (View Case, Export)
- Uses glassmorphism styling (Apple aesthetic aligned)
- Added globally in `/app/layout.tsx` so it's always visible

**2. De-Noised Landing Page (`/app/page.tsx`)**
- Removed scattered chaos fragments animation (was kinetic/unprofessional)
- Replaced with calm, centered list display
- Fragments shown sequentially (fade-in, staggered ~100ms delays)
- Reduced visual noise while maintaining the "here's the chaos" narrative

**3. Isolation of Cinematic Moments**
- `/processing` page remains the ONLY place with full cinematic treatment
  - Google Maps satellite view (hybrid with 45° tilt)
  - Flying paths between events
  - Symbol markers with pulsing animations
- All other pages are now restrained and professional
- Landing page transformation stays calm with simple fades

**4. Map Integration**
- `/processing` uses real Google Maps with geocoding
- `/observe` has `LocationMap` component (static map via server API)
- `/result` can include map snapshot if needed
- Fallback to Leaflet if Google Maps API unavailable

### Design Principles Applied

1. **Single point of kinetic energy**: `/processing` only
2. **Calm, professional baseline**: All other routes
3. **Persistent system status**: Coherence HUD always visible but unobtrusive
4. **Apple aesthetic**: Glassmorphism, soft shadows, smooth transitions, no harsh borders
5. **Professional forensics**: Evidence-first, not art-gallery style

### Files Modified

- `/components/coherence-hud.tsx` (NEW - 252 lines)
- `/app/page.tsx` (de-noised chaos, removed scatter animation)
- `/app/layout.tsx` (added CoherenceHUD import and component)

### Next Steps

1. **Optional**: Tune Coherence HUD scores based on packet state
2. **Optional**: Add "quick jump to next incomplete vertex" in HUD
3. **Monitor**: Ensure coherence calculations align with packet triangle validation
4. **Polish**: Test responsive layout on mobile (HUD may need repositioning)

---
