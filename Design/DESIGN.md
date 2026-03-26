# Design System: The Curated Anthology

## 1. Overview & Creative North Star

**Creative North Star: "Editorial Pixel-Brutalisim"**
This design system moves away from the generic "app-like" interfaces of the last decade, leaning instead into a sophisticated fusion of nostalgic pixel-art whimsy and high-end editorial precision. It treats the personal library not as a database, but as a prestigious gallery of intellectual artifacts.

The design breaks the "template" look through a commitment to **absolute 0px sharp edges**, intentional asymmetry in the "Digital Bookshelf" heights, and a bold interplay between wide-open "Sky" vistas and dense, information-rich "Shelf" clusters. By utilizing high-contrast typography and tonal layering instead of traditional borders, the interface feels like a custom-printed annual report rather than a standard web portal.

---

## 2. Colors

The color palette is anchored by a vibrant, energetic sky blue, balanced by a sophisticated set of surface neutrals that provide the "paper" and "ink" of the experience.

-   **The Sky (Primary):** `primary (#194ed8)` serves as the atmospheric backdrop. Use `primary_container (#819bff)` for clouds or soft atmospheric transitions.
-   **The Shelf & Ink (Neutrals):** `surface (#f6f6f9)` is the foundation for editorial content sections. `inverse_surface (#0c0e10)` is strictly reserved for the heavy, grounding element of the bookshelf itself.
-   **The Accents (Tertiary/Secondary):** `secondary (#755700)` provides a "Golden Age" gold for star ratings and high-value highlights, while `tertiary (#00675d)` offers a grounded teal for metadata.

### The "No-Line" Rule
To maintain a high-end, seamless feel, **1px solid borders are strictly prohibited.** Separation of concerns must be achieved through:
-   **Color Blocking:** A `surface_container_low` section placed directly against a `surface` background.
-   **Tonal Transitions:** Using subtle shifts between `surface_container_lowest` and `surface_container_high` to define content boundaries.

### Glass & Gradient Rule
To prevent the layout from feeling "flat," use semi-transparent glass effects for floating UI elements (like book details) using `surface_container_lowest` at 80% opacity with a `backdrop-blur` of 12px. Main CTAs should utilize a subtle vertical gradient from `primary` to `primary_dim` to provide "soul" and a tactile, ink-like depth.

---

## 3. Typography

The typography strategy relies on a "High-Low" mix: the authority of a serif paired with the technical utility of a modern sans-serif and a condensed monospaced-style label.

-   **The Masthead (Display-LG):** `notoSerif` at `3.5rem`. This is the system's voice—elegant, high-contrast, and reminiscent of luxury magazine covers.
-   **The Technical Spine (Label-MD):** `spaceGrotesk` at `0.75rem`. Used exclusively for book titles on spines and technical metadata. Its clean, condensed nature allows for maximum legibility in vertical orientations.
-   ** The Narrative (Body-LG):** `workSans` at `1rem`. Used for book reviews and long-form descriptions. It offers high readability and a neutral tone that allows the serif titles to shine.

---

## 4. Elevation & Depth

In a system with **0px roundedness**, depth is communicated through **Tonal Layering** and sophisticated light simulation rather than structural lines.

-   **The Layering Principle:** Treat the UI as a series of stacked sheets.
    -   *Base Layer:* `surface`
    -   *Interactive Elements:* `surface_container_lowest` (creates a soft, natural lift).
    -   *Deep Context:* `surface_container_high` (used for inset areas like the shelf shadow).
-   **Ambient Shadows:** For floating elements (like a book being "pulled" from the shelf), use a highly diffused shadow: `0px 20px 40px rgba(12, 14, 16, 0.06)`. The shadow must be a tinted version of `on_surface` to appear natural.
-   **The Ghost Border Fallback:** If accessibility requires a container definition, use `outline_variant` at **15% opacity**. It should be felt, not seen.
-   **Glassmorphism:** Use for "Cloud" navigation or tooltips. A `surface_bright` fill at 70% opacity with a heavy blur allows the `primary` background to bleed through, integrating the UI into the sky.

---

## 5. Components

### The Book Spine (Signature Component)
The core unit of the system.
-   **Geometry:** 0px radius. Heights vary between `20` (7rem) and `24` (8.5rem) on the spacing scale to create an organic, lived-in shelf look.
-   **Colors:** Use a rotation of `primary_container`, `secondary_container`, `tertiary_container`, and `error_container`.
-   **Labeling:** `label-md` (Space Grotesk) rotated 90 degrees. Text color should use the corresponding "on" token (e.g., `on_primary_container`).

### Buttons
-   **Primary:** Solid `primary` block, `on_primary` text, 0px radius.
-   **Secondary:** `surface_container_highest` background. No border.
-   **States:** On hover, shift background to `primary_dim`. Do not use "glow" effects; use solid color shifts.

### Tooltips & Overlays
-   **Styling:** Use the Glassmorphism rule. `surface_container_lowest` at 90% opacity.
-   **Content:** Pair a `title-sm` (Work Sans) with a `label-sm` (Space Grotesk) for a "Metadata Tag" aesthetic.

### Rating Stars
-   **Visuals:** Small, pixel-perfect star glyphs.
-   **Color:** Always `secondary (#755700)`.
-   **Layout:** Grouped tightly using `0.5` (0.175rem) spacing.

---

## 6. Do's and Don'ts

### Do
-   **Do** embrace verticality. Use the varying heights of book spines to create a rhythmic, musical layout.
-   **Do** use `spaceGrotesk` for any "data-heavy" moments (dates, page counts, ISBNs).
-   **Do** use white space (spacing scale `16` and `20`) to separate the Masthead from the Shelf.
-   **Do** ensure emojis are used sparingly as "easter eggs" to keep the "playful" vibe from becoming "childish."

### Don't
-   **Don't** use a single 1px border. Even for inputs, use a background shift (`surface_container_low`).
-   **Don't** use any border-radius. The "0px" rule is absolute to maintain the pixel-editorial aesthetic.
-   **Don't** use standard "drop shadows." If an element doesn't feel elevated enough through color alone, re-evaluate the Tonal Layering.
-   **Don't** center-align long-form body text. Keep it left-aligned to maintain the rigid, grid-based editorial feel.