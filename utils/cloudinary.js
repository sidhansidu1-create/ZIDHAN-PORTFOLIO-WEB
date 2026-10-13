/**
 * Global Cloudinary Transform Helper - Muhammed Sidhan Portfolio
 * 
 * Automatically transforms raw or existing Cloudinary URLs to request lightweight,
 * auto-formatted (WebP/AVIF), auto-quality responsive assets with max-width bounding.
 * 
 * @param {string} url - Target image URL
 * @param {number} [width=1400] - Target bounding width constraint (default: 1400)
 * @returns {string} - Optimized Cloudinary URL or original URL untouched if not applicable
 */
function optimizeCloudinaryUrl(url, width = 1400) {
  if (!url || typeof url !== 'string') return url;

  // Only transform Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url;

  // Audio/video bypass - do not inject image transformations into audio or media stream URLs
  if (/\.(mp3|wav|ogg|aac|flac|m4a)(\?.*)?$/i.test(url) || url.includes('/video/upload/')) {
    return url;
  }

  const uploadMarker = '/upload/';
  const uploadIndex = url.indexOf(uploadMarker);
  if (uploadIndex === -1) return url;

  const prefix = url.substring(0, uploadIndex + uploadMarker.length);
  const remainder = url.substring(uploadIndex + uploadMarker.length);

  const targetTransform = `f_auto,q_auto,w_${width},c_limit`;

  // Check for version segment: e.g. /v1234567890/ or v1234567890/
  const versionMatch = remainder.match(/(?:^|\/)(v\d+\/.*)$/);

  if (versionMatch) {
    const versionAndAfter = versionMatch[1];
    const transformSegment = remainder.substring(0, remainder.length - versionAndAfter.length).replace(/\/$/, '');

    if (transformSegment) {
      if (transformSegment.includes('f_auto')) {
        // If exact target transform is already present, return unchanged
        if (transformSegment === targetTransform) {
          return url;
        }
        // Replace existing f_auto segment to avoid duplicate parameters
        return `${prefix}${targetTransform}/${versionAndAfter}`;
      } else {
        // Existing transform without f_auto (e.g. w_36,h_36,c_fit)
        return `${prefix}${targetTransform}/${transformSegment}/${versionAndAfter}`;
      }
    } else {
      // Direct version with no prior transformation
      return `${prefix}${targetTransform}/${versionAndAfter}`;
    }
  } else {
    // No version segment found (e.g. /upload/filename.png or /upload/f_auto,q_auto/filename.png)
    const slashIdx = remainder.indexOf('/');
    if (slashIdx !== -1) {
      const firstSegment = remainder.substring(0, slashIdx);
      const afterFirstSegment = remainder.substring(slashIdx + 1);
      if (firstSegment.includes('f_auto')) {
        if (firstSegment === targetTransform) return url;
        return `${prefix}${targetTransform}/${afterFirstSegment}`;
      }
    }
    return `${prefix}${targetTransform}/${remainder}`;
  }
}

// CommonJS export for Node.js build tools and test runners
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { optimizeCloudinaryUrl };
}

// Browser global exposure
if (typeof window !== 'undefined') {
  window.optimizeCloudinaryUrl = optimizeCloudinaryUrl;
}
