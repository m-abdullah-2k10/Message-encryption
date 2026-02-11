🕵️ Project Title: The Emoji Spy (Web-Based Encryption Tool)

Project Goal: Build a single-page, client-side web application that allows users to encrypt text messages into a string of emojis using a password, and decrypt them back. The tool must be secure (AES-256), private (no backend/database), and mobile-friendly for sharing on WhatsApp.
🏗️ Phase 1: Technical Architecture (The Engine)

Core Technology Stack:

    Language: HTML5, JavaScript (ES6+), CSS3.

    Framework: Tailwind CSS (via CDN) for styling.

    Libraries: CryptoJS (via CDN) for encryption logic.

    Hosting: Static HTML (GitHub Pages / Vercel compatible).

Key Logic Requirements:

    Encryption (AES-256):

        Use CryptoJS.AES.encrypt(message, password) to generate a Base64 ciphertext.

        Strict Requirement: The encryption must rely on the user's password. If the password changes, the output must change entirely.

    The "Emoji Map" (The Disguise):

        Create a mapping array of 64 unique emojis (e.g., 🍎, 🍌, 🥑, 🍕, 🚗, etc.) that correspond to the 64 characters of the standard Base64 set (A-Z, a-z, 0-9, +, /).

        Function 1: encryptToEmojis(text, password) -> Encrypts text to Base64 -> Replaces Base64 chars with Emojis.

        Function 2: decryptFromEmojis(emojiString, password) -> Replaces Emojis with Base64 chars -> Decrypts Base64 with password.

    No-Backend:

        All processing must happen in the browser. No data is sent to any server.

🎨 Phase 2: UI/UX Design (The Interface)

Visual Theme:

    Style: "Cyber-Privacy" / "Hacker" aesthetic but clean. Dark mode default (slate-900 background, neon green/purple accents).

    Responsiveness: Mobile-first design (critical for WhatsApp users).

Layout Structure:

    Header: Simple logo ("Emoji Spy") and a tagline: "Send Hidden Messages on WhatsApp."

    The "Switcher": Two large tabs at the top:

        [ 🔒 ENCRYPT ] (Active by default)

        [ 🔓 DECRYPT ]

    Tab 1: Encrypt View:

        Input 1: "Create a Password" (Input type: text/password toggle).

        Input 2: "Your Secret Message" (Textarea).

        Button: "Encrypt to Emojis" (Large, glowing button).

        Output: A read-only box showing the Emoji string with a "Copy" button.

    Tab 2: Decrypt View:

        Input 1: "Enter the Password" (Must be filled first).

        Input 2: "Paste Emoji String" (Textarea).

        Button: "Reveal Message".

        Output: A clean box showing the original text.

🛡️ Phase 3: Security Features (The Logic)

    Salt & IV Implementation:

        The system must auto-generate a random Salt and IV (Initialization Vector) for every encryption.

        Crucial: The Salt and IV must be prepended (attached) to the encrypted string so they can be extracted during decryption. (This ensures that encrypting "Hello" twice results in different emojis every time).

    Error Handling:

        If the user enters the wrong password during decryption, the system must return a generic "Decryption Failed" error or gibberish, NOT the original text.

    Input Validation:

        Prevent the user from encrypting an empty message.

        Auto-trim whitespace from passwords.

💰 Phase 4: AdSense & SEO Strategy (The Content)

Goal: Avoid "Low Value Content" rejection from Google.

    Blog Section (Below the Tool):

        Include a section titled "How It Works & Privacy Guide".

        Generate 3 collapsible "Accordion" sections with rich text:

            "Is this tool safe?" (Explain AES-256 and Client-Side privacy).

            "Why use Emojis?" (Explain how it bypasses spam filters and looks fun).

            "Best Practices" (Explain why you should share the password in person, not in the chat).

    Meta Tags:

        Include proper SEO title: "Emoji Spy - Free WhatsApp Text Encryptor".

        Description: "Securely encrypt your messages into emojis using AES-256. Private, free, and works on any device."

📝 Instructions for the AI (Copy this part specifically)

    "Act as a Senior Frontend Developer. Build the 'Emoji Spy' web application based on the plan above.

    Requirements:

        Write the code in a single HTML file (index.html) that contains the CSS (Tailwind via CDN), HTML structure, and JavaScript logic.

        Use CryptoJS from this CDN: https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js.

        Define a const emojiMap object that maps all 64 Base64 characters to 64 distinct, common emojis.

        Ensure the UI switches cleanly between 'Encrypt' and 'Decrypt' modes using JavaScript to toggle visibility of the divs.

        Add a 'Copy to Clipboard' function for the result.