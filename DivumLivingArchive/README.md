# Divum Living Archive · 2008–2026

Five-page, static, dependency-free editorial site for Firebase Hosting.

## Preview
Serve this directory using a local static server. For example:
```sh
python3 -m http.server 8080
```
Open http://localhost:8080/

## Firebase deployment
From this directory:
```sh
firebase login
firebase use YOUR_FIREBASE_PROJECT_ID
firebase deploy --only hosting
```
This branch does not deploy anything or modify the live site.

## Pages
- index.html: editorial landing page and interactive era explorer
- journey.html: sourced three-lane technology/market/Divum chronology
- work.html: filterable domain narratives
- approach.html: engineering principles and current business identities
- archive.html: primary links and claim provenance

## Editorial approval checklist
- Confirm Divum founding month/date before using any month-level founding claim.
- Obtain permission for named client logos, case studies, awards and outcomes.
- Validate historical solution counts; older site reported 1,400+, newer site reported 1,500+. Current build deliberately uses the earlier number and attributes it.
- Replace interpretive Divum-era correlations with dated project evidence when available.
- Preserve old Divum.in URLs using redirects and SEO mapping, after inventorying the live site.
- Review legal entity naming and privacy/cookie requirements before publishing.

## Accessibility & performance
- Responsive semantic HTML, keyboard-accessible navigation and era buttons
- Reduced-motion support
- No remote fonts, JS frameworks or external runtime dependencies
- CSS-based spatial visual rather than resource-heavy WebGL; no mandatory GPU
- Verify on Safari, Chrome, Firefox, iOS and Android before production.
