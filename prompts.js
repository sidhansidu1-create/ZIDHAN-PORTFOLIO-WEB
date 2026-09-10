/**
 * ==============================================================================
 * AI PROMPT LIBRARY - CLIENT ENGINE (ZIDHAN DESIGN STUDIO)
 * ==============================================================================
 * "Practical AI prompts for better design."
 * 
 * Manages:
 * - Dynamic card rendering from window.PROMPTS_DATA
 * - Real-time keyword search & category filtering
 * - 1-Click prompt clipboard copy with visual confirmation
 * - Modal expanded view with complete design tips & pro moves
 * - Empty search state handling
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // Check if prompt data exists
    if (!window.PROMPTS_DATA || !Array.isArray(window.PROMPTS_DATA)) {
        console.error("[Prompt Library] PROMPTS_DATA not found.");
        return;
    }

    const allPrompts = window.PROMPTS_DATA;
    let currentCategory = "ALL";
    let currentSearchTerm = "";

    // DOM Elements
    const featuredGrid = document.getElementById("featured-grid");
    const mainGrid = document.getElementById("prompts-main-grid");
    const categoryButtons = document.querySelectorAll(".prompt-cat-btn");
    const searchInput = document.getElementById("prompt-search-input");
    const searchClearBtn = document.getElementById("prompt-search-clear");
    const promptCountBadge = document.getElementById("prompt-count-badge");
    const featuredSection = document.getElementById("featured-section");

    // Modal Elements
    const modalOverlay = document.getElementById("prompt-modal");
    const modalCloseBtn = document.getElementById("prompt-modal-close");
    const modalNum = document.getElementById("modal-num");
    const modalCategory = document.getElementById("modal-category");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalUseCase = document.getElementById("modal-usecase");
    const modalPromptContent = document.getElementById("modal-prompt-content");
    const modalCopyBtn = document.getElementById("modal-copy-btn");
    const modalDesignTip = document.getElementById("modal-design-tip");
    const modalProMove = document.getElementById("modal-pro-move");
    const modalTags = document.getElementById("modal-tags");

    // Toast Element
    const toast = document.getElementById("prompt-toast");
    const toastText = document.getElementById("prompt-toast-text");
    let toastTimeout = null;

    /**
     * Show brief toast notification
     */
    const showToast = (message = "Prompt copied to clipboard!") => {
        if (!toast) return;
        if (toastText) toastText.textContent = message;
        toast.classList.add("show");
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 2200);
    };

    /**
     * Copy text to clipboard with cross-browser fallback
     */
    const copyToClipboard = async (text, buttonElement) => {
        let success = false;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                success = true;
            } else {
                // Fallback for older browsers or insecure contexts
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                success = document.execCommand("copy");
                document.body.removeChild(textArea);
            }
        } catch (err) {
            console.error("Clipboard copy failed:", err);
            success = false;
        }

        if (success && buttonElement) {
            const originalHTML = buttonElement.innerHTML;
            buttonElement.classList.add("copied");
            buttonElement.innerHTML = `<i data-lucide="check" style="width:14px;height:14px;"></i> COPIED ✓`;
            if (window.lucide) lucide.createIcons();

            showToast("Copied exact prompt to clipboard!");

            setTimeout(() => {
                buttonElement.classList.remove("copied");
                buttonElement.innerHTML = originalHTML;
                if (window.lucide) lucide.createIcons();
            }, 2000);
        }
    };

    /**
     * Format prompt number: 1 -> PROMPT #01
     */
    const formatNumber = (num) => {
        return `PROMPT #${String(num).padStart(2, "0")}`;
    };

    /**
     * Create HTML markup for a single prompt card
     */
    const createPromptCard = (item, isFeaturedMode = false) => {
        const card = document.createElement("article");
        card.className = `prompt-card ${isFeaturedMode ? "featured-card" : ""}`;
        card.setAttribute("data-id", item.number);
        card.setAttribute("data-category", item.category);

        const tagsHTML = item.tags.slice(0, 3).map(tag => `<span class="card-tag-pill">${escapeHTML(tag)}</span>`).join("");

        card.innerHTML = `
            <div>
                <div class="card-top-meta">
                    <span class="card-num">${formatNumber(item.number)}</span>
                    <span class="card-category-badge">${escapeHTML(item.category)}</span>
                </div>
                ${isFeaturedMode ? `<div class="featured-pill"><i data-lucide="sparkles" style="width:12px;height:12px;"></i> FEATURED</div>` : ""}
                <h3 class="card-title">${escapeHTML(item.title)}</h3>
                <p class="card-desc">${escapeHTML(item.description)}</p>
                
                <div class="card-tags">
                    ${tagsHTML}
                </div>

                <div class="card-prompt-preview" title="Click to view full prompt">
                    <div class="card-prompt-preview-text">${escapeHTML(item.prompt)}</div>
                </div>
            </div>

            <div class="card-actions">
                <button type="button" class="btn-card-view" data-action="view" data-id="${item.number}">
                    <i data-lucide="maximize-2" style="width:14px;height:14px;"></i> VIEW PROMPT
                </button>
                <button type="button" class="btn-card-copy" data-action="copy" data-id="${item.number}">
                    <i data-lucide="copy" style="width:14px;height:14px;"></i> COPY PROMPT
                </button>
            </div>
        `;

        // Card button events
        const viewBtn = card.querySelector('[data-action="view"]');
        const copyBtn = card.querySelector('[data-action="copy"]');
        const previewBox = card.querySelector(".card-prompt-preview");

        if (viewBtn) {
            viewBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                openModal(item);
            });
        }

        if (previewBox) {
            previewBox.addEventListener("click", () => {
                openModal(item);
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                copyToClipboard(item.prompt, copyBtn);
            });
        }

        return card;
    };

    /**
     * Escape HTML special characters
     */
    function escapeHTML(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Render the 3 featured prompts in "START HERE"
     */
    const renderFeaturedPrompts = () => {
        if (!featuredGrid) return;
        featuredGrid.innerHTML = "";

        // Recommended prompts as specified:
        // 1. Premium Product Advertisement (#1)
        // 2. Creative Campaign Concept (#22)
        // 3. Think Like a Designer (#28)
        const featuredItems = allPrompts.filter(p => p.isFeatured);

        featuredItems.forEach(item => {
            const card = createPromptCard(item, true);
            featuredGrid.appendChild(card);
        });

        if (window.lucide) lucide.createIcons();
    };

    /**
     * Match category filter string against prompt category
     */
    const matchesCategory = (promptCategory, filterVal) => {
        if (filterVal === "ALL") return true;

        // Map short category button values to full category names
        const mapping = {
            "PRODUCT & ADS": "PRODUCT & ADVERTISING",
            "BRANDING": "BRANDING & IDENTITY",
            "SOCIAL MEDIA": "SOCIAL MEDIA",
            "POSTERS": "POSTERS & CAMPAIGNS",
            "TYPOGRAPHY": "TYPOGRAPHY & EDITORIAL",
            "PACKAGING": "PACKAGING & MOCKUPS",
            "PHOTOGRAPHY": "PHOTOGRAPHY & ART DIRECTION",
            "CREATIVE CONCEPTS": "CREATIVE CONCEPTS",
            "PORTFOLIO": "PORTFOLIO & PRESENTATION",
            "DESIGN THINKING": "DESIGN THINKING"
        };

        const target = mapping[filterVal] || filterVal;
        return promptCategory.toUpperCase() === target.toUpperCase();
    };

    /**
     * Filter & Render prompts based on category and search query
     */
    const renderPrompts = () => {
        if (!mainGrid) return;
        mainGrid.innerHTML = "";

        const query = currentSearchTerm.trim().toLowerCase();

        const filtered = allPrompts.filter(item => {
            const catMatch = matchesCategory(item.category, currentCategory);
            if (!catMatch) return false;

            if (!query) return true;

            const inTitle = item.title.toLowerCase().includes(query);
            const inDesc = item.description.toLowerCase().includes(query);
            const inCat = item.category.toLowerCase().includes(query);
            const inTags = item.tags.some(t => t.toLowerCase().includes(query));
            const inPrompt = item.prompt.toLowerCase().includes(query);

            return inTitle || inDesc || inCat || inTags || inPrompt;
        });

        // Update count badge
        if (promptCountBadge) {
            if (currentCategory === "ALL" && !query) {
                promptCountBadge.textContent = `${allPrompts.length} PROMPTS`;
            } else {
                promptCountBadge.textContent = `${filtered.length} OF ${allPrompts.length} PROMPTS`;
            }
        }

        // Handle Featured section visibility
        if (featuredSection) {
            // Hide featured section when user has active search or specific category
            if (currentCategory !== "ALL" || query.length > 0) {
                featuredSection.style.display = "none";
            } else {
                featuredSection.style.display = "block";
            }
        }

        // Empty state
        if (filtered.length === 0) {
            const emptyState = document.createElement("div");
            emptyState.className = "prompts-empty-state";
            emptyState.innerHTML = `
                <i data-lucide="search-x" class="empty-state-icon"></i>
                <h3 class="empty-state-title">No prompts found.</h3>
                <p class="empty-state-text">Try a different keyword or explore another category.</p>
                <button type="button" class="btn-reset-filters" id="btn-reset-all">
                    VIEW ALL PROMPTS
                </button>
            `;

            mainGrid.appendChild(emptyState);

            const resetBtn = emptyState.querySelector("#btn-reset-all");
            if (resetBtn) {
                resetBtn.addEventListener("click", () => {
                    resetFilters();
                });
            }
        } else {
            // Render filtered cards
            filtered.forEach(item => {
                const card = createPromptCard(item, false);
                mainGrid.appendChild(card);
            });
        }

        if (window.lucide) lucide.createIcons();
    };

    /**
     * Reset all filters to default
     */
    const resetFilters = () => {
        currentCategory = "ALL";
        currentSearchTerm = "";

        if (searchInput) searchInput.value = "";
        if (searchClearBtn) searchClearBtn.classList.remove("visible");

        categoryButtons.forEach(btn => {
            if (btn.getAttribute("data-cat") === "ALL") {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        renderPrompts();
    };

    /**
     * Open Modal with full Prompt details
     */
    const openModal = (item) => {
        if (!modalOverlay) return;

        modalNum.textContent = formatNumber(item.number);
        modalCategory.textContent = item.category;
        modalTitle.textContent = item.title;
        modalDesc.textContent = item.description;
        modalUseCase.textContent = item.useCase || "Ideal for concept visualization, client presentations, and campaign development.";
        modalPromptContent.textContent = item.prompt;
        modalDesignTip.textContent = item.designTip || "Focus on visual hierarchy, generous negative space, and typographic readability.";
        modalProMove.textContent = item.proMove || "Import into Photoshop or Illustrator to integrate authentic vector brand assets.";

        // Render tags
        modalTags.innerHTML = item.tags.map(tag => `<span class="card-tag-pill">${escapeHTML(tag)}</span>`).join("");

        // Setup modal copy button
        modalCopyBtn.onclick = (e) => {
            e.stopPropagation();
            copyToClipboard(item.prompt, modalCopyBtn);
        };

        modalOverlay.classList.add("active");
        document.body.style.overflow = "hidden";

        if (window.lucide) lucide.createIcons();
    };

    /**
     * Close Modal
     */
    const closeModal = () => {
        if (!modalOverlay) return;
        modalOverlay.classList.remove("active");
        document.body.style.overflow = "";
    };

    // Modal Close Events
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Keyboard Escape to close modal
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains("active")) {
            closeModal();
        }
    });

    // Category Filter Click Events
    categoryButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.getAttribute("data-cat");
            renderPrompts();
        });
    });

    // Real-time Search Input Event
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentSearchTerm = e.target.value;
            if (searchClearBtn) {
                if (currentSearchTerm.length > 0) {
                    searchClearBtn.classList.add("visible");
                } else {
                    searchClearBtn.classList.remove("visible");
                }
            }
            renderPrompts();
        });
    }

    // Clear Search Input Button Event
    if (searchClearBtn) {
        searchClearBtn.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value = "";
                searchInput.focus();
            }
            currentSearchTerm = "";
            searchClearBtn.classList.remove("visible");
            renderPrompts();
        });
    }

    // Smooth Scroll for anchor CTAs
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (!targetId || targetId === "#") return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Initial Renders
    renderFeaturedPrompts();
    renderPrompts();
});
