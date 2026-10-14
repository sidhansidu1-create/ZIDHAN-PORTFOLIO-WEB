/**
 * ==========================================================================
 * INTERACTIVE FLIPBOOK CONTROLLER — ZIDHANZID DESIGN PRINCIPLES
 * Ultra-Fast Instant WebP Engine with StPageFlip & Authentic Heyzine SFX
 * ==========================================================================
 */

(function () {
  'use strict';

  // Config & State
  const TOTAL_PAGES = 16;
  const ASPECT_RATIO = 1350 / 1080; // 1.25 (Exact 4:5 Brand Book Aspect Ratio)
  let pageFlip = null;
  let currentPageIndex = 0;
  let isSoundEnabled = localStorage.getItem('zidhan_flipbook_sound') !== 'muted';
  let audioCtx = null;

  // DOM Elements
  const bookContainer = document.getElementById('flipbook-book');
  const loaderOverlay = document.getElementById('loader-overlay');
  
  const pageInput = document.getElementById('page-input');
  const totalPagesLabel = document.getElementById('total-pages-label');
  const pageSlider = document.getElementById('page-slider');
  
  const prevArrow = document.getElementById('prev-arrow');
  const nextArrow = document.getElementById('next-arrow');
  const dockPrev = document.getElementById('dock-prev');
  const dockNext = document.getElementById('dock-next');
  const dockFirst = document.getElementById('dock-first');
  const dockLast = document.getElementById('dock-last');
  
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const shareBtn = document.getElementById('share-btn');
  const toast = document.getElementById('toast');
  const swipeHint = document.getElementById('swipe-hint');

  // Zoom / Inspection Lightbox Elements
  const zoomBtn = document.getElementById('zoom-btn');
  const zoomModal = document.getElementById('zoom-modal');
  const zoomBackdrop = document.getElementById('zoom-backdrop');
  const zoomCloseBtn = document.getElementById('zoom-close-btn');
  const zoomImg = document.getElementById('zoom-img') || document.getElementById('zoom-canvas');
  const zoomPrevBtn = document.getElementById('zoom-prev-btn');
  const zoomNextBtn = document.getElementById('zoom-next-btn');
  const zoomTitle = document.getElementById('zoom-title');
  const zoomPageBadge = document.getElementById('zoom-page-badge');
  const zoomImgWrap = document.getElementById('zoom-img-wrap');
  let currentZoomPage = 0;
  let zoomScale = 1;
  let zoomPanX = 0;
  let zoomPanY = 0;

  // Authentic Heyzine SFX Audio Engine (Matched to screen recording)
  const SFX_FILES = {
    sm: 'flipbook%20sfx/flip-ct-sm.mp3', // Corner peel & touch rustle
    md: 'flipbook%20sfx/flip-ct-md.mp3', // Standard page turn swoosh
    lg: 'flipbook%20sfx/flip-ct-lg.mp3'  // Multi-page jump / fast flip
  };

  const audioSm = new Audio(SFX_FILES.sm);
  const audioMd = new Audio(SFX_FILES.md);
  const audioLg = new Audio(SFX_FILES.lg);

  audioSm.preload = 'auto';
  audioSm.volume = 0.35;
  audioMd.preload = 'auto';
  audioMd.volume = 0.65;
  audioLg.preload = 'auto';
  audioLg.volume = 0.75;

  let lastPeelTime = 0;

  function playPeelSound() {
    if (!isSoundEnabled) return;
    const now = Date.now();
    if (now - lastPeelTime < 400) return;
    lastPeelTime = now;
    try {
      audioSm.currentTime = 0;
      audioSm.play().catch(() => {});
    } catch (e) {}
  }

  function playTurnSound(isMultiPage = false) {
    if (!isSoundEnabled) return;
    try {
      const audio = isMultiPage ? audioLg : audioMd;
      audio.currentTime = 0;
      const p = audio.play();
      if (p !== undefined) {
        p.catch(() => synthesizePaperSoundFallback());
      }
    } catch (e) {
      synthesizePaperSoundFallback();
    }
  }

  function synthesizePaperSoundFallback() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const bufferSize = audioCtx.sampleRate * 0.15;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = buffer;

      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1200, audioCtx.currentTime);
      bandpass.frequency.exponentialRampToValueAtTime(420, audioCtx.currentTime + 0.14);
      bandpass.Q.value = 1.3;

      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

      noiseSource.connect(bandpass);
      bandpass.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      noiseSource.start();
      noiseSource.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  function updateUI(pageIndex) {
    currentPageIndex = pageIndex;
    const displayPage = pageIndex + 1;

    if (pageInput) pageInput.value = displayPage;
    if (pageSlider) pageSlider.value = displayPage;

    const isAtStart = pageIndex === 0;
    const isAtEnd = pageIndex >= TOTAL_PAGES - 1;

    if (prevArrow) prevArrow.classList.toggle('disabled', isAtStart);
    if (nextArrow) nextArrow.classList.toggle('disabled', isAtEnd);
    if (dockPrev) dockPrev.disabled = isAtStart;
    if (dockNext) dockNext.disabled = isAtEnd;
    if (dockFirst) dockFirst.disabled = isAtStart;
    if (dockLast) dockLast.disabled = isAtEnd;
  }

  // Calculate balanced book dimensions (optimized for desktop & mobile)
  function getBookDimensions() {
    const wW = window.innerWidth;
    const wH = window.innerHeight;
    const isPortrait = wH > wW || wW < 768;
    const stageEl = document.querySelector('.fb-stage');
    const sH = stageEl && stageEl.clientHeight > 100 ? stageEl.clientHeight : (wH - (wW < 768 ? 106 : 108));
    const sW = stageEl && stageEl.clientWidth > 100 ? stageEl.clientWidth : wW;

    if (isPortrait) {
      // Portrait mode: Single-page view maximized to smartphone / tablet display
      const availW = Math.max(260, sW - 24);
      const availH = Math.max(300, sH - 24);

      let pageW = availW;
      let pageH = Math.round(pageW * ASPECT_RATIO);

      if (pageH > availH) {
        pageH = availH;
        pageW = Math.round(pageH / ASPECT_RATIO);
      }

      return { width: pageW, height: pageH };
    } else {
      // Landscape mode: Two-page spread (Desktop / Laptop / Rotated phone)
      const availW = Math.max(300, sW - (wH < 500 ? 30 : 130));
      const availH = Math.max(260, sH - 24);

      // Desktop sweet-spot: 530px height
      let pageH = Math.min(530, availH);
      let pageW = Math.round(pageH / ASPECT_RATIO);

      if (pageW * 2 > availW) {
        pageW = Math.floor(availW / 2);
        pageH = Math.round(pageW * ASPECT_RATIO);
      }

      return { width: pageW, height: pageH };
    }
  }

  // Build the 16 pages with WebP & JPG fallback
  function createPageElements() {
    bookContainer.innerHTML = '';
    for (let i = 1; i <= TOTAL_PAGES; i++) {
      const pageDiv = document.createElement('div');
      pageDiv.className = 'fb-page';
      pageDiv.setAttribute('data-density', 'soft');

      const innerDiv = document.createElement('div');
      innerDiv.className = 'fb-page-inner';

      const picture = document.createElement('picture');
      const source = document.createElement('source');
      source.srcset = `images/design-principles/page-${i}.webp`;
      source.type = 'image/webp';

      const img = document.createElement('img');
      img.src = `images/design-principles/page-${i}.jpg`;
      img.alt = `Design Principles Page ${i}`;
      img.draggable = false;
      img.loading = i <= 4 ? 'eager' : 'lazy';

      picture.appendChild(source);
      picture.appendChild(img);
      innerDiv.appendChild(picture);
      pageDiv.appendChild(innerDiv);
      bookContainer.appendChild(pageDiv);
    }
  }

  // Initialize Flipbook instantly
  function initFlipbook() {
    try {
      if (totalPagesLabel) totalPagesLabel.textContent = TOTAL_PAGES;
      if (pageSlider) {
        pageSlider.max = TOTAL_PAGES;
        pageSlider.value = 1;
      }

      const bookDims = getBookDimensions();
      createPageElements();

      const pageElements = bookContainer.querySelectorAll('.fb-page');
      pageFlip = new St.PageFlip(bookContainer, {
        width: bookDims.width,
        height: bookDims.height,
        size: 'fixed',
        drawShadow: true,
        maxShadowOpacity: 0.55,
        showCover: true,
        usePortrait: true,
        startPage: 0,
        mobileScrollSupport: false,
        swipeDistance: 25,
        flippingTime: 700
      });

      pageFlip.loadFromHTML(pageElements);

      let lastRecordedPage = 0;

      pageFlip.on('changeState', (e) => {
        if (e.data === 'user_fold' || e.data === 'fold_corner') {
          playPeelSound();
        }
      });

      pageFlip.on('flip', (e) => {
        const newPage = e.data;
        const pageJump = Math.abs(newPage - lastRecordedPage);
        playTurnSound(pageJump > 2);
        lastRecordedPage = newPage;
        updateUI(newPage);
      });

      updateUI(0);

      // Preload Page 1 and reveal book instantly (< 100ms)
      const coverPreload = new Image();
      const revealBook = () => {
        if (loaderOverlay) {
          loaderOverlay.classList.add('hidden');
        }
      };
      coverPreload.onload = revealBook;
      coverPreload.onerror = revealBook;
      coverPreload.src = 'images/design-principles/page-1.webp';
      setTimeout(revealBook, 250); // Fallback guarantee

      // Mobile Swipe Cue Hint
      if (swipeHint) {
        if (window.innerWidth <= 768 && !sessionStorage.getItem('zidhan_flipbook_hint_seen')) {
          swipeHint.style.display = 'inline-flex';
          const dismissHint = () => {
            swipeHint.classList.add('fade-out');
            setTimeout(() => { swipeHint.style.display = 'none'; }, 600);
            sessionStorage.setItem('zidhan_flipbook_hint_seen', 'true');
          };
          setTimeout(dismissHint, 3800);
          bookContainer.addEventListener('touchstart', dismissHint, { once: true, passive: true });
        } else {
          swipeHint.style.display = 'none';
        }
      }

      // Mobile Double-Tap to Inspect / Zoom
      let lastTapTime = 0;
      bookContainer.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTapTime < 320) {
          e.preventDefault();
          openZoomModal(currentPageIndex);
        }
        lastTapTime = now;
      }, { passive: false });

      // Smooth adaptation on resize & orientation change
      let resizeTimer = null;
      let prevW = window.innerWidth;
      let prevH = window.innerHeight;

      const handleAdaptation = () => {
        if (!pageFlip) return;
        const currentP = pageFlip.getCurrentPageIndex() || 0;
        const newDims = getBookDimensions();

        try {
          pageFlip.destroy();
          createPageElements();
          const pEls = bookContainer.querySelectorAll('.fb-page');
          pageFlip = new St.PageFlip(bookContainer, {
            width: newDims.width,
            height: newDims.height,
            size: 'fixed',
            drawShadow: true,
            maxShadowOpacity: 0.55,
            showCover: true,
            usePortrait: true,
            startPage: currentP,
            mobileScrollSupport: false,
            swipeDistance: 25,
            flippingTime: 700
          });
          pageFlip.loadFromHTML(pEls);
          pageFlip.on('changeState', (e) => {
            if (e.data === 'user_fold' || e.data === 'fold_corner') {
              playPeelSound();
            }
          });
          pageFlip.on('flip', (e) => {
            const newPage = e.data;
            const pageJump = Math.abs(newPage - lastRecordedPage);
            playTurnSound(pageJump > 2);
            lastRecordedPage = newPage;
            updateUI(newPage);
          });
          updateUI(currentP);
        } catch (err) {
          console.error('Resize adaptation failed:', err);
        }
      };

      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (Math.abs(window.innerWidth - prevW) > 20 || Math.abs(window.innerHeight - prevH) > 20) {
            prevW = window.innerWidth;
            prevH = window.innerHeight;
            handleAdaptation();
          }
        }, 250);
      });

      window.addEventListener('orientationchange', () => {
        setTimeout(handleAdaptation, 250);
      });

    } catch (err) {
      console.error('Failed to load flipbook:', err);
      if (loaderOverlay) loaderOverlay.classList.add('hidden');
    }
  }

  // Setup UI Event Listeners
  function setupEventListeners() {
    if (prevArrow) {
      prevArrow.addEventListener('click', () => {
        if (pageFlip) pageFlip.flipPrev();
      });
    }

    if (nextArrow) {
      nextArrow.addEventListener('click', () => {
        if (pageFlip) pageFlip.flipNext();
      });
    }

    if (dockPrev) {
      dockPrev.addEventListener('click', () => {
        if (pageFlip) pageFlip.flipPrev();
      });
    }

    if (dockNext) {
      dockNext.addEventListener('click', () => {
        if (pageFlip) pageFlip.flipNext();
      });
    }

    if (dockFirst) {
      dockFirst.addEventListener('click', () => {
        if (pageFlip) pageFlip.flip(0);
      });
    }

    if (dockLast) {
      dockLast.addEventListener('click', () => {
        if (pageFlip) pageFlip.flip(TOTAL_PAGES - 1);
      });
    }

    if (pageSlider) {
      pageSlider.addEventListener('input', (e) => {
        const targetPage = parseInt(e.target.value, 10) - 1;
        if (pageFlip && targetPage >= 0 && targetPage < TOTAL_PAGES) {
          pageFlip.flip(targetPage);
        }
      });
    }

    if (pageInput) {
      pageInput.addEventListener('change', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = 1;
        val = Math.max(1, Math.min(val, TOTAL_PAGES));
        if (pageFlip) pageFlip.flip(val - 1);
      });

      pageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          pageInput.blur();
        }
      });
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (document.activeElement === pageInput) return;

      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (pageFlip) pageFlip.flipPrev();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        if (pageFlip) pageFlip.flipNext();
      } else if (e.key === 'Home') {
        if (pageFlip) pageFlip.flip(0);
      } else if (e.key === 'End') {
        if (pageFlip) pageFlip.flip(TOTAL_PAGES - 1);
      }
    });

    // Sound toggle
    function updateSoundBtn() {
      if (soundIconOn && soundIconOff) {
        soundIconOn.style.display = isSoundEnabled ? 'block' : 'none';
        soundIconOff.style.display = isSoundEnabled ? 'none' : 'block';
      }
      if (soundToggleBtn) {
        soundToggleBtn.setAttribute(
          'data-tooltip',
          isSoundEnabled ? 'Turn Sound Off' : 'Turn Sound On'
        );
      }
    }

    updateSoundBtn();

    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        localStorage.setItem(
          'zidhan_flipbook_sound',
          isSoundEnabled ? 'unmuted' : 'muted'
        );
        updateSoundBtn();
        showToast(isSoundEnabled ? 'Page Turn Sound: ON' : 'Page Turn Sound: MUTED');
        if (isSoundEnabled) playTurnSound(false);
      });
    }

    // HD Zoom / Inspection Lightbox Controller
    function renderZoomPage(pageIndex) {
      currentZoomPage = pageIndex;
      const pageNum = pageIndex + 1;

      if (zoomTitle) zoomTitle.textContent = `Design Principles — Page ${pageNum}`;
      if (zoomPageBadge) zoomPageBadge.textContent = `${pageNum} / ${TOTAL_PAGES}`;
      if (zoomPrevBtn) zoomPrevBtn.disabled = pageIndex === 0;
      if (zoomNextBtn) zoomNextBtn.disabled = pageIndex >= TOTAL_PAGES - 1;

      zoomScale = 1;
      zoomPanX = 0;
      zoomPanY = 0;
      applyZoomTransform();

      if (zoomImg) {
        zoomImg.src = `images/design-principles/page-${pageNum}.webp`;
      }
    }

    function applyZoomTransform() {
      if (!zoomImgWrap) return;
      zoomImgWrap.style.transform = `translate(${zoomPanX}px, ${zoomPanY}px) scale(${zoomScale})`;
    }

    function openZoomModal(pageIndex) {
      if (!zoomModal) return;
      currentZoomPage = pageIndex !== undefined ? pageIndex : currentPageIndex;
      zoomModal.hidden = false;
      zoomModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      renderZoomPage(currentZoomPage);
    }

    function closeZoomModal() {
      if (!zoomModal) return;
      zoomModal.classList.remove('active');
      setTimeout(() => {
        zoomModal.hidden = true;
        document.body.style.overflow = '';
        if (pageFlip && pageFlip.getCurrentPageIndex() !== currentZoomPage) {
          pageFlip.flip(currentZoomPage);
        }
      }, 250);
    }

    // Zoom Gestures
    function setupZoomGestures() {
      const zoomBody = document.getElementById('zoom-body');
      if (!zoomBody) return;

      let isDragging = false;
      let startX = 0, startY = 0;
      let initialDist = 0;
      let initialScale = 1;

      zoomBody.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        zoomScale = Math.min(3.5, Math.max(0.8, zoomScale + delta));
        if (zoomScale <= 1) {
          zoomPanX = 0;
          zoomPanY = 0;
        }
        applyZoomTransform();
      }, { passive: false });

      zoomBody.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          isDragging = true;
          startX = e.touches[0].clientX - zoomPanX;
          startY = e.touches[0].clientY - zoomPanY;
        } else if (e.touches.length === 2) {
          isDragging = false;
          initialDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          initialScale = zoomScale;
        }
      }, { passive: true });

      zoomBody.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1 && zoomScale > 1) {
          zoomPanX = e.touches[0].clientX - startX;
          zoomPanY = e.touches[0].clientY - startY;
          applyZoomTransform();
        } else if (e.touches.length === 2) {
          const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          if (initialDist > 0) {
            zoomScale = Math.min(3.5, Math.max(0.8, initialScale * (dist / initialDist)));
            applyZoomTransform();
          }
        }
      }, { passive: true });

      zoomBody.addEventListener('touchend', () => {
        isDragging = false;
        if (zoomScale <= 1) {
          zoomScale = 1;
          zoomPanX = 0;
          zoomPanY = 0;
          applyZoomTransform();
        }
      });

      let lastZoomTap = 0;
      zoomBody.addEventListener('touchend', () => {
        const now = Date.now();
        if (now - lastZoomTap < 300) {
          if (zoomScale > 1.2) {
            zoomScale = 1;
            zoomPanX = 0;
            zoomPanY = 0;
          } else {
            zoomScale = 2.0;
          }
          applyZoomTransform();
        }
        lastZoomTap = now;
      });
    }

    setupZoomGestures();

    if (zoomBtn) {
      zoomBtn.addEventListener('click', () => openZoomModal(currentPageIndex));
    }
    if (zoomCloseBtn) {
      zoomCloseBtn.addEventListener('click', closeZoomModal);
    }
    if (zoomBackdrop) {
      zoomBackdrop.addEventListener('click', closeZoomModal);
    }
    if (zoomPrevBtn) {
      zoomPrevBtn.addEventListener('click', () => {
        if (currentZoomPage > 0) {
          renderZoomPage(currentZoomPage - 1);
          playTurnSound(false);
        }
      });
    }
    if (zoomNextBtn) {
      zoomNextBtn.addEventListener('click', () => {
        if (currentZoomPage < TOTAL_PAGES - 1) {
          renderZoomPage(currentZoomPage + 1);
          playTurnSound(false);
        }
      });
    }

    // Fullscreen toggle
    if (fullscreenBtn) {
      const isFullscreenSupported = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
      if (!isFullscreenSupported) {
        fullscreenBtn.style.display = 'none';
      } else {
        fullscreenBtn.addEventListener('click', () => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
        });

        document.addEventListener('fullscreenchange', () => {
          fullscreenBtn.setAttribute(
            'data-tooltip',
            document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen'
          );
        });
      }
    }

    // Share button
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (navigator.share && window.innerWidth < 768) {
          navigator.share({
            title: 'Design Principles — Muhammed Sidhan',
            text: 'Explore the interactive 3D digital brand book of Design Principles by Muhammed Sidhan (ZIDHANZID).',
            url: window.location.href
          }).catch(() => {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Link copied to clipboard!');
          });
        } else {
          showToast('Share: ' + window.location.href);
        }
      });
    }

    // Resume AudioContext & Unlock HTML5 Audio on first interaction
    const unlockAudio = () => {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      [audioSm, audioMd, audioLg].forEach((a) => {
        try {
          const p = a.play();
          if (p !== undefined) {
            p.then(() => {
              a.pause();
              a.currentTime = 0;
            }).catch(() => {});
          }
        } catch (e) {}
      });
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
  }

  // DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupEventListeners();
      initFlipbook();
    });
  } else {
    setupEventListeners();
    initFlipbook();
  }
})();
