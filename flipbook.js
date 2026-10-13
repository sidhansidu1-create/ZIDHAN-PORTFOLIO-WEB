/**
 * ==========================================================================
 * INTERACTIVE FLIPBOOK CONTROLLER — ZIDHANZID DESIGN PRINCIPLES
 * Powered by Mozilla PDF.js & StPageFlip
 * ==========================================================================
 */

(function () {
  'use strict';

  // Config & State
  const PDF_URL = 'pdf/DESIGN%20PRINCIPLES.pdf';
  let pdfDoc = null;
  let pageFlip = null;
  let totalPages = 0;
  let currentPageIndex = 0;
  let isSoundEnabled = localStorage.getItem('zidhan_flipbook_sound') !== 'muted';
  let audioCtx = null;

  // DOM Elements
  const bookContainer = document.getElementById('flipbook-book');
  const loaderOverlay = document.getElementById('loader-overlay');
  const loaderStatus = document.getElementById('loader-status');
  const progressBarFill = document.getElementById('progress-bar-fill');
  
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

  // Set Local PDF.js Worker (Same-Origin to avoid CORS / SecurityError)
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'utils/vendor/pdf.worker.min.js';
  }

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

  // Corner Peel Sound (peelStart - triggers as soon as you drag a corner)
  function playPeelSound() {
    if (!isSoundEnabled) return;
    const now = Date.now();
    if (now - lastPeelTime < 400) return; // Prevent spamming while holding corner
    lastPeelTime = now;

    try {
      audioSm.currentTime = 0;
      audioSm.play().catch(() => {});
    } catch (e) {}
  }

  // Page Turn Sound (turning - triggers when the page flips over)
  function playTurnSound(isMultiPage = false) {
    if (!isSoundEnabled) return;

    try {
      const audio = isMultiPage ? audioLg : audioMd;
      audio.currentTime = 0;
      const p = audio.play();
      if (p !== undefined) {
        p.catch(() => {
          synthesizePaperSoundFallback();
        });
      }
    } catch (e) {
      synthesizePaperSoundFallback();
    }
  }

  // Graceful Web Audio Fallback if browser blocks media element
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

  // Show Toast
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // Update UI Controls based on current page
  function updateUI(pageIndex) {
    currentPageIndex = pageIndex;
    const displayPage = pageIndex + 1;

    if (pageInput) pageInput.value = displayPage;
    if (pageSlider) pageSlider.value = displayPage;

    // Button states
    const isAtStart = pageIndex === 0;
    const isAtEnd = pageIndex >= totalPages - 1;

    if (prevArrow) prevArrow.classList.toggle('disabled', isAtStart);
    if (nextArrow) nextArrow.classList.toggle('disabled', isAtEnd);
    if (dockPrev) dockPrev.disabled = isAtStart;
    if (dockNext) dockNext.disabled = isAtEnd;
    if (dockFirst) dockFirst.disabled = isAtStart;
    if (dockLast) dockLast.disabled = isAtEnd;
  }

  // Render a specific PDF page onto a canvas
  async function renderPdfPage(pageNum, canvas) {
    const page = await pdfDoc.getPage(pageNum);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2.0); // sharp on Retina
    const viewport = page.getViewport({ scale: 1.0 });

    const baseWidth = 550;
    const scale = (baseWidth / viewport.width) * pixelRatio;
    const scaledViewport = page.getViewport({ scale: scale });

    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    await page.render({
      canvasContext: ctx,
      viewport: scaledViewport
    }).promise;
  }

  // Initialize Flipbook
  async function initFlipbook() {
    try {
      // Check for file:// protocol limitation
      if (window.location.protocol === 'file:') {
        throw new Error('FILE_PROTOCOL_BLOCKED');
      }

      loaderStatus.textContent = 'Connecting to PDF stream...';
      progressBarFill.style.width = '10%';

      // Configure PDF loading task with live progress
      const loadingTask = pdfjsLib.getDocument({
        url: PDF_URL,
        rangeChunkSize: 65536 * 4,
        disableAutoFetch: false,
        disableStream: false
      });

      loadingTask.onProgress = function (p) {
        if (p.total > 0) {
          const loadedMB = (p.loaded / (1024 * 1024)).toFixed(1);
          const totalMB = (p.total / (1024 * 1024)).toFixed(1);
          const pct = Math.min(Math.round((p.loaded / p.total) * 45), 45);
          progressBarFill.style.width = `${pct}%`;
          loaderStatus.textContent = `Downloading Design Principles (${loadedMB} MB / ${totalMB} MB)...`;
        }
      };

      pdfDoc = await loadingTask.promise;
      totalPages = pdfDoc.numPages;

      totalPagesLabel.textContent = totalPages;
      if (pageSlider) {
        pageSlider.max = totalPages;
        pageSlider.value = 1;
      }

      progressBarFill.style.width = '50%';
      loaderStatus.textContent = `Parsing ${totalPages} pages...`;

      // Get page 1 aspect ratio
      const firstPage = await pdfDoc.getPage(1);
      const viewport = firstPage.getViewport({ scale: 1.0 });
      // Aspect ratio (1350 / 1080 = 1.25)
      const aspectRatio = viewport.height / viewport.width;

      // Calculate balanced, comfortable book dimensions (sweet spot: medium size)
      function getBookDimensions() {
        const isMobile = window.innerWidth < 768;
        const stageEl = document.querySelector('.fb-stage');
        const sH = stageEl && stageEl.clientHeight > 100 ? stageEl.clientHeight : (window.innerHeight - 108);
        const sW = stageEl && stageEl.clientWidth > 100 ? stageEl.clientWidth : window.innerWidth;

        // Leave a clean 24px margin (12px top, 12px bottom) and space for side arrows
        const maxH = Math.max(300, sH - 24);
        const maxW = Math.max(300, sW - (isMobile ? 24 : 130));

        // Sweet spot: 530px on desktop (not too small, easy to read, with clean margins)
        let pageH = Math.min(isMobile ? 440 : 530, maxH);
        let pageW = Math.round(pageH / aspectRatio);

        const spreadMultiplier = isMobile ? 1 : 2;
        if (pageW * spreadMultiplier > maxW) {
          pageW = Math.floor(maxW / spreadMultiplier);
          pageH = Math.round(pageW * aspectRatio);
        }

        return { width: pageW, height: pageH };
      }

      const bookDims = getBookDimensions();

      // Base single page dimensions for high-DPI canvas rendering
      const baseWidth = Math.max(bookDims.width, 500);
      const baseHeight = Math.round(baseWidth * aspectRatio);

      // Create page wrapper elements
      bookContainer.innerHTML = '';
      const pageCanvases = [];

      for (let i = 1; i <= totalPages; i++) {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'fb-page';
        
        // Flexible paper curling physics for ALL pages (no stiff/rigid boards)
        pageDiv.setAttribute('data-density', 'soft');

        const innerDiv = document.createElement('div');
        innerDiv.className = 'fb-page-inner';

        const canvas = document.createElement('canvas');
        canvas.id = `fb-canvas-${i}`;

        innerDiv.appendChild(canvas);
        pageDiv.appendChild(innerDiv);
        bookContainer.appendChild(pageDiv);

        pageCanvases.push({ pageNum: i, canvas: canvas });
      }

      // Render all pages with progress updates
      for (let i = 0; i < pageCanvases.length; i++) {
        const { pageNum, canvas } = pageCanvases[i];
        loaderStatus.textContent = `Rendering page ${pageNum} of ${totalPages}...`;
        const percent = 50 + Math.round(((i + 1) / totalPages) * 45);
        progressBarFill.style.width = `${percent}%`;

        await renderPdfPage(pageNum, canvas);
      }

      progressBarFill.style.width = '100%';
      loaderStatus.textContent = 'Assembling 3D Book...';

      // Initialize StPageFlip with fixed, perfectly-sized bounds
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
        flippingTime: 750
      });

      pageFlip.loadFromHTML(pageElements);

      let lastRecordedPage = 0;

      // Peel corner touch sound (Heyzine peelStart)
      pageFlip.on('changeState', (e) => {
        if (e.data === 'user_fold' || e.data === 'fold_corner') {
          playPeelSound();
        }
      });

      // Page flip event (Heyzine turning)
      pageFlip.on('flip', (e) => {
        const newPage = e.data;
        const pageJump = Math.abs(newPage - lastRecordedPage);
        playTurnSound(pageJump > 2);
        lastRecordedPage = newPage;
        updateUI(newPage);
      });

      // Initial update
      updateUI(0);

      // Smooth adaptation on window resize / fullscreen toggle
      let resizeTimer = null;
      let prevW = window.innerWidth;
      let prevH = window.innerHeight;

      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (!pageFlip || !pdfDoc) return;
          if (Math.abs(window.innerWidth - prevW) > 30 || Math.abs(window.innerHeight - prevH) > 30) {
            prevW = window.innerWidth;
            prevH = window.innerHeight;
            const currentP = pageFlip.getCurrentPageIndex() || 0;
            const newDims = getBookDimensions();

            try {
              pageFlip.destroy();
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
                flippingTime: 750
              });
              const pEls = bookContainer.querySelectorAll('.fb-page');
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
          }
        }, 300);
      });

      // Hide Loader with elegant fade
      setTimeout(() => {
        loaderOverlay.classList.add('hidden');
      }, 400);

    } catch (err) {
      console.error('Failed to load flipbook:', err);

      if (err.message === 'FILE_PROTOCOL_BLOCKED' || window.location.protocol === 'file:') {
        loaderStatus.innerHTML = `
          <div style="font-size:0.9rem; color:#ff6b6b; font-weight:700; margin-bottom:0.5rem;">
            ⚠️ Local Browser Security Notice
          </div>
          <div style="font-size:0.78rem; color:#94a3b8; line-height:1.5; margin-bottom:1rem;">
            Modern browsers block reading local PDF files when opened by double-clicking (<code>file://</code>).
          </div>
          <div style="font-size:0.8rem; background:rgba(0,245,255,0.08); border:1px solid rgba(0,245,255,0.25); border-radius:8px; padding:0.6rem; color:#fff;">
            Run in terminal:<br>
            <strong style="color:#00f5ff;">node preview.js</strong><br>
            Then open: <strong style="color:#00f5ff;">http://localhost:3000/design-principles.html</strong>
          </div>
        `;
      } else {
        loaderStatus.innerHTML = `
          <div style="font-size:0.85rem; color:#ff6b6b; margin-bottom:0.5rem;">
            Failed to load PDF (${err.message || 'Network Error'})
          </div>
          <div style="font-size:0.75rem; color:#94a3b8;">
            Please ensure <code>node preview.js</code> is running or refresh the page.
          </div>
        `;
      }

      progressBarFill.style.background = '#ff6b6b';
      progressBarFill.style.width = '100%';
    }
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Navigation arrows
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

    // Dock buttons
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
        if (pageFlip) pageFlip.flip(totalPages - 1);
      });
    }

    // Slider
    if (pageSlider) {
      pageSlider.addEventListener('input', (e) => {
        const targetPage = parseInt(e.target.value, 10) - 1;
        if (pageFlip && targetPage >= 0 && targetPage < totalPages) {
          pageFlip.flip(targetPage);
        }
      });
    }

    // Page number text input
    if (pageInput) {
      pageInput.addEventListener('change', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = 1;
        val = Math.max(1, Math.min(val, totalPages));
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
        if (pageFlip) pageFlip.flip(totalPages - 1);
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

    // Fullscreen toggle
    if (fullscreenBtn) {
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

    // Share button
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Link copied to clipboard!');
          });
        } else {
          showToast('Share: ' + window.location.href);
        }
      });
    }

    // Resume AudioContext on first user interaction
    const unlockAudio = () => {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
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
