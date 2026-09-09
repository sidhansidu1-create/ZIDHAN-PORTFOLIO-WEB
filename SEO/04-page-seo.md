# Page-by-Page On-Page SEO Specifications

This document outlines complete, production-ready on-page SEO assets for all pages on `https://zidhanzid.com`.

---

## 1. Page: Homepage (`index.html`)

### General SEO Meta
* **URL:** `https://zidhanzid.com/` (Canonical: `https://zidhanzid.com/`)
* **SEO Title:** `Muhammed Sidhan | Brand Designer & Visual Storyteller | ZIDHANZID`
* **Meta Description:** `Muhammed Sidhan (ZIDHANZID) is a premier brand identity designer and visual storyteller crafting high-impact branding, logos, packaging, and Instagram 9-grid campaigns.`
* **Primary Keyword:** `brand designer`
* **Secondary Keywords:** `brand identity designer`, `visual storyteller`, `freelance brand designer India`, `instagram 9 grid designer`, `creative logo design`
* **Language & Viewport:** `<html lang="en">`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
* **Robots Meta:** `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`

### Heading Architecture
* **H1:**
  ```html
  <h1 class="hero-title">Muhammed <span class="gradient-text-blue-purple">Sidhan</span></h1>
  ```
  *Subheading context:* `Brand Designer & Visual Storyteller — crafting premium identities that leave a lasting impression.`
* **Suggested H2s:**
  1. `RECOGNIZED BY THE BRANDS` (Section: `#recognition`)
  2. `Designing with Purpose. Driven by Passion.` (Section: `#about`)
  3. `Kibblix Branding Case Study` (Section: `#kibblix`)
  4. `Upcoming Branding Works` (Section: Global Projects)
  5. `Recent Works: 9-Grid Instagram Campaigns` (Section: `#recent`)
  6. `What is a 9-Grid Instagram Campaign?` (Section: `#campaign-details`)
  7. `Selected Projects & Design Portfolio` (Section: `#work`)
  8. `Poster Explorations & Visual Art` (Section: Poster Slider)
  9. `Skills & Technical Expertise` (Section: `#skills`)
  10. `Comprehensive Design Services` (Section: `#services`)
  11. `Strategic Design Process` (Section: `.process`)
  12. `Client Testimonials & Reviews` (Section: `.testimonials`)
  13. `Let's Collaborate: Start Your Brand Project` (Section: `#contact`)
* **Suggested H3s:**
  * In Services: `Brand Identity Design`, `Graphic Design`, `Print & Layout`, `Video & Motion`, `Web Development`
  * In Strategy: `Strategic First Impression`, `Visual Brand Storytelling`, `Brand Consistency`, `Campaign Structure`, `Business Benefit`
  * In Process: `01 Research`, `02 Strategy`, `03 Visual Direction`, `04 Design System`, `05 Delivery`

### Image ALT Text Optimization (Key Assets)
| Image / Component | Current Alt | Production Recommended Alt |
| :--- | :--- | :--- |
| **Tic Tac India Card** | `Tic Tac India Post` | `Tic Tac India official verified Instagram endorsement post featuring Muhammed Sidhan design` |
| **7UP India Card** | `7UP India Post` | `7UP India official verified social media recognition post featuring creative design by Muhammed Sidhan` |
| **Profile Photo** | `Zidhan` | `Muhammed Sidhan brand designer and visual storyteller portrait` |
| **Kibblix Cover** | `Kibblix Branding` | `Kibblix pet nutrition premium brand identity packaging and logo design case study` |
| **FRAGRO 16:9** | `Fragro Branding` | `FRAGRO Perfume Lab luxury fragrance branding and visual identity design` |
| **Global Solution** | `Global Solution Catering` | `Global Solution Catering Qatar corporate brand identity and visual positioning` |
| **Zidhaf Kitchen** | `Zidhaf Kitchen` | `Zidhaf Kitchen Indonesia culinary brand identity and packaging visual system` |
| **FRAGRO Grid Tiles** | `Fragro 1` to `Fragro 9` | `FRAGRO Perfume Lab Instagram 9-grid campaign tile [1-9] visual storytelling layout` |

### Internal Linking Architecture
* **To Campaign Page:** Primary educational link in `#recent` (`What is a 9-Grid Instagram Campaign? -> campaign.html`) and in navbar (`Campaign -> campaign.html`).
* **From Hero to Portfolio:** `#work` anchor with descriptive text "View Selected Work".
* **From Hero to Contact:** `#contact` anchor with high-contrast button "Start a Project".
* **From Case Study to Live Behance:** External verified link to Behance portfolio with `rel="noopener noreferrer"`.

### Call-to-Action (CTA) Strategy
* **Hero CTA 1:** `VIEW SELECTED WORK` (Directs to `#work`)
* **Hero CTA 2:** `START A PROJECT` (Directs to `#contact`)
* **Campaign Hook CTA:** `Know More About 9-Grid Strategy` (Directs to `campaign.html`)
* **Portfolio Footer CTA:** `View Full Portfolio on Behance` (External link to Behance)
* **Closing Section CTA:** `Send Message` (Triggers secure API contact form submission)

---

## 2. Page: Campaign Landing Page (`campaign.html`)

### General SEO Meta
* **URL:** `https://zidhanzid.com/campaign.html` (Canonical: `https://zidhanzid.com/campaign.html`)
* **SEO Title:** `Instagram 9-Grid Strategy & Campaign Design | Muhammed Sidhan`
* **Meta Description:** `Transform your Instagram profile into a high-converting digital brochure. Discover the 9-grid Instagram strategy, case studies, and visual storytelling framework.`
* **Primary Keyword:** `instagram 9 grid designer`
* **Secondary Keywords:** `9-grid instagram campaign strategy`, `instagram profile makeover`, `social media visual storytelling`, `fragro perfume lab instagram design`, `bake land bakery instagram grid`
* **Robots Meta:** `<meta name="robots" content="index, follow, max-image-preview:large">`

### Heading Architecture
* **H1:**
  ```html
  <h1 class="section-title-gold">9-Grid Instagram Campaign Strategy</h1>
  ```
  *Subheading context:* `A deep dive into how we turn Instagram grids into powerful brand storytelling tools and digital brochures.`
* **Suggested H2s:**
  1. `FRAGRO Perfume Lab: Luxury Fragrance 9-Grid Campaign`
  2. `Bake Land Bakery: Visual Identity & Cohesive Social Grid`
  3. `The 5 Strategic Pillars of an Instagram 9-Grid`
  4. `Our 5-Step Strategic Design Process`
  5. `Measurable Business ROI & Project Outcomes`
  6. `Ready to Transform Your Instagram Presence?`
* **Suggested H3s:**
  * `Strategic First Impression`
  * `Visual Brand Storytelling`
  * `Brand Consistency & Visual Guidelines`
  * `Campaign Architecture & Grid Flow`
  * `Business Benefit & Conversion Lift`

### Image ALT Text Optimization
* **FRAGRO Tiles (1-9):** `FRAGRO Perfume Lab 9-grid luxury fragrance tile [1-9] showcasing brand story, perfume notes, and custom packaging`
* **Bake Land Tiles (1-9):** `Bake Land Bakery 9-grid visual identity tile [1-9] showcasing artisan bread, cafe branding, and social layout`

### Internal Linking & CTAs
* **Back to Main Site:** Logo link to `index.html#home`, navigation links back to `index.html#work` and `index.html#services`.
* **Primary Conversion CTA:** `Start Your Campaign` linking directly to `index.html#contact`.
