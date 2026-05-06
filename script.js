lucide.createIcons();

const { animate, inView, stagger } = typeof Motion !== 'undefined' ? Motion : { animate: () => {}, inView: () => {}, stagger: () => {} };

console.log("Muhammed Sidhan Portfolio Script Initialized");

document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Hero Animations
    animate(".hero-subtitle", { opacity: [0, 1], y: [20, 0] }, { duration: 0.8 });
    animate(".hero-title", { opacity: [0, 1], y: [40, 0] }, { duration: 1, delay: 0.2 });
    animate(".hero-description", { opacity: [0, 1], y: [20, 0] }, { duration: 0.8, delay: 0.4 });
    animate(".hero-ctas", { opacity: [0, 1], y: [20, 0] }, { duration: 0.8, delay: 0.6 });

    // 3. In-View Scroll Animations
    inView(".fade-up", ({ target }) => {
        animate(target, { opacity: [0, 1], y: [40, 0] }, { 
            duration: 0.8, 
            delay: stagger(0.1),
            easing: [0.16, 1, 0.3, 1]
        });
    });

    inView(".skill-progress", ({ target }) => {
        const width = target.style.width;
        target.style.width = "0";
        animate(target, { width: [0, width] }, { duration: 1.5, easing: "ease-out" });
    });

    // 4. Project Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterCards = document.querySelectorAll('#main-work-grid .work-card');
    const allWorkCards = document.querySelectorAll('.work-card');

    function setFilter(filter) {
        filterBtns.forEach(btn => {
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        filterCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const isFeatured = card.getAttribute('data-featured') === 'true';
            
            if (filter === 'all') {
                card.classList.remove('hidden');
                animate(card, { opacity: [0, 1], scale: [0.98, 1] }, { duration: 0.3 });
            } else if (filter === 'featured') {
                if (isFeatured) {
                    card.classList.remove('hidden');
                    animate(card, { opacity: [0, 1], scale: [0.98, 1] }, { duration: 0.3 });
                } else {
                    card.classList.add('hidden');
                }
            } else {
                if (category === filter) {
                    card.classList.remove('hidden');
                    animate(card, { opacity: [0, 1], scale: [0.98, 1] }, { duration: 0.3 });
                } else {
                    card.classList.add('hidden');
                }
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setFilter(btn.getAttribute('data-filter'));
        });
    });

    // Default to FEATURED
    setFilter('featured');

    // 5. Case Study Modal Logic
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    const closeBtn = document.querySelector('.modal-close');
    
    const projects = {
        // BRANDING
        "buqyan-branding": {
            title: "BUQYAN STUDIOS",
            category: "BRAND IDENTITY",
            overview: "A premium brand identity design for Buqyan Studios, focusing on minimal aesthetics and cinematic storytelling.",
            challenge: "Translating the essence of a design studio into a cohesive visual system.",
            solution: "Developed a custom logotype and a refined color palette that resonates with a high-end audience.",
            outcome: "Strong brand presence and consistent visual communication across all platforms.",
            link: "https://www.behance.net/gallery/245536105/BUQYAN-STUDIOS-BRAND-IDENTITY"
        },
        "bakeland-branding": {
            title: "BAKE LAND BAKERY",
            category: "VISUAL IDENTITY 2026",
            overview: "A future-forward visual identity for Bake Land Bakery, blending traditional warmth with modern precision.",
            challenge: "Creating a timeless identity that stands out in a competitive market.",
            solution: "Used organic textures and elegant typography to evoke a sense of premium quality.",
            outcome: "Enhanced brand perception and a distinctive visual language.",
            link: "https://www.behance.net/gallery/245187723/BAKE-LAND-BAKERY-VISUAL-IDENTITY-2026"
        },
        // POSTERS (Using default Behance profile as requested link wasn't specific)
        "al-balad": { title: "Al Balad", category: "POSTER DESIGN", overview: "Visual storytelling through minimal poster design.", link: "https://www.instagram.com/p/DTdQO4zCc_J/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
        "7-up": { title: "7 UP", category: "POSTER DESIGN", overview: "Creative advertising poster for 7 UP.", link: "https://www.instagram.com/p/DRxN96XEqAQ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
        "uefa": { title: "UEFA CHAMPIONS LEAGUE", category: "POSTER DESIGN", overview: "Dynamic sports poster design.", link: "https://www.instagram.com/p/DRMr7OQCTa_/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
        "akale-poster": { title: "AKALE", category: "POSTER DESIGN", overview: "Film poster design for the short film Akale.", link: "https://www.instagram.com/p/DWWffM_jD6z/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
        "dreck": { title: "DRECK FILM POSTER", category: "POSTER DESIGN", overview: "Gritty and cinematic film poster design.", link: "https://www.instagram.com/p/DR-BQJakko9/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
        "raayan": { title: "RAAYAN", category: "POSTER DESIGN", overview: "Film poster design for Raayan.", link: "https://www.instagram.com/p/DRJZCuIiTDU/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
        "spiderman": { title: "SPIDERMAN", category: "POSTER DESIGN", overview: "Fan-made poster for Spiderman.", link: "https://www.instagram.com/p/DQwjEQDCde3/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
        "retro": { title: "RETRO", category: "POSTER DESIGN", overview: "Retro-style poster design.", link: "https://www.instagram.com/p/DRPvDbLkidG/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
        "maggi": { title: "MAGGI", category: "POSTER DESIGN", overview: "Advertising poster for Maggi.", link: "https://www.instagram.com/p/DQ7IFzIErug/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
        "crunch": { title: "CRUNCH", category: "POSTER DESIGN", overview: "High-impact visual design.", link: "https://www.behance.net/muhammedsidhan2" },
        "f4fish": { title: "F4FISH", category: "POSTER DESIGN", overview: "Fresh and clean poster design.", link: "https://www.behance.net/muhammedsidhan2" },
        "bakeland-grid": { title: "Bake Land Instagram Grid", category: "SOCIAL MEDIA DESIGN", overview: "Cohesive Instagram grid design for Bake Land.", link: "https://www.behance.net/muhammedsidhan2" },
        "malabar-mess": { title: "Malabar Mess", category: "POSTER DESIGN", overview: "Visual storytelling for Malabar Mess.", link: "https://www.behance.net/muhammedsidhan2" },
        "super-sunday": { title: "Super Sunday Poster", category: "POSTER DESIGN", overview: "Promotional poster for Super Sunday at Bake Land.", link: "https://www.behance.net/muhammedsidhan2" },
        // VIDEO
        "akale-video": {
            title: "AKALE SHORT FILM",
            category: "VIDEO PRODUCTION",
            overview: "Cinematic short film project showcasing visual storytelling and emotional depth.",
            link: "https://youtu.be/1VW2f7f5x3o?si=wvcyoEHYbHO5anLn"
        },
        "porsche": {
            title: "Porsche GT3",
            category: "VIDEO EDITING",
            overview: "A high-octane edit for the Porsche GT3, emphasizing speed, sound, and engineering excellence.",
            link: "https://youtu.be/M9EkmvSulLs?si=k6kVZ2RPstcM4tLs"
        },
        "panda": {
            title: "KUNGFU PANDA",
            category: "VIDEO EDITING",
            overview: "Dynamic video edit featuring character-driven action and vibrant visuals.",
            link: "https://youtu.be/-jTDNNV1JnU?si=IoqN-geyxhfHxQbH"
        },
        // MOTION
        "buqyan-motion": {
            title: "BUQYAN STUDIOS ANIMATION",
            category: "MOTION GRAPHICS",
            overview: "Animated identity for Buqyan Studios, bringing the brand to life through smooth transitions.",
            link: "https://youtu.be/-YlR_YzfytU"
        },
        "buqyan-legend": {
            title: "BUQYAN STUDIOS LEGEND",
            category: "MOTION GRAPHICS",
            overview: "Legendary brand animation sequence for high-impact visual storytelling.",
            link: "https://youtu.be/1k_bFoVfA9s?si=W9PRSRNgDrbGdo7X"
        },
        "spotify": {
            title: "SPOTIFY LOGO ANIMATION",
            category: "MOTION GRAPHICS",
            overview: "A playful and rhythmic logo animation for Spotify, aligned with its audio-centric brand.",
            link: "https://youtu.be/2p88S0Lwz_g?si=E5xVvLOoBvR5FLfI"
        },
        "boat": {
            title: "Boat logo Animation",
            category: "MOTION GRAPHICS",
            overview: "Dynamic logo animation for Boat, capturing the energy of sound and movement.",
            link: "https://youtu.be/r6qnNStNwN4?si=TlMpoprsDi8vMCPF"
        },
        // PRINT
        "samsung-print": {
            title: "SAMSUNG CATALOGUE",
            category: "PRINT DESIGN",
            overview: "Comprehensive catalogue design for Samsung, focusing on product hierarchy and clean layouts.",
            link: "https://www.behance.net/gallery/241535081/SAMSUNG-CATALOGUE-DESIGN-MOCKUP"
        },
        "tictac-print": {
            title: "TICTAC AD",
            category: "PRINT DESIGN",
            overview: "Creative advertising design for TicTac, emphasizing freshness and vibrant visual language.",
            link: "https://www.behance.net/gallery/238938235/TICTAC-AD?platform=direct"
        },
        "ponnani-print": {
            title: "BROCHURE DESIGN",
            category: "PRINT DESIGN",
            overview: "Elegant brochure design for the Ponnani project, showcasing heritage and modern design.",
            link: "https://www.behance.net/gallery/240278381/BROCHURE-OF-PONNANI"
        },
        "bakeland-menu": {
            title: "BAKE LAND MENU",
            category: "PRINT DESIGN",
            overview: "Premium menu design for Bake Land Bakery, highlighting their exquisite offerings.",
            link: "https://www.behance.net/muhammedsidhan2"
        },
        // UPCOMING WORKS
        "mbg-nigeria": {
            title: "MBG INTEGRATED FARMS PVT LMT",
            category: "NIGERIA | BROCHURE DESIGN",
            overview: "A premium brochure design for an integrated farming leader in Nigeria, focusing on clarity and professional presentation.",
            link: "https://www.behance.net/gallery/248879001/MBG-BROCHURE-%28First-draft-design%29"
        },
        "fragro-perfume": {
            title: "FRAGRO PERFUME LAB",
            category: "BRANDING",
            overview: "Premium branding and visual identity for Fragro Perfume Lab.",
            link: "https://www.behance.net/muhammedsidhan2"
        },
        "fragro-poster": {
            title: "FRAGRO POSTER",
            category: "POSTER DESIGN",
            overview: "Striking promotional poster design for Fragro.",
            link: "https://www.behance.net/muhammedsidhan2"
        },
        "global-solution": {
            title: "GLOBAL SOLUTION CATERING",
            category: "QATAR | BRANDING",
            overview: "Strategic brand identity development for a premier catering service in Qatar.",
            link: "https://www.behance.net/muhammedsidhan2"
        },
        "zidhaf-kitchen": {
            title: "ZIDHAF KITCHEN",
            category: "INDONESIA | BRANDING",
            overview: "Modern and vibrant brand identity for a culinary venture in Indonesia.",
            link: "https://www.behance.net/muhammedsidhan2"
        }
    };

    allWorkCards.forEach(card => {
        card.addEventListener('click', () => {
            const pId = card.getAttribute('data-project');
            const data = projects[pId];
            
            if (data && data.link) {
                window.open(data.link, '_blank');
            } else {
                // Fallback to Behance profile if no specific link
                window.open("https://www.behance.net/muhammedsidhan2", '_blank');
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // 6. Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            window.submitted = true;
            submitBtn.disabled = true;
            submitBtn.innerText = "Sending...";
        });
    }

    window.handleFormResponse = function() {
        if (window.submitted) {
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            window.submitted = false; // Reset for next time
            
            // Re-initialize lucide icons if any in success message
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    };

    window.resetForm = function() {
        contactForm.reset();
        contactForm.style.display = 'block';
        formSuccess.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.innerText = "Send Message";
    };

    // 7. Horizontal Marquee Animation
    const marquee = document.getElementById('poster-marquee');
    if (marquee) {
        marquee.style.animation = "marquee 40s linear infinite";
        
        marquee.addEventListener('mouseenter', () => {
            marquee.style.animationPlayState = 'paused';
        });
        
        marquee.addEventListener('mouseleave', () => {
            marquee.style.animationPlayState = 'running';
        });
    }

    // 8. Magic Wand Cursor Effect
    let lastSparkleTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        // Limit sparkle creation to at most once every 40ms to avoid performance lag
        if (now - lastSparkleTime > 40) {
            // Spawn sparkles occasionally for a trail effect
            if (Math.random() > 0.4) {
                createSparkle(e.clientX, e.clientY);
                lastSparkleTime = now;
            }
        }
    });

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        // Randomize size
        const size = Math.random() * 8 + 4;
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';

        // Positioning
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';

        // Random drift (physics-like spread)
        const driftX = (Math.random() - 0.5) * 80;
        const driftY = (Math.random() - 0.5) * 40;
        sparkle.style.setProperty('--drift-x', driftX + 'px');
        sparkle.style.setProperty('--drift-y', driftY + 'px');

        // Randomize duration slightly for natural feel
        const duration = Math.random() * 400 + 600;
        sparkle.style.setProperty('--duration', duration + 'ms');

        // Pick a color pair from the gradient palette
        const colorPairs = [
            { from: '#00d2ff', to: '#a163f7' },
            { from: '#a163f7', to: '#00d2ff' },
            { from: '#00d2ff', to: '#ffffff' },
            { from: '#ffffff', to: '#a163f7' }
        ];
        const pair = colorPairs[Math.floor(Math.random() * colorPairs.length)];
        sparkle.style.setProperty('--color-from', pair.from);
        sparkle.style.setProperty('--color-to', pair.to);
        sparkle.style.setProperty('--glow-size', size + 'px');

        // Inner glowing dot
        const inner = document.createElement('div');
        inner.className = 'sparkle-inner';
        sparkle.appendChild(inner);

        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), duration);
    }
});

// Add Keyframes for Marquee
const style = document.createElement('style');
style.innerHTML = `
    @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
`;
document.head.appendChild(style);
