window.formLoadTime = Date.now();

if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

const { animate, inView, stagger } = typeof Motion !== 'undefined' ? Motion : { animate: () => {}, inView: () => {}, stagger: () => {} };

console.log("Muhammed Sidhan Portfolio Script Initialized");

document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar Scroll & Mobile Menu & Search
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    // Function to safely open/close mobile navigation
    const toggleMenu = (openState) => {
        if (!navLinks) return;
        const isOpen = typeof openState === 'boolean' ? openState : !navLinks.classList.contains('active');

        if (isOpen) {
            navLinks.classList.add('active');
            if (menuToggle) {
                menuToggle.innerHTML = '<i data-lucide="x"></i>';
                menuToggle.setAttribute('aria-expanded', 'true');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
            document.body.style.overflow = 'hidden';
        } else {
            navLinks.classList.remove('active');
            if (menuToggle) {
                menuToggle.innerHTML = '<i data-lucide="menu"></i>';
                menuToggle.setAttribute('aria-expanded', 'false');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
            document.body.style.overflow = '';
        }
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Close menu when clicking any nav link
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
                toggleMenu(false);
            }
        }
    });

    // Close menu on resize back to desktop screen width
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    // Robust Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
                toggleMenu(false);
            } else {
                console.warn(`[Scroll Anchor] Target section '${targetId}' not found in DOM.`);
            }
        });
    });

    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchResultsList = document.getElementById('search-results-list');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Search Logic
    const searchData = [
        { title: "Home", category: "Section", desc: "Back to top of page", link: "#home" },
        { title: "Recent Works", category: "Section", desc: "Latest projects and campaigns", link: "#recent" },
        { title: "Work / Projects", category: "Section", desc: "Full portfolio gallery", link: "#work" },
        { title: "Campaign", category: "Page", desc: "Detailed 9-grid strategy and breakdown", link: "campaign.html" },
        { title: "AI Prompt Library", category: "Page", desc: "30+ practical, copy-ready AI prompts for graphic designers", link: "prompts.html" },
        { title: "Services", category: "Section", desc: "What I offer: Branding, Web, etc.", link: "#services" },
        { title: "Contact", category: "Section", desc: "Start a project together", link: "#contact" },
        { title: "About", category: "Section", desc: "My story and design philosophy", link: "#about" },
        { title: "Skills & Expertise", category: "Section", desc: "Tools and specializations", link: "#skills" },
        { title: "Design Process", category: "Section", desc: "How I work from research to layout", link: "#process" },
        { title: "Testimonials", category: "Section", desc: "What clients say about me", link: "#testimonials" },
        
        // Projects
        { title: "FRAGRO Instagram Campaign", category: "Project", desc: "Premium 9-grid perfume lab campaign", link: "#recent" },
        { title: "BUQYAN Studios", category: "Project", desc: "Brand identity for cinematic studio", link: "#work" },
        { title: "Bake Land Bakery", category: "Project", desc: "Visual identity and social media design", link: "#work" },
        { title: "MBG Integrated Farms", category: "Project", desc: "Branding and print design", link: "#work" },
        { title: "Rangam Film Festival", category: "Project", desc: "Poster and visual identity", link: "#work" },
        { title: "Samsung Catalogue", category: "Project", desc: "Print design and layout", link: "#work" },
        { title: "TicTac Ad", category: "Project", desc: "Motion graphics and visual storytelling", link: "#work" },
        { title: "UEFA Champions League", category: "Project", desc: "Sports poster design", link: "#work" },
        
        // Specific Skills
        { title: "Branding & Logo Design", category: "Service", desc: "Creating unique visual identities", link: "#services" },
        { title: "9-Grid Instagram Strategy", category: "Service", desc: "Social media profile storytelling", link: "campaign.html" },
        { title: "Video Editing", category: "Service", desc: "Cinematic and commercial editing", link: "#services" },
        { title: "AI Video Creation", category: "Skill", desc: "Generative AI video with Veo, Kling, Magnific & Antigravity", link: "#skills" },
        { title: "Motion Graphics", category: "Service", desc: "Animated brand elements", link: "#services" },
        { title: "Print Design", category: "Service", desc: "Brochures, catalogues, and posters", link: "#services" },
        { title: "Web Development", category: "Service", desc: "Modern, responsive websites", link: "#services" }
    ];

    const toggleSearch = (state) => {
        if (!searchOverlay) return;
        if (state) {
            toggleMenu(false); // Close mobile menu if opening search
            searchOverlay.classList.add('active');
            if (searchInput) setTimeout(() => searchInput.focus(), 300);
            document.body.style.overflow = 'hidden';
        } else {
            searchOverlay.classList.remove('active');
            if (!navLinks || !navLinks.classList.contains('active')) {
                document.body.style.overflow = '';
            }
            if (searchInput) searchInput.value = '';
            if (searchResultsList) searchResultsList.innerHTML = '';
        }
    };

    if (searchToggle) {
        searchToggle.addEventListener('click', () => toggleSearch(true));
    }
    if (searchClose) {
        searchClose.addEventListener('click', () => toggleSearch(false));
    }
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleSearch(false);
            toggleMenu(false);
        }
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) {
                if (searchResultsList) searchResultsList.innerHTML = '';
                return;
            }

            const matches = searchData.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.category.toLowerCase().includes(query) || 
                item.desc.toLowerCase().includes(query)
            );

            renderResults(matches);
        });
    }

    const renderResults = (results) => {
        if (!searchResultsList) return;
        if (results.length === 0) {
            searchResultsList.innerHTML = '<div class="no-results">No matching results found.</div>';
            return;
        }

        searchResultsList.innerHTML = results.map(item => `
            <a href="${item.link}" class="search-result-item">
                <div class="search-result-header">
                    <span class="search-result-title">${item.title}</span>
                    <span class="search-result-category">${item.category}</span>
                </div>
                <p class="search-result-desc">${item.desc}</p>
            </a>
        `).join('');

        // Add smooth scroll behavior to search links
        searchResultsList.querySelectorAll('.search-result-item').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    toggleSearch(false);
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    };

    // Helper functions for safe animations
    const safeAnimate = (selector, keyframes, options) => {
        if (document.querySelector(selector) && typeof animate !== 'undefined') {
            animate(selector, keyframes, options);
        }
    };

    const safeInView = (selector, callback) => {
        if (document.querySelector(selector) && typeof inView !== 'undefined') {
            inView(selector, callback);
        }
    };

    // 2. Hero Animations
    safeAnimate(".hero-subtitle", { opacity: [0, 1], y: [20, 0] }, { duration: 0.8 });
    safeAnimate(".hero-title", { opacity: [0, 1], y: [40, 0] }, { duration: 1, delay: 0.2 });
    safeAnimate(".hero-description", { opacity: [0, 1], y: [20, 0] }, { duration: 0.8, delay: 0.4 });
    safeAnimate(".hero-ctas", { opacity: [0, 1], y: [20, 0] }, { duration: 0.8, delay: 0.6 });

    // 3. In-View Scroll Animations
    safeInView(".fade-up", ({ target }) => {
        if (typeof animate !== 'undefined') {
            animate(target, { opacity: [0, 1], y: [40, 0] }, { 
                duration: 0.8, 
                delay: stagger(0.1),
                easing: [0.16, 1, 0.3, 1]
            });
        }
    });

    safeInView(".skill-progress", ({ target }) => {
        const width = target.style.width;
        target.style.width = "0";
        if (typeof animate !== 'undefined') {
            animate(target, { width: [0, width] }, { duration: 1.5, easing: "ease-out" });
        }
    });

    // 3.5 About Stats Live Count-Up Animation
    (function initStatsCountUp() {
        const statsSection = document.querySelector('.about-stats');
        if (!statsSection) return;

        const statElements = Array.from(statsSection.querySelectorAll('.stat-number'));
        if (!statElements.length) return;

        const statsData = statElements.map(el => {
            const raw = el.getAttribute('data-target') || el.textContent.replace(/[^\d.]/g, '');
            const target = parseFloat(raw) || 0;
            const hasDot = raw.includes('.');
            const decimals = parseInt(el.getAttribute('data-decimals') || (hasDot ? '1' : '0'), 10);
            const suffix = el.getAttribute('data-suffix') !== null ? el.getAttribute('data-suffix') : (el.textContent.includes('+') ? '+' : '');
            return { el, target, decimals, suffix, currentAnimId: null };
        });

        // Initialize display to 0 if not already in viewport on load
        const rect = statsSection.getBoundingClientRect();
        const isInViewportInitially = (rect.top < window.innerHeight && rect.bottom > 0);
        if (!isInViewportInitially) {
            statsData.forEach(item => {
                item.el.textContent = (0).toFixed(item.decimals) + item.suffix;
            });
        }

        let isVisible = false;

        const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

        const startCountUp = () => {
            statsData.forEach((item, index) => {
                if (item.currentAnimId) {
                    cancelAnimationFrame(item.currentAnimId);
                }

                // Start from 0
                item.el.textContent = (0).toFixed(item.decimals) + item.suffix;

                const duration = 1600; // ms
                let startTime = null;

                const step = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const elapsed = timestamp - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = easeOutExpo(progress);

                    const val = (eased * item.target).toFixed(item.decimals);
                    item.el.textContent = val + item.suffix;

                    if (progress < 1) {
                        item.currentAnimId = requestAnimationFrame(step);
                    } else {
                        item.el.textContent = item.target.toFixed(item.decimals) + item.suffix;
                        item.currentAnimId = null;
                    }
                };

                // Stagger each counter for fluid wave motion
                setTimeout(() => {
                    item.currentAnimId = requestAnimationFrame(step);
                }, index * 90);
            });
        };

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!isVisible) {
                            isVisible = true;
                            startCountUp();
                        }
                    } else {
                        // Reset when scrolled completely out of view so it animates each time user slides into section
                        if (entry.intersectionRatio === 0) {
                            isVisible = false;
                            statsData.forEach(item => {
                                if (item.currentAnimId) {
                                    cancelAnimationFrame(item.currentAnimId);
                                    item.currentAnimId = null;
                                }
                                item.el.textContent = (0).toFixed(item.decimals) + item.suffix;
                            });
                        }
                    }
                });
            }, {
                threshold: [0, 0.25],
                rootMargin: '0px 0px -40px 0px'
            });

            observer.observe(statsSection);
        } else {
            startCountUp();
        }
    })();


    // 4. Project Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterCards = document.querySelectorAll('#main-work-grid .work-card');

    function setFilter(filter) {
        if (filterBtns.length === 0) return;
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
                if (typeof animate !== 'undefined') animate(card, { opacity: [0, 1], scale: [0.98, 1] }, { duration: 0.3 });
            } else if (filter === 'featured') {
                if (isFeatured) {
                    card.classList.remove('hidden');
                    if (typeof animate !== 'undefined') animate(card, { opacity: [0, 1], scale: [0.98, 1] }, { duration: 0.3 });
                } else {
                    card.classList.add('hidden');
                }
            } else {
                if (category && category.includes(filter)) {
                    card.classList.remove('hidden');
                    if (typeof animate !== 'undefined') animate(card, { opacity: [0, 1], scale: [0.98, 1] }, { duration: 0.3 });
                } else {
                    card.classList.add('hidden');
                }
            }
        });

        // Reset scroll position to beginning on mobile slide when filter changes
        const mainWorkGrid = document.getElementById('main-work-grid');
        if (mainWorkGrid) {
            mainWorkGrid.scrollTo({ left: 0, behavior: 'smooth' });
        }
        if (typeof window.updateProjectsCounter === 'function') {
            setTimeout(window.updateProjectsCounter, 100);
        }
    }

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                setFilter(btn.getAttribute('data-filter'));
            });
        });
        // Default to FEATURED
        setFilter('featured');
    }

    // 5. Case Study Modal Logic
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.modal-close');
    const allWorkCards = document.querySelectorAll('.work-card');
    
    const projects = {
        "kibblix-branding": {
            title: "KIBBLIX BRANDING",
            category: "PET NUTRITION & BRAND IDENTITY",
            overview: "A premium brand identity design for Kibblix, a pet nutrition brand. The project covers logo design, typography, color system, and packaging — crafting a friendly yet authoritative visual language for the pet care market.",
            challenge: "Balancing approachability and trust in a category where quality perception directly impacts purchase decisions.",
            solution: "Developed a distinctive logotype paired with a warm, natural color palette and clean typography to communicate both care and credibility.",
            outcome: "A cohesive brand identity that positions Kibblix as a premium yet accessible pet nutrition brand.",
            link: "https://www.behance.net/gallery/249492929/Kibblix-Premium-Pet-Nutrition-Brand-Identity-Design"
        },
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
        "mbg-brochure": {
            title: "MBG BROCHURE",
            category: "BRANDING & PRINT DESIGN",
            link: "https://www.behance.net/gallery/248879001/MBG-BROCHURE-%28First-draft-design%29"
        },
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
        "mbg-nigeria": {
            title: "MBG INTEGRATED FARMS PVT LMT",
            category: "NIGERIA | BROCHURE DESIGN",
            overview: "A premium brochure design for an integrated farming leader in Nigeria, focusing on clarity and professional presentation.",
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

    if (allWorkCards.length > 0) {
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
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // 6. Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop default form submit
            
            const formData = new FormData(contactForm);
            const name = (formData.get('entry.269513773') || '').toString().trim();
            const email = (formData.get('entry.1315283641') || '').toString().trim();
            const message = (formData.get('entry.1248789437') || '').toString().trim();
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

            // Client-side pre-validation
            if (name.length < 2 || name.length > 100) {
                alert('Please enter a valid name (2-100 characters).');
                const nameInput = document.getElementById('form-name');
                if (nameInput) nameInput.focus();
                return;
            }

            if (email.length < 5 || email.length > 150 || !emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                const emailInput = document.getElementById('form-email');
                if (emailInput) emailInput.focus();
                return;
            }

            if (message.length < 10 || message.length > 3000) {
                alert('Please enter a message between 10 and 3,000 characters.');
                const messageInput = document.getElementById('form-message');
                if (messageInput) messageInput.focus();
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "Sending...";
            }

            // If running locally as a file:// or plain localhost dev server (not Cloudflare Pages / Workers),
            // mock a successful submission for dev convenience.
            const isLocalFile = window.location.protocol === 'file:';
            const isPlainLocalhost = (
                window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1'
            ) && window.location.port !== '8788' && window.location.port !== '8787'; // 8788 = pages dev, 8787 = worker dev
            
            if (isLocalFile || isPlainLocalhost) {
                console.warn('Local environment detected (non-Cloudflare dev server). Mocking successful submission.');
                setTimeout(() => {
                    window.submitted = true;
                    window.handleFormResponse();
                }, 400);
                return;
            }
            
            // Append the recorded load time
            formData.set('form_load_time', (window.formLoadTime || Date.now()).toString());

            // If Turnstile script failed to load (e.g. blocked by ad-blocker), append
            // a sentinel value so the server knows to skip token verification gracefully.
            if (window.turnstileLoadFailed) {
                formData.set('cf-turnstile-response', 'TURNSTILE_LOAD_FAILED');
            }

            try {
                const response = await fetch('/api/submit-contact', {
                    method: 'POST',
                    body: formData
                });

                let result;
                try {
                    result = await response.json();
                } catch (parseErr) {
                    result = null;
                }

                if (response.ok && result && result.success) {
                    window.submitted = true;
                    window.handleFormResponse();
                } else {
                    const errorMsg = (result && result.error) 
                        ? result.error 
                        : `Submission failed (${response.status}: ${response.statusText || 'Error'}). Please try again.`;
                    alert(errorMsg);
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = "Send Message";
                    }
                    if (typeof turnstile !== 'undefined') {
                        turnstile.reset();
                    }
                }
            } catch (err) {
                console.error('[Contact Form Error]:', err);
                alert('A network error occurred while sending your message. Please check your connection and try again.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Send Message";
                }
                if (typeof turnstile !== 'undefined') {
                    turnstile.reset();
                }
            }
        });
    }

    window.handleFormResponse = function() {
        if (window.submitted && contactForm && formSuccess) {
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
        if (contactForm && formSuccess) {
            contactForm.reset();
            window.formLoadTime = Date.now(); // Reset timer
            contactForm.style.display = 'block';
            formSuccess.style.display = 'none';
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = "Send Message";
            }
            if (typeof turnstile !== 'undefined') {
                turnstile.reset();
            }
        }
    };

    // 7. Step-by-Step Poster Slider (Auto-Scroll + Manual Controls with transform: translateX)
    const track = document.getElementById('posterTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const wrapper = document.getElementById('gallery-wrapper');

    if (track && prevBtn && nextBtn && wrapper) {
        let currentTranslate = 0;
        let autoSlideInterval = null;
        const autoSlideDelay = 3500; // Auto-scroll moves every 3.5 seconds

        // Calculate shift step dynamically: width of one poster + track's gap
        function getShiftAmount() {
            const item = track.querySelector('.poster-item');
            if (!item) return 482; // Fallback: 450px width + 32px gap
            const gap = parseFloat(window.getComputedStyle(track).gap) || 32;
            return item.offsetWidth + gap;
        }

        // Shift the slider track horizontally
        function shift(direction) {
            const shiftAmount = getShiftAmount();
            const maxScroll = track.scrollWidth - wrapper.clientWidth;

            if (direction === 'next') {
                currentTranslate -= shiftAmount;
                // If we scrolled past the end of the track, loop back to the beginning
                if (-currentTranslate > maxScroll + 10) { // 10px threshold buffer
                    currentTranslate = 0;
                }
            } else if (direction === 'prev') {
                currentTranslate += shiftAmount;
                // If we scrolled past the beginning, wrap around to the end
                if (currentTranslate > 10) {
                    currentTranslate = -maxScroll;
                }
            }

            // Apply horizontal transform shift
            track.style.transform = `translateX(${currentTranslate}px)`;
        }

        // Auto slide interval management
        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(() => {
                shift('next');
            }, autoSlideDelay);
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        function resetAutoSlide() {
            stopAutoSlide();
            startAutoSlide();
        }

        // Event listeners for manual navigation buttons
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            shift('next');
            resetAutoSlide(); // Reset interval upon manual interaction
        });

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            shift('prev');
            resetAutoSlide(); // Reset interval upon manual interaction
        });

        // Pause auto slide on hover for better user reading/engagement
        wrapper.addEventListener('mouseenter', stopAutoSlide);
        wrapper.addEventListener('mouseleave', startAutoSlide);

        // Initialize auto-sliding
        startAutoSlide();

        // Keep layout aligned perfectly on viewport size changes
        window.addEventListener('resize', () => {
            const maxScroll = track.scrollWidth - wrapper.clientWidth;
            if (-currentTranslate > maxScroll) {
                currentTranslate = -maxScroll;
                if (currentTranslate > 0) currentTranslate = 0;
                track.style.transform = `translateX(${currentTranslate}px)`;
            }
        });
    }

    // 8. Magic Wand Cursor Effect — Continuous Glowing Line Trail
    (function initMagicWandTrail() {
        let canvas = document.getElementById('wand-trail-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'wand-trail-canvas';
            document.body.appendChild(canvas);
        }
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let dpr = window.devicePixelRatio || 1;
        function resizeCanvas() {
            dpr = window.devicePixelRatio || 1;
            canvas.width = Math.round(window.innerWidth * dpr);
            canvas.height = Math.round(window.innerHeight * dpr);
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });

        const points = [];
        const particles = [];
        const TRAIL_LIFETIME = 450;
        let isRendering = false;
        let lastMoveTime = 0;
        let animFrameId = null;

        function addPoint(x, y) {
            const now = performance.now();
            lastMoveTime = now;

            if (points.length > 0) {
                const last = points[points.length - 1];
                const dx = x - last.x;
                const dy = y - last.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < 2.5) return;

                if (Math.random() > 0.45 && distSq > 9) {
                    particles.push({
                        x: x + (Math.random() - 0.5) * 6,
                        y: y + (Math.random() - 0.5) * 6,
                        vx: (Math.random() - 0.5) * 1.2,
                        vy: (Math.random() - 0.5) * 1.2 - 0.3,
                        size: Math.random() * 2.2 + 1.2,
                        alpha: 1,
                        decay: Math.random() * 0.035 + 0.025,
                        color: Math.random() > 0.4 ? '#00f2fe' : (Math.random() > 0.5 ? '#ffffff' : '#a163f7')
                    });
                }
            }

            points.push({ x, y, time: now });
            if (!isRendering) {
                isRendering = true;
                animFrameId = requestAnimationFrame(render);
            }
        }

        function drawWandStarFlare(cx, cy, size, alpha) {
            ctx.save();
            ctx.translate(cx, cy);

            const rad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2.2);
            rad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
            rad.addColorStop(0.35, `rgba(0, 242, 254, ${alpha * 0.75})`);
            rad.addColorStop(0.7, `rgba(161, 99, 247, ${alpha * 0.35})`);
            rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = rad;
            ctx.beginPath();
            ctx.arc(0, 0, size * 2.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
            ctx.beginPath();
            ctx.moveTo(0, -size * 1.6);
            ctx.quadraticCurveTo(0, 0, size * 1.6, 0);
            ctx.quadraticCurveTo(0, 0, 0, size * 1.6);
            ctx.quadraticCurveTo(0, 0, -size * 1.6, 0);
            ctx.quadraticCurveTo(0, 0, 0, -size * 1.6);
            ctx.fill();

            ctx.restore();
        }

        function render() {
            const now = performance.now();

            while (points.length > 0 && now - points[0].time > TRAIL_LIFETIME) {
                points.shift();
            }

            if (points.length === 0 && particles.length === 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                isRendering = false;
                animFrameId = null;
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.globalCompositeOperation = 'lighter';

            if (points.length >= 2) {
                const midpoints = [];
                for (let i = 0; i < points.length - 1; i++) {
                    midpoints.push({
                        x: (points[i].x + points[i + 1].x) / 2,
                        y: (points[i].y + points[i + 1].y) / 2
                    });
                }

                const passes = [
                    { widthMult: 2.8, blur: 12, stroke: (a) => `rgba(161, 99, 247, ${a * 0.35})`, shadow: '#a163f7' },
                    { widthMult: 1.5, blur: 6, stroke: (a) => `rgba(0, 242, 254, ${a * 0.8})`, shadow: '#00f2fe' },
                    { widthMult: 0.55, blur: 2, stroke: (a) => `rgba(255, 255, 255, ${a * 0.95})`, shadow: '#ffffff' }
                ];

                for (let p = 0; p < passes.length; p++) {
                    const pass = passes[p];
                    ctx.shadowColor = pass.shadow;
                    ctx.shadowBlur = pass.blur * dpr;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';

                    for (let i = 0; i < points.length - 1; i++) {
                        const pt = points[i + 1];
                        const age = now - pt.time;
                        let progress = 1 - (age / TRAIL_LIFETIME);
                        if (progress < 0) progress = 0;
                        if (progress > 1) progress = 1;

                        const baseWidth = 0.5 + 5.5 * Math.pow(progress, 1.2);
                        const width = Math.max(0.6, baseWidth * pass.widthMult);
                        const alpha = Math.pow(progress, 1.3);

                        ctx.lineWidth = width;
                        ctx.strokeStyle = pass.stroke(alpha);

                        ctx.beginPath();
                        if (i === 0) {
                            ctx.moveTo(points[0].x, points[0].y);
                            ctx.lineTo(midpoints[0].x, midpoints[0].y);
                        } else {
                            ctx.moveTo(midpoints[i - 1].x, midpoints[i - 1].y);
                            ctx.quadraticCurveTo(points[i].x, points[i].y, midpoints[i].x, midpoints[i].y);
                        }

                        if (i === points.length - 2) {
                            ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
                        }
                        ctx.stroke();
                    }
                }

                const head = points[points.length - 1];
                const timeSinceMove = now - lastMoveTime;
                if (timeSinceMove < 150) {
                    const tipAlpha = Math.max(0, 1 - (timeSinceMove / 150));
                    drawWandStarFlare(head.x, head.y, 6.5, tipAlpha);
                }
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const pt = particles[i];
                pt.x += pt.vx;
                pt.y += pt.vy;
                pt.alpha -= pt.decay;

                if (pt.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.translate(pt.x, pt.y);
                ctx.fillStyle = pt.color;
                ctx.shadowColor = pt.color;
                ctx.shadowBlur = 6 * dpr;

                const pSize = pt.size * pt.alpha;
                ctx.beginPath();
                ctx.moveTo(0, -pSize);
                ctx.lineTo(pSize * 0.6, 0);
                ctx.lineTo(0, pSize);
                ctx.lineTo(-pSize * 0.6, 0);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            ctx.restore();
            animFrameId = requestAnimationFrame(render);
        }

        window.addEventListener('mousemove', (e) => {
            addPoint(e.clientX, e.clientY);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            if (touch) {
                addPoint(touch.clientX, touch.clientY);
            }
        }, { passive: true });
    })();

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
    // Mobile & Tablet Tap Droplet Effect with Cursor Glazing
    function createDroplet(x, y) {
        const container = document.createElement('div');
        container.className = 'tap-droplet-container';
        container.style.left = x + 'px';
        container.style.top = y + 'px';

        const core = document.createElement('div');
        core.className = 'tap-droplet-core';

        const wave1 = document.createElement('div');
        wave1.className = 'tap-droplet-wave';

        const wave2 = document.createElement('div');
        wave2.className = 'tap-droplet-wave wave-2';

        container.appendChild(wave1);
        container.appendChild(wave2);
        container.appendChild(core);
        document.body.appendChild(container);

        // Radiant glazing sparkle burst around droplet
        const count = 5;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
            const dist = Math.random() * 24 + 10;
            createSparkle(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist);
        }

        setTimeout(() => container.remove(), 850);
    }

    // Touch & Tablet Tap listener
    let lastTapTime = 0;
    const handleTouchOrPointerTap = (x, y) => {
        const now = Date.now();
        if (now - lastTapTime < 140) return;
        lastTapTime = now;
        createDroplet(x, y);
    };

    document.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch' || e.pointerType === 'pen' || window.innerWidth <= 1024) {
            handleTouchOrPointerTap(e.clientX, e.clientY);
        }
    }, { passive: true });

    // Glazing trail while moving finger across mobile/tablet screen
    let lastTouchTrail = 0;
    document.addEventListener('touchmove', (e) => {
        const now = Date.now();
        if (now - lastTouchTrail > 45) {
            lastTouchTrail = now;
            const touch = e.touches[0];
            if (touch) {
                createSparkle(touch.clientX, touch.clientY);
            }
        }
    }, { passive: true });


    // 9. Kibblix Pet Nutrition Showcase — pixel-based vertical slider
    (function () {
        const viewport = document.getElementById('kibblixViewport');
        const track    = document.getElementById('kibblixTrack');
        const upBtn    = document.getElementById('kibblixUpBtn');
        const downBtn  = document.getElementById('kibblixDownBtn');

        if (!viewport || !track || !upBtn || !downBtn) return;

        let scrollAmount = 0;

        function getMaxScroll() {
            return Math.max(0, track.scrollHeight - viewport.clientHeight);
        }

        function applyTranslate() {
            track.style.transform = 'translateY(-' + scrollAmount + 'px)';
            
            // Toggle disabled visual styles
            const atTop = scrollAmount <= 0;
            const atBottom = scrollAmount >= getMaxScroll();
            upBtn.classList.toggle('disabled', atTop);
            downBtn.classList.toggle('disabled', atBottom);
        }

        downBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const max = getMaxScroll();
            scrollAmount += viewport.clientHeight;
            if (scrollAmount > max) {
                scrollAmount = max;
            }
            applyTranslate();
        });

        upBtn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollAmount -= viewport.clientHeight;
            if (scrollAmount < 0) {
                scrollAmount = 0;
            }
            applyTranslate();
        });

        // Debounced resize — prevents continuous main-thread work on mobile/orientation flip
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const max = getMaxScroll();
                if (scrollAmount > max) {
                    scrollAmount = max;
                }
                if (scrollAmount < 0) {
                    scrollAmount = 0;
                }
                applyTranslate();
            }, 150);
        });

        // Wait until images have loaded so scroll bounds are correct
        window.addEventListener('load', () => {
            applyTranslate();
        });

        // Fallback init — handles cases where DOMContentLoaded fires before images report height
        setTimeout(() => {
            applyTranslate();
        }, 600);

    // Mobile Slider Dots Synchronization (Brand Recognition & Upcoming Works)
    const setupMobileSliderDots = (trackId, dotsId, dotClass) => {
        const track = document.getElementById(trackId);
        const dotsContainer = document.getElementById(dotsId);
        if (!track || !dotsContainer) return;
        const dots = dotsContainer.querySelectorAll(`.${dotClass}`);
        if (dots.length === 0) return;

        track.addEventListener('scroll', () => {
            const scrollLeft = track.scrollLeft;
            const card = track.querySelector('.brand-card, .work-card');
            const cardWidth = card ? card.offsetWidth + 16 : 300;
            const activeIndex = Math.min(dots.length - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));
            dots.forEach((dot, idx) => {
                if (idx === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }, { passive: true });

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                const card = track.querySelector('.brand-card, .work-card');
                const cardWidth = card ? card.offsetWidth + 16 : 300;
                track.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
            });
        });
    };

    setupMobileSliderDots('brandCardsTrack', 'brandSliderDots', 'brand-dot');
    setupMobileSliderDots('upcomingWorksTrack', 'upcomingSliderDots', 'upcoming-dot');

    // Projects Mobile Slider Controls & Live Counter
    const setupProjectsMobileSlider = () => {
        const grid = document.getElementById('main-work-grid');
        const prevBtn = document.getElementById('projPrevBtn');
        const nextBtn = document.getElementById('projNextBtn');
        const currentEl = document.getElementById('projCurrentIndex');
        const totalEl = document.getElementById('projTotalCount');
        if (!grid) return;

        const getVisibleCards = () => Array.from(grid.querySelectorAll('.work-card:not(.hidden)'));

        const updateCounter = () => {
            const visible = getVisibleCards();
            if (totalEl) totalEl.textContent = visible.length;
            if (visible.length === 0) return;

            const scrollLeft = grid.scrollLeft;
            const cardWidth = visible[0].offsetWidth + 16;
            const activeIdx = Math.min(visible.length - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));
            if (currentEl) currentEl.textContent = activeIdx + 1;
        };

        grid.addEventListener('scroll', updateCounter, { passive: true });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const visible = getVisibleCards();
                const cardWidth = visible[0] ? visible[0].offsetWidth + 16 : 280;
                grid.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const visible = getVisibleCards();
                const cardWidth = visible[0] ? visible[0].offsetWidth + 16 : 280;
                grid.scrollBy({ left: cardWidth, behavior: 'smooth' });
            });
        }

        window.updateProjectsCounter = updateCounter;
        updateCounter();
    };

    setupProjectsMobileSlider();

    // Skills & Expertise Mobile Slider Controls & Live Counter
    const setupSkillsMobileSlider = () => {
        const track = document.getElementById('skillsTrack');
        const prevBtn = document.getElementById('skillPrevBtn');
        const nextBtn = document.getElementById('skillNextBtn');
        const currentEl = document.getElementById('skillCurrentIndex');
        const totalEl = document.getElementById('skillTotalCount');
        if (!track) return;

        const cards = Array.from(track.querySelectorAll('.skill-card'));
        if (totalEl) totalEl.textContent = cards.length;

        const updateCounter = () => {
            if (cards.length === 0) return;
            const scrollLeft = track.scrollLeft;
            const cardWidth = cards[0].offsetWidth + 16;
            const activeIdx = Math.min(cards.length - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));
            if (currentEl) currentEl.textContent = activeIdx + 1;
        };

        track.addEventListener('scroll', updateCounter, { passive: true });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const cardWidth = cards[0] ? cards[0].offsetWidth + 16 : 280;
                track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const cardWidth = cards[0] ? cards[0].offsetWidth + 16 : 280;
                track.scrollBy({ left: cardWidth, behavior: 'smooth' });
            });
        }

        updateCounter();
    };

    setupSkillsMobileSlider();


    }());
});

// Cloudflare Turnstile global callbacks.
// Declared as window properties so Turnstile can call them synchronously via
// data-callback / data-error-callback the moment the widget initialises,
// matching the browser's preload intent and silencing the preload-not-used warning.
window.onTurnstileSuccess = function(token) {
    // Token is automatically injected into the form field by Turnstile.
    // Nothing extra needed here — the token will be present in FormData on submit.
    console.debug('[Turnstile] Widget verified successfully.');
};

window.onTurnstileError = function() {
    // If the widget itself errors (bad network, sitekey mismatch, etc.),
    // mark the load as failed so the submit handler sends the fallback sentinel.
    window.turnstileLoadFailed = true;
    console.warn('[Turnstile] Widget encountered an error — spam checks will run without token verification.');
};
