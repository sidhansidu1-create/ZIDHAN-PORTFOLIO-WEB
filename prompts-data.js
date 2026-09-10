/**
 * ==============================================================================
 * AI PROMPT LIBRARY - DATASET (ZIDHAN DESIGN STUDIO)
 * ==============================================================================
 * "Practical AI prompts for better design."
 * 
 * Scalable Content Architecture:
 * To add a new prompt in the future (e.g. Prompt #31, #32, etc.):
 * Simply copy an existing object below, update the number, category, title,
 * description, useCase, prompt, designTip, proMove, tags, and set isFeatured: false.
 * The UI automatically updates card counts, filtering, search, and modal rendering.
 * ==============================================================================
 */

window.PROMPTS_DATA = [
  // ==========================================
  // 1. PRODUCT & ADVERTISING
  // ==========================================
  {
    number: 1,
    category: "PRODUCT & ADVERTISING",
    title: "Premium Product Advertisement",
    description: "Turn a basic product image into a professionally art-directed commercial visual.",
    useCase: "Hero e-commerce banners, billboards, luxury packaging showcases, and print ad hero visuals.",
    prompt: "Commercial studio product photography of a luxury minimalist perfume bottle made of matte frosted obsidian glass with subtle brushed brass accents, resting atop an asymmetrical raw basalt stone pedestal. High-end editorial lighting: soft directional key light from top-left, gentle 30% rim light defining the silhouette, subtle caustic reflections on dark textured matte slate background. Monochromatic dark slate and warm metallic color palette, zero clutter, generous negative space in top 40% for typography, 85mm lens, f/8 aperture, razor-sharp focus, cinematic depth of field, Hasselblad H6D-100c medium format look --ar 16:9 --style raw --v 6.1",
    designTip: "Always retain 40-50% intentional negative space in your prompt. This gives you clean breathing room for typographic headlines, body copy, and logo lockups without having to manually clone-stamp the background.",
    proMove: "Take the generated output into Photoshop, generate a depth map, separate the background layer, and drop your actual vector SVG client logomark onto the bottle with 'Overlay' or 'Multiply' blend mode matching the surface curve.",
    tags: ["PRODUCT", "ADVERTISEMENT", "ART DIRECTION", "LIGHTING"],
    isFeatured: true
  },
  {
    number: 2,
    category: "PRODUCT & ADVERTISING",
    title: "Minimalist Cosmetic & Skincare Showcase",
    description: "Create soft, radiant organic skincare scenes with natural botanical textures and sunlit water reflections.",
    useCase: "Clean beauty brands, organic cosmetic lines, skincare carousel ads, and brand lifestyle campaigns.",
    prompt: "High-end commercial still life photography of an amber dropper bottle and ceramic cosmetic jar arranged harmoniously on a light travertine stone slab. Warm golden afternoon sunlight streaming through frosted glass casting organic dappled palm frond shadows. Delicate water droplets clinging to the glass surface, subtle water ripples reflecting soft cyan and cream tones. Minimalist Scandinavian spa aesthetic, ultra-clean neutral palette (#F5F2EB, warm clay, soft sage), generous copy space on the right, shot on Canon EOS R5 with 90mm macro tilt-shift lens, pristine texture detail --ar 4:5 --style raw --v 6.1",
    designTip: "Warm neutrals and soft shadow projections evoke cleanliness and organic purity. Keep color saturation under 25% so the actual product remains the dominant visual focal point.",
    proMove: "Use tilt-shift framing to naturally blur the background while keeping the product label in tack-sharp focus, creating instant optical hierarchy.",
    tags: ["PRODUCT", "COSMETICS", "MINIMALISM", "MACRO"],
    isFeatured: false
  },
  {
    number: 3,
    category: "PRODUCT & ADVERTISING",
    title: "High-Energy Sports Beverage Campaign",
    description: "Dynamic, hyper-energetic advertising visual featuring liquid splash dynamics and high-speed motion capture.",
    useCase: "Energy drink campaigns, activewear ads, social media launch visuals, and athletic commercial decks.",
    prompt: "Dynamic commercial billboard advertisement of a sleek condensation-covered matte metallic sports beverage can frozen mid-air at a dramatic 15-degree diagonal angle. Explosive, sculpted water and citrus splash droplets suspended in time around the can, backlit with electric cyan and magenta rim lighting. Ultra-dark carbon fiber and dark smoke studio background with high-contrast strobe lighting. Fast 1/8000s shutter speed capture, crystal-clear liquid transparency, hyper-sharp refraction droplets, vibrant action sports aesthetic, copy space reserved along upper-left third --ar 16:9 --style raw --v 6.1",
    designTip: "Diagonal angles convey action, power, and kinetic velocity. Pair with bold, italicized sans-serif typography tilted at the exact same angle for seamless visual unity.",
    proMove: "Render liquid splashes with high contrast against a dark background so you can easily isolate the splash elements via screen blend modes or channel masks in Photoshop.",
    tags: ["PRODUCT", "BEVERAGE", "LIQUID SPLASH", "HIGH ENERGY"],
    isFeatured: false
  },

  // ==========================================
  // 2. BRANDING & IDENTITY
  // ==========================================
  {
    number: 4,
    category: "BRANDING & IDENTITY",
    title: "Contemporary Brand Identity System Mockup",
    description: "Photorealistic presentation of a comprehensive visual identity system arranged in an editorial flat lay.",
    useCase: "Portfolio case studies, client pitch decks, design studio showcase reels, and brand guideline deliverables.",
    prompt: "Editorial overhead flat lay presentation of a premium corporate brand identity suite neatly arranged on a textured architectural warm gray micro-cement surface. Includes: heavy cotton business cards with blind debossing, foil-stamped corporate letterhead, a minimal kraft envelope with custom wax seal, and a sleek hardcover brand book with exposed thread binding. Crisp 45-degree natural architectural daylight casting soft geometric shadows. Strict 12-column modernist grid arrangement, monochromatic off-black and warm white palette with a single electric cobalt blue accent, shot with Leica SL2, 50mm lens, f/11 --ar 16:9 --style raw --v 6.1",
    designTip: "The secret to believable mockups is paper texture and blind deboss depth. Specifying paper weight (like heavy 600gsm cotton) forces AI to simulate realistic edge bevels and tactile micro-shadows.",
    proMove: "Use this generation as a base lighting reference, then use Photoshop's Vanishing Point or Smart Object warp tools to replace the placeholder artwork with your client's authentic identity assets.",
    tags: ["BRANDING", "IDENTITY", "STATIONERY", "MOCKUP"],
    isFeatured: false
  },
  {
    number: 5,
    category: "BRANDING & IDENTITY",
    title: "Luxury Monogram & Minimalist Wordmark",
    description: "Generate high-concept luxury symbol exploration and embossed architectural brand marks.",
    useCase: "High-end fashion labels, boutique hospitality, architecture firms, and luxury real estate branding.",
    prompt: "Architectural close-up shot of a sophisticated geometric monogram logo carved deeply into a massive honed Nero Marquina black marble wall with delicate white veins. Precise chiseled V-carve serif typography, raking directional light glancing across the carved stone surface creating high-contrast highlights and deep shadow crevasses. Luxury minimalist aesthetics, quiet luxury editorial tone, macro architectural photography, 85mm lens, f/5.6, premium craftsmanship --ar 1:1 --style raw --v 6.1",
    designTip: "When pitching luxury brands, showing the mark carved or embossed in raw premium materials (marble, brass, linen) sells the identity far more effectively than flat 2D screen mockups.",
    proMove: "Use the carved highlights to extract an opacity displacement map in After Effects to create an elegant metallic reveal animation for brand video bumpers.",
    tags: ["BRANDING", "MONOGRAM", "LUXURY", "EMBOSSED"],
    isFeatured: false
  },
  {
    number: 6,
    category: "BRANDING & IDENTITY",
    title: "Bold Heritage Brand Revamp Direction",
    description: "Reimagine vintage heritage typography into a modern, assertive brand presence.",
    useCase: "Craft breweries, heritage apparel, barbershops, artisan leather goods, and premium legacy revamps.",
    prompt: "Industrial design heritage brand exploration featuring a heavy-gauge stamped raw copper badge with bold condensed grotesque typography and vintage filigree details, mounted on distressed dark oiled walnut timber. Warm workshop ambient lighting with focused warm tungsten spotlight highlighting metal bevels and patina texture. Rich artisanal tactile feel, authenticity, craft heritage, filmic grain, 35mm photograph, Kodak Tri-X 400 tonal characteristics --ar 4:3 --style raw --v 6.1",
    designTip: "Heritage revamps require balancing timeless weight with modern legibility. Pair dense, character-rich display marks with clean, highly spaced modern sans-serif sub-elements.",
    proMove: "Trace the generated copper badge silhouette in Illustrator with the Pen tool to extract bespoke vector letterforms and proprietary flourishes you can use across packaging.",
    tags: ["BRANDING", "HERITAGE", "BADGE", "VINTAGE MODERN"],
    isFeatured: false
  },

  // ==========================================
  // 3. SOCIAL MEDIA
  // ==========================================
  {
    number: 7,
    category: "SOCIAL MEDIA",
    title: "Cohesive 9-Grid Instagram Visual Story",
    description: "Design an interconnected 9-post Instagram puzzle profile with continuous visual harmony and grid alignment.",
    useCase: "Instagram profile launches, 9-grid profile transformations, campaign kickoffs, and agency digital brochures.",
    prompt: "Artistic overhead composition designed for a continuous 9-grid social media profile aesthetic. Seamless panoramic canvas blending modernist brutalist architecture, warm organic linen textures, abstract typography sculptures, and minimalist product placements. Continuous horizon line running across the horizontal axis, harmonious color story of deep obsidian black, warm beige, and electric neon lime accents. Clean editorial balance with clearly defined 3x3 quadrant focal points, zero awkward crops on post dividing lines, shot with ultra-wide medium format sensor --ar 1:1 --style raw --v 6.1",
    designTip: "In a 9-grid system, ensure every individual 1x1 quadrant functions as a standalone compelling post while seamlessly connecting to its adjacent neighbors.",
    proMove: "Slice the output directly in Photoshop using 3x3 slice guides (1080x1080 per cell) and verify thumbnail readability before sequencing the reverse upload order.",
    tags: ["SOCIAL MEDIA", "9-GRID", "INSTAGRAM", "GRID SYSTEM"],
    isFeatured: false
  },
  {
    number: 8,
    category: "SOCIAL MEDIA",
    title: "Editorial Carousel Slide Series",
    description: "Create visually engaging, content-driven slide backdrops that maximize dwell time and swipe engagement.",
    useCase: "Educational carousels, design case study walkthroughs, LinkedIn slide decks, and thought leadership decks.",
    prompt: "Editorial multi-slide background layout with sleek dark-mode aesthetics. Asymmetric Swiss grid layout, translucent frosted glass cards with subtle 1px border glows, refined geometric Swiss typography markers (01, 02, 03), subtle ambient grain, and faint gradient mesh glowing softly in dark teal and royal violet (#0D1117 background). Clean hierarchy, abundant open space for multi-paragraph explanatory text, Figma UI design aesthetic, modern web-app feel --ar 4:5 --style raw --v 6.1",
    designTip: "Social carousels require extreme typography legibility. Use low-contrast background gradients (under 15% opacity shifts) so white body text remains crisp and effortless to scan.",
    proMove: "Keep the visual connector (a line, arrow, or glowing particle) bleeding off the right edge of slide N so it visually enters slide N+1, psychologically compelling viewers to swipe.",
    tags: ["SOCIAL MEDIA", "CAROUSEL", "EDITORIAL", "SLIDES"],
    isFeatured: false
  },
  {
    number: 9,
    category: "SOCIAL MEDIA",
    title: "Viral Brand Quote & Statement Graphic",
    description: "Striking typographic focal graphic designed for maximum bookmarking, shares, and visual impact.",
    useCase: "Brand manifestos, founder quote graphics, inspirational social posts, and agency philosophy drops.",
    prompt: "Bold editorial typographic statement visual set in deep pitch-black void. Gigantic oversized serif letterforms with exquisite high-contrast hairline serifs, illuminated by a single narrow theatrical slit of warm light cutting horizontally across the letter stems. Subtly floating geometric dust particles caught in the beam of light, heavy cinematic film grain, austere Swiss minimalist composition, off-center placement, supreme confidence, timeless elegance --ar 4:5 --style raw --v 6.1",
    designTip: "Quote graphics fail when they look like generic Canva templates. Focus on extreme scale contrast—one massive word paired with tiny, tracked-out metadata notes.",
    proMove: "Overlay real high-res scan dust and scanline textures in Photoshop on 'Screen' mode to make digital vector typography feel like rare printed ephemera.",
    tags: ["SOCIAL MEDIA", "TYPOGRAPHY", "QUOTE", "HIGH CONTRAST"],
    isFeatured: false
  },

  // ==========================================
  // 4. POSTERS & CAMPAIGNS
  // ==========================================
  {
    number: 10,
    category: "POSTERS & CAMPAIGNS",
    title: "Swiss International Typographic Poster",
    description: "Generate pure International Typographic Style poster compositions with rigorous grid structures.",
    useCase: "Exhibition posters, architectural events, design conferences, and minimalist interior prints.",
    prompt: "Authentic Swiss International Style typographic poster design inspired by Josef Müller-Brockmann and Armin Hofmann. Rigid asymmetric grid system, bold black and vermilion red (#FF3B30) geometric shapes interacting with stark white space. Massive bold grotesque sans-serif headline, precise micro-typography column blocks with mathematical baseline alignment. High-contrast silkscreen print texture, subtle paper ink bleed, matte unbleached cotton paper stock, scanned print ephemera aesthetic, 1968 Zurich design school --ar 3:4 --style raw --v 6.1",
    designTip: "The Swiss style relies on the tension between massive focal elements and disciplined mathematical margin grids. Never center-align; embrace strict left-alignment and rag consistency.",
    proMove: "Recreate the layout in InDesign or Illustrator using a strict 12-column modular grid with 4pt baseline grid for body text, using the AI piece solely as a conceptual art direction guide.",
    tags: ["POSTERS", "SWISS DESIGN", "GRID SYSTEM", "EDITORIAL"],
    isFeatured: false
  },
  {
    number: 11,
    category: "POSTERS & CAMPAIGNS",
    title: "Cinematic Film Festival Art Direction",
    description: "Atmospheric, psychological narrative posters featuring cinematic lighting and evocative mood.",
    useCase: "Independent films, theater key art, film festival campaigns, and documentary key visual directions.",
    prompt: "Award-winning independent film festival key art poster. Moody atmospheric scene of a solitary silhouette standing at the edge of a fog-shrouded concrete brutalist bridge at twilight. Dramatic cinematic lighting: cool cyan atmospheric mist cut by a single saturated amber streetlight creating long expressive shadows. Filmic 35mm grain, anamorphic lens flare, deep emotional depth, poetic narrative mood, Wong Kar-wai color grading, wide empty sky area for festival title billing credits and laurels --ar 2:3 --style raw --v 6.1",
    designTip: "Movie posters require clear 'billing blocks' at the bottom. Ensure the bottom 25% has solid deep shadows or clean gradient fade to accommodate director credits, dates, and sponsor lockups.",
    proMove: "Use universal vector billing block templates with standard condensed serif/sans fonts (like Steel Fish or Univers 39 Thin Ultra Condensed) over the darkened lower base.",
    tags: ["POSTERS", "CINEMATIC", "FILM", "ART DIRECTION"],
    isFeatured: false
  },
  {
    number: 12,
    category: "POSTERS & CAMPAIGNS",
    title: "Brutalist Urban Culture Exhibition Poster",
    description: "Edgy, tactile underground music and streetwear culture poster with gritty distressed textures.",
    useCase: "Streetwear drops, techno events, underground music festivals, and youth culture apparel graphics.",
    prompt: "Brutalist neo-grunge cultural event poster. Distressed photocopied aesthetic with heavy halftone dot patterns, visible scan lines, ripped paper edges, and industrial barcode graphics. Raw high-contrast black and monochrome with harsh acidic neon green spray paint accents (#39FF14). Experimental typography treatments, inverted type blocks, anti-design brutalist layout, wheatpaste poster texture slapped on a wet urban concrete wall, gritty flash photography --ar 3:4 --style raw --v 6.1",
    designTip: "Brutalism doesn't mean careless mess. Great brutalist design still preserves information hierarchy—the date, venue, and lineup must be decipherable even amidst distressed textures.",
    proMove: "Print the generated poster on a cheap home laser printer, crumple it up, scan it back at 1200 DPI, and adjust levels to create 100% genuine physical distortion textures.",
    tags: ["POSTERS", "BRUTALISM", "STREETWEAR", "HALFTONE"],
    isFeatured: false
  },

  // ==========================================
  // 5. TYPOGRAPHY & EDITORIAL
  // ==========================================
  {
    number: 13,
    category: "TYPOGRAPHY & EDITORIAL",
    title: "Avant-Garde Kinetic Editorial Layout",
    description: "Dynamic distorted letterforms that express rhythm, sound, and multidimensional motion on the page.",
    useCase: "Music album art, fashion lookbooks, experimental typography showcases, and creative agency identities.",
    prompt: "Experimental avant-garde kinetic typography artwork. Massive custom display letterforms warped, stretched, and blurred in continuous fluid wave motions across the frame like soundwaves. High-contrast monochromatic black ink on warm bone-white background with subtle chromatic aberration at the motion edges. Crisp vector precision dissolving into kinetic motion blur, balance of extreme tension and fluid grace, inspired by contemporary Dutch typography studios, high-resolution graphic print --ar 16:9 --style raw --v 6.1",
    designTip: "Kinetic typography works best when one anchor character remains legible while surrounding glyphs stretch into rhythm, anchoring the viewer's eye before leading it through the motion.",
    proMove: "Convert text to outlines in Illustrator, apply the 'Twirl' or 'Puppet Warp' tool, and use Photoshop's Radial/Motion Blur filters with fine mask controls to achieve vector-sharp edges with raster motion.",
    tags: ["TYPOGRAPHY", "KINETIC", "EXPERIMENTAL", "EDITORIAL"],
    isFeatured: false
  },
  {
    number: 14,
    category: "TYPOGRAPHY & EDITORIAL",
    title: "Editorial Magazine Double-Page Spread",
    description: "Sophisticated editorial magazine layout combining expressive photography with classical typography.",
    useCase: "Print publications, digital fashion lookbooks, brand magazines, and architecture monographs.",
    prompt: "High-end luxury fashion magazine double-page spread open on an oak editorial desk. Left page features an artistic black-and-white architectural portrait of a high-fashion model with dramatic shadows. Right page features an immaculate 4-column Swiss editorial layout with elegant Didone serif drop caps, delicate subheads, hairline divider rules, and generous white margins. Premium matte paper stock with natural center gutter shadow and soft curling page edges, warm ambient studio lighting, top-down 45-degree angle --ar 16:9 --style raw --v 6.1",
    designTip: "Notice the center gutter in a spread: always keep essential text and facial features at least 15mm away from the inner crease to avoid binding loss in print.",
    proMove: "Use this mockup to pitch high-value print collateral to fashion or real estate clients. It bridges the gap between pure layout and physical tangible luxury.",
    tags: ["TYPOGRAPHY", "EDITORIAL", "MAGAZINE", "LAYOUT"],
    isFeatured: false
  },
  {
    number: 15,
    category: "TYPOGRAPHY & EDITORIAL",
    title: "Custom Display Typeface in Commercial Context",
    description: "Showcase custom type design in a real-world high-impact architectural environment.",
    useCase: "Type foundry specimen cards, retail signage mockups, architectural wayfinding, and font marketing.",
    prompt: "Architectural close-up of a massive custom geometric display wordmark rendered in precision-cut solid brushed aluminum lettering, pin-mounted 2 inches off a raw cast concrete museum facade. Crisp morning sunlight casting sharp geometric cast shadows on the raw porous concrete texture. Extreme architectural photography angle looking up at 45 degrees, ultra-clean industrial design, monumental scale, razor-sharp edge bevels, 50mm lens, f/8, architectural digest aesthetic --ar 16:9 --style raw --v 6.1",
    designTip: "Dimensional letterforms live or die by their drop shadows. Cast shadows reveal the depth, material thickness, and spatial relationship to the mounting substrate.",
    proMove: "In Illustrator, apply a 3D Extrude & Bevel effect with realistic ambient light angles to match this photo, then apply a subtle noise grain to prevent the 3D render from looking plastic.",
    tags: ["TYPOGRAPHY", "DISPLAY TYPE", "ARCHITECTURAL", "SIGNAGE"],
    isFeatured: false
  },

  // ==========================================
  // 6. PACKAGING & MOCKUPS
  // ==========================================
  {
    number: 16,
    category: "PACKAGING & MOCKUPS",
    title: "Artisanal Specialty Coffee Packaging",
    description: "Tactile, craft specialty coffee bag with matte earthy textures and blind debossed foil accents.",
    useCase: "Specialty coffee roasters, craft food brands, organic FMCG packaging, and artisanal retail lines.",
    prompt: "Commercial studio product shot of a premium stand-up kraft coffee pouch with a flat bottom and tear notch. High-tactile unbleached textured paper texture with a minimalist label featuring blind letterpress debossing and subtle metallic copper foil stamping. Placed beside a small ceramic bowl of roasted whole coffee beans on a dark stone counter. Soft, warm diffused natural side light highlighting paper fibers and foil reflections, neutral earthy color palette (warm charcoal, raw kraft, rich bronze), shallow depth of field, 90mm macro lens --ar 4:5 --style raw --v 6.1",
    designTip: "Kraft and matte substrates require clean, high-contrast label artwork. Avoid complex gradients on kraft paper; stick to single-color vector linework and foil accents.",
    proMove: "When preparing client files for hot-foil stamping, create a dedicated 100% Spot Color separation plate in Illustrator named 'Foil_Stamp_Die' so printers can directly fabricate the metal die.",
    tags: ["PACKAGING", "COFFEE", "CRAFT", "FOIL STAMP"],
    isFeatured: false
  },
  {
    number: 17,
    category: "PACKAGING & MOCKUPS",
    title: "Sustainable Luxury Box & Embossed Unboxing",
    description: "Premium unboxing experience visual with structural rigid box, custom foam insert, and blind embossing.",
    useCase: "Luxury watch packaging, bespoke jewelry boxes, VIP influencer unboxing kits, and premium tech products.",
    prompt: "High-end commercial packaging photography of an open two-piece rigid shoulder box made of FSC-certified textured forest green paper stock. The lid rests slightly ajar, revealing custom-contoured molded pulp interior with velvet flocking holding a luxury product. The lid exterior features an exquisite deeply embossed blind relief pattern and satin gold micro-embossed crest. Studio tabletop lighting with softbox overhead diffuser, immaculate soft reflections, clean minimalist composition, luxury retail unboxing experience --ar 16:9 --style raw --v 6.1",
    designTip: "The shoulder-box reveal (where the neck tray peeks out between base and lid) creates a subtle secondary color line that elevates the perceived product value.",
    proMove: "Design the interior unboxing sequence as a storyboard: Lid off -> Welcome card -> Tissue seal -> Product reveal. Showing this full sequence wins packaging pitches every time.",
    tags: ["PACKAGING", "LUXURY", "UNBOXING", "EMBOSSED"],
    isFeatured: false
  },
  {
    number: 18,
    category: "PACKAGING & MOCKUPS",
    title: "Matte Aluminum Can & Custom Label Mockup",
    description: "Sleek contemporary aluminum beverage can mockup with tactile varnish and metallic label finishes.",
    useCase: "Craft sodas, craft beer labels, hard seltzers, ready-to-drink cocktails, and functional beverages.",
    prompt: "Commercial product photography of two sleek 330ml slim aluminum cans side by side. One can has a matte textured off-black finish with spot gloss UV varnish detailing that catches the light; the second can features brushed silver raw aluminum with clean graphic vector illustrations. Subtle chilled moisture droplets on the metal, resting on a polished dark acrylic reflective surface with faint blurred neon ambient reflections in the background. Editorial beverage commercial styling, 85mm lens, f/5.6 --ar 4:5 --style raw --v 6.1",
    designTip: "Spot UV varnish is an invisible superpower. When prompt-engineering beverage cans, explicitly calling for 'spot gloss UV over matte finish' creates realistic micro-highlights.",
    proMove: "Create your label artwork in Illustrator at flat dieline dimensions (usually 208mm x 150mm for 330ml slim cans), then map it onto a 3D cylinder in Adobe Dimension or Blender.",
    tags: ["PACKAGING", "BEVERAGE", "CAN MOCKUP", "SPOT UV"],
    isFeatured: false
  },

  // ==========================================
  // 7. PHOTOGRAPHY & ART DIRECTION
  // ==========================================
  {
    number: 19,
    category: "PHOTOGRAPHY & ART DIRECTION",
    title: "Dramatic Editorial Studio Portrait for Fashion",
    description: "Chiaroscuro studio fashion portrait with sculptural lighting, rich skin tones, and intense emotional presence.",
    useCase: "High-fashion editorials, model portfolio campaigns, apparel hero banners, and magazine covers.",
    prompt: "Editorial high-fashion studio portrait of an elegant and poised model with sculptured bone structure, gazing directly into camera with quiet intensity. Dramatic Rembrandt lighting setup with a single large beauty dish at 45 degrees, deep velvety chiaroscuro shadows carving cheekbones, subtle soft silver reflector bounce filling subtle shadow detail. Styled in a sharply tailored sculptural black wool coat with exaggerated lapels. Neutral charcoal studio backdrop, Hasselblad 100MP detail, natural skin pores, Vogue Italia aesthetic --ar 3:4 --style raw --v 6.1",
    designTip: "High-fashion editorial images thrive on eye contact and negative space around the model's head. This creates instant focal pull while leaving room for magazine mastheads.",
    proMove: "In Lightroom or Capture One, pull down the midtone saturation slightly (-8) while boosting texture and clarity on the clothing fabrics to accentuate high-end tailoring.",
    tags: ["PHOTOGRAPHY", "PORTRAIT", "FASHION", "CHIAROSCURO"],
    isFeatured: false
  },
  {
    number: 20,
    category: "PHOTOGRAPHY & ART DIRECTION",
    title: "Architectural Golden-Hour Shadow Play",
    description: "Clean geometric architectural compositions where light and shadow become abstract design elements.",
    useCase: "Architecture monographs, interior design websites, real estate branding, and abstract background textures.",
    prompt: "Minimalist architectural photography of a contemporary brutalist concrete pavilion during warm late-afternoon golden hour. Razor-sharp geometric shadows cast across smooth poured concrete walls and clean glass panes. Composition of intersecting diagonal lines, pristine right angles, and pure geometric abstraction. Warm amber sunlight contrasting against cool blue sky reflections in the floor-to-ceiling glass. Zero human presence, architectural purity, captured on Linhof master technika 4x5, f/16, Kodak Ektar 100 --ar 16:9 --style raw --v 6.1",
    designTip: "Architectural photography provides the best hero backgrounds for tech and design websites because the clean horizontals and verticals provide natural reading baselines.",
    proMove: "Overlay a 30% black-to-transparent gradient on the left side of this image to place your website hero typography with AAA accessibility contrast without dimming the architectural focal point.",
    tags: ["PHOTOGRAPHY", "ARCHITECTURE", "MINIMALISM", "GEOMETRIC"],
    isFeatured: false
  },
  {
    number: 21,
    category: "PHOTOGRAPHY & ART DIRECTION",
    title: "Hyper-Real Macro Texture & Material Study",
    description: "Sensory macro photography of organic and industrial materials for tactile brand backgrounds.",
    useCase: "Brand tactile palettes, packaging inner liners, website section backdrops, and sensory brand assets.",
    prompt: "Extreme macro photography of swirling viscous iridescent oil on obsidian glass surface, interacting with fine particles of crushed gold leaf and deep indigo pigments. Hypnotic organic flow patterns, micro-bubbles refracting prism light rays, metallic liquid gloss texture. Dramatic directional macro strobe lighting with soft diffusion, hyper-detailed surface tension and fluid dynamics, 100mm macro lens, f/11, razor-sharp focus across the focal plane --ar 16:9 --style raw --v 6.1",
    designTip: "Abstract macro textures can replace generic stock gradients. They give digital brand identities an organic, bespoke physical presence.",
    proMove: "Desaturate this texture into a black-and-white bump map, and use it as a displacement filter in Photoshop to add genuine surface texture to vector icons and logos.",
    tags: ["PHOTOGRAPHY", "MACRO", "TEXTURE", "ABSTRACT"],
    isFeatured: false
  },

  // ==========================================
  // 8. CREATIVE CONCEPTS
  // ==========================================
  {
    number: 22,
    category: "CREATIVE CONCEPTS",
    title: "Creative Campaign Concept",
    description: "Formulate arresting, multi-layered visual metaphors that communicate complex brand messages at a glance.",
    useCase: "Global advertising campaigns, brand repositioning pitches, sustainability initiatives, and Cannes Lions concept boards.",
    prompt: "Surrealist concept art for a global conservation awareness advertising campaign. A gigantic, delicate origami bird folded out of translucent discarded plastic sheets, soaring gracefully over a pristine calm ocean at sunrise. The soft morning golden light passes through the semi-translucent plastic facets, illuminating internal textures with poignant beauty. Cinematic scale, poetic juxtaposition of man-made synthetic waste and natural wonder, photorealistic execution, National Geographic quality, generous negative space in upper third --ar 16:9 --style raw --v 6.1",
    designTip: "Great campaign concepts rely on contrast—contrasting materials, scales, or emotional tones. If the message is serious, an elegant execution is far more persuasive than shocking ugliness.",
    proMove: "Pair this visual with a short, punchy 3-word headline placed in a high-contrast corner (e.g., 'BORN OF WASTE. / SOARING INTO ZERO.'). Let the image carry 80% of the cognitive weight.",
    tags: ["CREATIVE CONCEPTS", "CAMPAIGN", "METAPHOR", "SURREALISM"],
    isFeatured: true
  },
  {
    number: 23,
    category: "CREATIVE CONCEPTS",
    title: "Surrealist Metaphorical Brand Visual",
    description: "Juxtapose unexpected objects to create a thought-provoking visual metaphor for modern technology.",
    useCase: "Fintech brand manifestos, AI product launches, cloud computing visuals, and keynote presentation slides.",
    prompt: "Conceptual surrealist advertising visual: a classical Greco-Roman marble bust with an intricate, glowing fiber-optic network illuminating from within the hollow cranial cracks like molten cyan glass. The sculpture rests inside a sterile, minimalist concrete gallery room. The contrast between ancient timeless stone and hyper-advanced ethereal technology. High-end fine art gallery lighting, quiet contemplative mood, medium format digital photograph, crisp architectural symmetry --ar 4:5 --style raw --v 6.1",
    designTip: "When visualizing abstract tech concepts (like AI, cloud, security), avoid clichés like glowing brains or digital handshakes. Ground tech in classical materials (marble, glass, brass) for gravitas.",
    proMove: "Use this hero image for the cover of a whitepaper or annual report. It elevates the brand from a typical tech company to a cultural institution.",
    tags: ["CREATIVE CONCEPTS", "SURREALISM", "TECH METAPHOR", "SCULPTURE"],
    isFeatured: false
  },
  {
    number: 24,
    category: "CREATIVE CONCEPTS",
    title: "Retro-Futuristic Cyber Heritage Narrative",
    description: "Blend historical craftsmanship aesthetics with futuristic neon-lit sci-fi atmospheres.",
    useCase: "Cyberpunk branding, gaming studio identities, electronic music packaging, and sci-fi worldbuilding.",
    prompt: "Cinematic retro-futuristic narrative scene of a traditional Japanese tea master preparing tea inside a neon-lit cybernetic pagoda overlooking a rain-slicked Tokyo 2089 skyline. Warm glow from traditional iron kettle steam mingling with vertical neon kanji holographic signs glowing in magenta and deep cyan outside the floor-to-ceiling panoramic window. Rich cinematic color harmony, Blade Runner 2049 meets Kyoto heritage, 35mm anamorphic widescreen look, atmospheric rain streaks on glass --ar 21:9 --style raw --v 6.1",
    designTip: "Color temperature separation creates immediate spatial depth: use warm interior lighting (2800K) against cool exterior neon backlighting (6500K).",
    proMove: "Crop this 21:9 visual into 3 sequential square 1:1 panels for a cinematic multi-post Instagram swipe effect.",
    tags: ["CREATIVE CONCEPTS", "RETRO-FUTURISM", "CINEMATIC", "STORYTELLING"],
    isFeatured: false
  },

  // ==========================================
  // 9. PORTFOLIO & PRESENTATION
  // ==========================================
  {
    number: 25,
    category: "PORTFOLIO & PRESENTATION",
    title: "Design Studio Case Study Hero Presentation",
    description: "Create an authoritative, award-winning hero presentation banner for your design portfolio.",
    useCase: "Behance case study covers, Awwwards portfolio entries, agency website project headers, and pitch decks.",
    prompt: "Ultra-premium design studio project showcase cover. Minimalist 3D isometric composition of three floating frosted glass cards displaying clean modern user interfaces and brand collateral, casting soft diffuse drop shadows onto a neutral warm-gray (#EAE8E3) podium. Subtle brushed champagne gold metal accents, exquisite micro-typography, crisp UI cards with soft rounded corners (16px radius), perfectly controlled soft studio ambient occlusion lighting, Dribbble Top Shot quality, sleek editorial tech aesthetic --ar 16:9 --style raw --v 6.1",
    designTip: "Case study hero banners need to summarize the entire project in 2 seconds. Showing brand marks, mobile screens, and print collateral together communicates full-stack execution.",
    proMove: "Export this generation, delete the placeholder UI screens in Photoshop, and replace them with your actual Figma artboard exports using smart object perspective warping.",
    tags: ["PORTFOLIO", "CASE STUDY", "BEHANCE", "PRESENTATION"],
    isFeatured: false
  },
  {
    number: 26,
    category: "PORTFOLIO & PRESENTATION",
    title: "Multi-Device Responsive Digital Showcase",
    description: "Display your web and app designs across photorealistic desktop, tablet, and mobile hardware.",
    useCase: "Web design portfolio entries, SaaS product launches, client handoff presentations, and UI/UX case studies.",
    prompt: "Clean studio mockup of a matte black 16-inch laptop alongside a borderless titanium smartphone, both resting on a sleek dark oak designer desk beside a ceramic cup and minimal plant. Both screens show a matching high-contrast dark-mode web application with vibrant gradient accents and clean data charts. Photorealistic reflections on glass screens, soft directional window light from the left, zero reflections obscuring the screen content, premium workplace aesthetic, 50mm f/4 --ar 16:9 --style raw --v 6.1",
    designTip: "Ensure the screens have zero glare over the primary content area so your actual designs remain 100% legible when composited.",
    proMove: "Create an exact 1:1 pixel mockup template using Photoshop's smart objects with embedded screen guides for 1920x1080 (desktop) and 1170x2532 (mobile).",
    tags: ["PORTFOLIO", "RESPONSIVE", "DEVICE MOCKUP", "UI/UX"],
    isFeatured: false
  },
  {
    number: 27,
    category: "PORTFOLIO & PRESENTATION",
    title: "Brand Book & Guidelines Spread Mockup",
    description: "A photorealistic open brand guideline manual showcasing color systems, typography, and logo rules.",
    useCase: "Final client brand guideline deliverables, agency portfolio reels, and brand identity case studies.",
    prompt: "Overhead editorial photography of a thick, open hardcover brand guidelines manual lying flat on an architect's slate gray worktable. The open spread reveals a comprehensive visual identity system: on the left page, a curated color palette with hexadecimal and Pantone color chips; on the right page, a rigorous typography scale and logo exclusion zones with red construction lines. Matte coated 170gsm paper stock, crisp binding, warm soft ambient lighting, clean professional graphic design practice --ar 16:9 --style raw --v 6.1",
    designTip: "Construction lines, grid overlays, and Pantone callout chips instantly validate your technical rigor to prospective clients, proving that your work is backed by strategic discipline.",
    proMove: "Export your final InDesign brand manual to high-res PDF, convert pages to JPEG, and composite them directly onto the page surfaces in this mockup for an ultra-authentic client deliverable.",
    tags: ["PORTFOLIO", "BRAND GUIDELINES", "PRINT MOCKUP", "SYSTEMS"],
    isFeatured: false
  },

  // ==========================================
  // 10. DESIGN THINKING
  // ==========================================
  {
    number: 28,
    category: "DESIGN THINKING",
    title: "Think Like a Designer",
    description: "Prime the AI to operate with the mindset, vocabulary, and strategic discipline of an elite creative director.",
    useCase: "Ideating new brand positioning, critiquing layouts, generating copywriting hierarchies, and writing creative briefs.",
    prompt: "Act as a world-class Executive Creative Director with 20+ years leading global brand identity studios (Pentagram, Wolff Olins, Collins). Analyze my challenge using rigorous design thinking principles: 1) Diagnose the core brand tension, 2) Define the brand archetype and emotional positioning, 3) Establish a 3-pillar visual strategy (Color psychology, Typography personality, Graphic device system), 4) Provide 3 distinct creative routes from safe to provocative, and 5) Critique common clichés in this niche that we must aggressively avoid. Respond in sharp, confident, editorial designer prose with zero corporate jargon.",
    designTip: "This is a text/meta-prompt for ChatGPT or Claude. Running this before you start generating imagery will give you the exact conceptual language, color names, and art directions to feed into your image prompts.",
    proMove: "Save the output into a 1-page Creative Brief PDF and review it with your client before touching Figma or Illustrator. Getting signed approval on the strategy prevents 90% of layout revision rounds.",
    tags: ["DESIGN THINKING", "CREATIVE DIRECTION", "STRATEGY", "AI MINDSET"],
    isFeatured: true
  },
  {
    number: 29,
    category: "DESIGN THINKING",
    title: "Strategic Problem Framing & Design Solution",
    description: "Transform fuzzy, ambiguous client requests into actionable, high-impact design challenges.",
    useCase: "Discovery workshops, client onboarding questionnaires, reframing redesign requests, and strategic positioning.",
    prompt: "Act as a strategic design partner. A client just asked: '[Insert Client Request, e.g., 'Make our tech brand feel friendlier and more modern']'. Reframe this request through the 'Double Diamond' design methodology: 1) Identify the real underlying business and user problem they are trying to solve, 2) Define the key metrics of success (perceived trust, conversion, retention), 3) Formulate 3 'How Might We' design questions that open up non-obvious visual solutions, 4) Recommend the visual hierarchy needed across their touchpoints to communicate this shift.",
    designTip: "Clients usually ask for visual symptoms ('make the logo bigger', 'use brighter colors'). A designer's job is to diagnose the underlying strategic problem before prescribing visual medicine.",
    proMove: "Use the generated 'How Might We' statements as headings during your initial client presentation to demonstrate that you are solving business problems, not just pushing pixels.",
    tags: ["DESIGN THINKING", "STRATEGY", "DISCOVERY", "PROBLEM SOLVING"],
    isFeatured: false
  },
  {
    number: 30,
    category: "DESIGN THINKING",
    title: "Brand Archetype & Emotional Tone Board",
    description: "Generate a multi-sensory moodboard description aligning visual aesthetics with psychological brand archetypes.",
    useCase: "Brand identity kickoffs, moodboard curation, client alignment workshops, and sensory branding.",
    prompt: "Construct a multi-sensory Art Direction & Moodboard Specification for a brand embodying the '[Insert Archetype, e.g., The Rebel / The Sage / The Ruler]' archetype in the '[Insert Industry, e.g., Sustainable Luxury Travel]' space. Define: 1) Core visual tension and mood keywords, 2) Architectural references and spatial materials, 3) Lighting philosophy and shadow contrast ratio, 4) Tactile paper, fabric, and finish selections, 5) Motion and kinetic behavior rules, and 6) Three precise Midjourney prompt recipes to generate on-brand visual assets.",
    designTip: "A moodboard is not just a collage of pretty pictures. It is a contractual agreement on emotional tone between you and the client before visual production begins.",
    proMove: "Take the 3 generated Midjourney prompt recipes, run them, and print the results on archival matte paper to physically present in your client kick-off workshop.",
    tags: ["DESIGN THINKING", "MOODBOARD", "ARCHETYPES", "ART DIRECTION"],
    isFeatured: false
  }
];
