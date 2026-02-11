# Emoji Spy — Implementation Plan

A single-page, client-side web application that encrypts text messages into emoji strings using AES-256 and a user-provided password, and decrypts them back. No backend, no database — everything runs in the browser.

## Assumptions

- **Tailwind CSS**: Using the CDN play script (`cdn.tailwindcss.com`)
- **Single file**: All HTML, CSS, and JS in one `index.html`
- **Base64 padding**: The `=` character gets its own 65th emoji
- **Password toggle**: Eye icon (👁️) to show/hide password
- **AdSense**: Include a placeholder comment/div
- **Animations**: Smooth transitions on tabs, buttons, and accordions

---

## Proposed Changes

### [NEW] [index.html](file:///f:/Game%20dev/Message%20encryption/index.html)

Everything lives in this single file. Below is the build order, broken into logical sections.

---

### Step 1 — HTML Skeleton & CDN Imports

Set up the base HTML5 document with:

```html
<!-- CDN imports in <head> -->
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
```

- `<meta>` tags for charset, viewport (mobile-first), SEO title, and description
- Open Graph tags for WhatsApp/social sharing previews
- Google Fonts import (**Inter** for body text + **JetBrains Mono** for the hacker/code aesthetic)
- Emoji favicon using inline SVG: `<link rel="icon" href="data:image/svg+xml,<svg ...>🕵️</svg>">`

---

### Step 2 — Tailwind Config & Custom Styles

Inside a `<script>` block, configure Tailwind's `darkMode`, extend the theme with:

| Token           | Value                         |
| --------------- | ----------------------------- |
| `bg-primary`    | `slate-900` (dark background) |
| `accent-green`  | `#39FF14` (neon green)        |
| `accent-purple` | `#a855f7` (purple glow)       |
| `font-body`     | Inter                         |
| `font-mono`     | JetBrains Mono / monospace    |

Add a small `<style>` block for:

- Neon glow keyframe animation for the encrypt/decrypt button
- Smooth tab transition (`transition: all 0.3s ease`)
- Pulsing border animation for the output box
- Custom scrollbar styling for dark mode
- Loading spinner animation for the encrypt/decrypt process

---

### Step 3 — Header Section

```
┌─────────────────────────────────┐
│  🕵️ Emoji Spy                   │
│  Send Hidden Messages on WhatsApp │
└─────────────────────────────────┘
```

- Logo text with neon green gradient
- Tagline in muted gray
- Responsive: stacks nicely on mobile

---

### Step 4 — Tab Switcher (Encrypt / Decrypt)

```
┌──────────────┬──────────────┐
│  🔒 ENCRYPT  │  🔓 DECRYPT  │
└──────────────┴──────────────┘
```

- Two large tab buttons side by side
- Active tab: filled background with neon glow
- Inactive tab: outline/ghost style
- JavaScript toggles visibility of `.encrypt-view` and `.decrypt-view` divs
- Smooth slide/fade transition between views

---

### Step 5 — Encrypt View

| Element              | Details                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| **Password Input**   | `type="password"` with eye icon (👁️) toggle button. Label: "Create a Password"                       |
| **Message Textarea** | Large textarea with character counter. Label: "Your Secret Message". Placeholder text provided       |
| **Encrypt Button**   | Large, full-width, neon-green glowing button: "🔒 Encrypt to Emojis". Shows spinner while processing |
| **Output Box**       | Read-only textarea showing emoji string. Initially hidden, appears with animation after encryption   |
| **Copy Button**      | "📋 Copy to Clipboard" — copies emoji string, shows "✅ Copied!" feedback for 2 seconds              |
| **Share Button**     | "📱 Share on WhatsApp" — opens `https://wa.me/?text=<encoded_emojis>` in a new tab                   |

---

### Step 6 — Decrypt View

| Element            | Details                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------- |
| **Password Input** | `type="password"` with eye toggle. Label: "Enter the Password"                                |
| **Emoji Textarea** | Large textarea. Label: "Paste Emoji String". Placeholder: "Paste the emoji message here..."   |
| **Decrypt Button** | Large, full-width, purple glowing button: "🔓 Reveal Message". Shows spinner while processing |
| **Output Box**     | Read-only box showing decrypted plaintext. Shows error state on wrong password                |
| **Copy Button**    | "📋 Copy Message" — copies decrypted plaintext text                                           |

---

### Step 7 — JavaScript: Emoji Map (65 emojis)

Define a `const EMOJI_MAP` object mapping all 65 Base64 characters to unique, common, cross-platform emojis:

```
A-Z  → 26 emojis  (🍎🍌🍇🍊🍋🍑🍒🍓🥝🍍🥭🍈🫐🍅🥑🌽🥕🌶️🧅🧄🥔🍆🥒🥬🥦🫑)
a-z  → 26 emojis  (🚗🚕🚙🚌🚎🏎️🚓🚑🚒🚐🛻🚚🚛🚜🏍️🛵🚲🛴🚂🚃🚄🚅🚆🚇🚈🚉)
0-9  → 10 emojis  (⭐🌙☀️🌈⚡🔥💧❄️🌸🍀)
+    → 1 emoji   (💎)
/    → 1 emoji   (🎯)
=    → 1 emoji   (🏁)
```

Also create a reverse map (`REVERSE_EMOJI_MAP`) for decryption.

> [!NOTE]
> All emojis are chosen to be common and widely supported across iOS, Android, Windows, and WhatsApp so they display correctly on all devices.

---

### Step 8 — JavaScript: Encryption Logic

```javascript
function encryptToEmojis(message, password) {
  // 1. Generate random Salt (128-bit) and IV (128-bit)
  const salt = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);

  // 2. Derive key from password + salt using PBKDF2
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 10000,
  });

  // 3. Encrypt with AES-256-CBC
  const encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv });

  // 4. Combine: salt + iv + ciphertext → single Base64 string
  const combined = salt.concat(iv).concat(encrypted.ciphertext);
  const base64 = CryptoJS.enc.Base64.stringify(combined);

  // 5. Replace each Base64 char with its emoji
  return base64ToEmojis(base64);
}
```

> [!IMPORTANT]
> Using PBKDF2 key derivation with 10,000 iterations + random salt ensures that the same message encrypted twice produces completely different emoji output, as required by the plan.

---

### Step 9 — JavaScript: Decryption Logic

```javascript
function decryptFromEmojis(emojiString, password) {
  // 1. Convert emojis back to Base64
  const base64 = emojisToBase64(emojiString);

  // 2. Parse combined binary
  const combined = CryptoJS.enc.Base64.parse(base64);

  // 3. Extract salt (first 16 bytes), IV (next 16 bytes), ciphertext (rest)
  const salt = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4));
  const iv = CryptoJS.lib.WordArray.create(combined.words.slice(4, 8));
  const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(8));

  // 4. Derive same key from password + extracted salt
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 10000,
  });

  // 5. Decrypt
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
    iv: iv,
  });

  // 6. Return UTF-8 string or throw error
  const result = decrypted.toString(CryptoJS.enc.Utf8);
  if (!result) throw new Error("Decryption Failed");
  return result;
}
```

---

### Step 10 — JavaScript: Helper Functions

| Function                            | Purpose                                                                                                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `base64ToEmojis(base64String)`      | Iterates each char in the Base64 string and replaces it with the corresponding emoji from `EMOJI_MAP`                                                                                |
| `emojisToBase64(emojiString)`       | Segments the emoji string into individual emojis (using `Array.from()` or `Intl.Segmenter` for multi-codepoint emojis) and maps each back to its Base64 char via `REVERSE_EMOJI_MAP` |
| `togglePasswordVisibility(inputId)` | Toggles between `type="password"` and `type="text"` and swaps the eye icon                                                                                                           |
| `switchTab(tabName)`                | Shows/hides encrypt and decrypt views with transition                                                                                                                                |
| `showError(elementId, message)`     | Displays styled error message inline                                                                                                                                                 |
| `clearError(elementId)`             | Clears error message                                                                                                                                                                 |

> [!IMPORTANT]
> The `emojisToBase64` function must use `Intl.Segmenter` or `Array.from()` to correctly split emoji strings, because some emojis (e.g., 🏎️, 🌶️) are multi-codepoint sequences and cannot be split with a simple `.split('')`.

---

### Step 11 — Error Handling & Input Validation

| Scenario                  | Behavior                                                                     |
| ------------------------- | ---------------------------------------------------------------------------- |
| Empty message on encrypt  | Show inline error: "Please enter a message"                                  |
| Empty password on encrypt | Show inline error: "Please enter a password"                                 |
| Empty fields on decrypt   | Show inline error for missing field                                          |
| Wrong password on decrypt | Show styled error: "❌ Decryption Failed — Wrong password or corrupted data" |
| Invalid emoji string      | Show error: "❌ Invalid emoji string"                                        |

- All passwords are auto-trimmed (`.trim()`)
- Error messages appear as styled inline alerts with red accent
- Errors clear automatically when user starts typing

---

### Step 12 — Copy to Clipboard & Share on WhatsApp

**Copy to Clipboard:**

```javascript
function copyToClipboard(text, buttonElement) {
  navigator.clipboard.writeText(text).then(() => {
    // Change button text to "✅ Copied!" for 2 seconds, then revert
  });
}
```

**Share on WhatsApp:**

```javascript
function shareOnWhatsApp(emojiString) {
  const encoded = encodeURIComponent(emojiString);
  window.open(`https://wa.me/?text=${encoded}`, "_blank");
}
```

> [!NOTE]
> The "Share on WhatsApp" button is a key UX feature since the entire project is designed for sharing encrypted messages on WhatsApp. This opens the WhatsApp share dialog with the emoji string pre-filled.

---

### Step 13 — FAQ Accordion Section

Three collapsible sections below the tool:

#### "How It Works & Privacy Guide"

| Accordion                 | Content Summary                                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **🔐 Is this tool safe?** | Explains AES-256 encryption, client-side processing, no server communication. Mentions that even the developer cannot see your messages.                      |
| **😎 Why use Emojis?**    | Explains bypassing spam filters, fun disguise, looks like casual conversation on WhatsApp. Mentions how it hides the fact that you're sending encrypted text. |
| **✅ Best Practices**     | Share password in person/phone call, never paste password in same chat, use strong unique passwords, don't reuse passwords across conversations.              |

- Click to expand/collapse with smooth height animation
- Chevron icon (▼) rotates on toggle
- Rich text content with proper `<p>`, `<strong>`, `<ul>` tags
- Proper semantic markup using `<details>`/`<summary>` for accessibility, with JS override for animations

---

### Step 14 — SEO Meta Tags

```html
<title>Emoji Spy - Free WhatsApp Text Encryptor</title>
<meta
  name="description"
  content="Securely encrypt your messages into emojis using AES-256. Private, free, and works on any device."
/>
<meta
  name="keywords"
  content="emoji encryption, whatsapp encrypt, text to emoji, AES-256, private messaging"
/>
<meta
  property="og:title"
  content="Emoji Spy - Send Hidden Messages on WhatsApp"
/>
<meta
  property="og:description"
  content="Encrypt your secret messages into emojis. Free, private, and secure."
/>
<meta property="og:type" content="website" />
```

- Proper heading hierarchy: single `<h1>` for the title
- Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`)
- Unique IDs on all interactive elements for testing
- `aria-label` attributes on buttons and inputs for screen reader accessibility
- `lang="en"` on `<html>` tag

---

### Step 15 — AdSense Placeholder

```html
<!-- Google AdSense Placeholder — Replace with your ad code -->
<div id="adsense-placeholder" class="...">
  <!-- Ad will appear here -->
</div>
```

Place one ad slot between the tool and the FAQ section.

---

### Step 16 — Loading State (UX Polish)

Since PBKDF2 with 10,000 iterations may take a brief moment, the encrypt/decrypt button will:

1. Show a spinning animation inside the button
2. Disable the button to prevent double-clicks
3. Change text to "🔄 Encrypting..." or "🔄 Decrypting..."
4. Re-enable after the operation completes (success or error)

This is done using `setTimeout(..., 50)` to allow the UI to repaint before starting the CPU-intensive PBKDF2 derivation.

---

### Step 17 — Footer

A simple footer with:

- "Made with 🔐 by Emoji Spy"
- "Your messages never leave your device."
- Current year (dynamically set via JS)

---

## Completeness Checklist (vs plan.md)

| Requirement from plan.md                          | Covered in Step |
| ------------------------------------------------- | --------------- |
| AES-256 encryption using CryptoJS                 | Step 8          |
| Password-dependent output                         | Step 8 (PBKDF2) |
| Emoji map (64 Base64 chars + `=` padding)         | Step 7          |
| `encryptToEmojis()` function                      | Step 8          |
| `decryptFromEmojis()` function                    | Step 9          |
| No backend / client-side only                     | Entire design   |
| Dark "Cyber-Privacy" aesthetic                    | Step 2          |
| Mobile-first responsive design                    | Step 2, all UI  |
| Header with logo + tagline                        | Step 3          |
| Encrypt/Decrypt tab switcher                      | Step 4          |
| Encrypt view (password, textarea, button, output) | Step 5          |
| Decrypt view (password, textarea, button, output) | Step 6          |
| Password visibility toggle                        | Step 5, 6, 10   |
| Random Salt + IV per encryption                   | Step 8          |
| Salt/IV prepended to ciphertext                   | Step 8, 9       |
| Wrong password → "Decryption Failed" error        | Step 9, 11      |
| Prevent empty message encryption                  | Step 11         |
| Auto-trim passwords                               | Step 11         |
| FAQ accordion ("How It Works & Privacy Guide")    | Step 13         |
| SEO meta tags (title, description, OG)            | Step 14         |
| AdSense placeholder                               | Step 15         |
| Single `index.html` file                          | All steps       |
| CryptoJS CDN link                                 | Step 1          |
| `const emojiMap` object                           | Step 7          |
| Tab switching via JS                              | Step 4, 10      |
| Copy to Clipboard function                        | Step 12         |

### Improvements Added (not in original plan.md)

| Improvement                           | Why                                                                  |
| ------------------------------------- | -------------------------------------------------------------------- |
| **Share on WhatsApp button**          | Core use case — lets users share emoji strings directly via WhatsApp |
| **Loading spinner on buttons**        | PBKDF2 needs processing time; prevents double-clicks                 |
| **Emoji favicon**                     | Professional touch, no extra file needed                             |
| **Character counter on textarea**     | Helps users gauge message length                                     |
| **Multi-codepoint emoji splitting**   | Critical bug prevention — some emojis are multiple codepoints        |
| **Auto-clearing errors on typing**    | Better UX — errors disappear as user corrects input                  |
| **Accessibility (aria-labels, lang)** | Better screen reader support and SEO                                 |
| **Copy button on decrypt output too** | Convenient for users to copy the revealed message                    |
| **Dynamic year in footer via JS**     | Never goes stale                                                     |

---

## Verification Plan

### Automated Tests (Browser)

1. **Encrypt → Decrypt round-trip**: Type a message, encrypt with a password, copy the emoji output, switch to decrypt tab, paste emoji and same password → verify original message appears
2. **Wrong password**: Encrypt a message, try decrypting with a different password → verify "Decryption Failed" error appears
3. **Empty input validation**: Try encrypting with empty message/password → verify error messages appear
4. **Different output each time**: Encrypt the same message with the same password twice → verify the emoji outputs are different (due to random Salt/IV)
5. **Tab switching**: Verify smooth switching between Encrypt and Decrypt tabs
6. **Copy button**: Verify clipboard copy works and shows "Copied!" feedback
7. **Mobile responsiveness**: Resize browser to mobile width and verify layout
8. **Share on WhatsApp**: Verify the WhatsApp share link opens correctly with the emoji string
9. **Special characters**: Encrypt messages containing Unicode (e.g., Arabic, Urdu, Chinese) and verify round-trip works

### Manual Verification

- User can open `index.html` directly in a browser (no server needed)
- Test copy-pasting emoji strings into WhatsApp to verify they display correctly
- Test on mobile browser to confirm responsive layout
