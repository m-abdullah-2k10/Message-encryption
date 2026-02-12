const CryptoJS = require('crypto-js');

// 256 Emoji Map (Copied from implementation)
const EMOJI_MAP = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
  '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁',
  '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺',
  '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '💋', '💌', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛', '💚',
  '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈',
  '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦿', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀',
  '👁️', '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓', '👵', '👴', '👲', '👳', '🧕', '👮', '👷', '💂', '🕵️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤',
  '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭', '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧', '👩‍🔬', '👨‍🔬', '👩‍🎨', '👨‍🎨', '👩‍🚒', '👨‍🚒', '👩‍✈️', '👨‍✈️', '👩‍🚀', '👨‍🚀', '👩‍⚖️', '👨‍⚖️', '👰', '🤵', '👸', '🤴', '🧚', '🧞', '🧜', '🧟', '🧙', '🧛'
];

const EMOJI_TO_INDEX = new Map();
EMOJI_MAP.forEach((emoji, index) => EMOJI_TO_INDEX.set(emoji, index));

function bytesToEmojis(wordArray) {
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;
  let result = '';
  for (let i = 0; i < sigBytes; i++) {
    const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    result += EMOJI_MAP[byte] || '?';
  }
  return result;
}

function emojisToBytes(emojiString) {
  // Simple splits for Node.js (Segmenter is better in browsers)
  const emojis = [...emojiString]; 
  const bytes = [];
  for (const emoji of emojis) {
    const index = EMOJI_TO_INDEX.get(emoji);
    if (index !== undefined) bytes.push(index);
  }
  const words = [];
  for (let i = 0; i < bytes.length; i++) {
    words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8);
  }
  return CryptoJS.lib.WordArray.create(words, bytes.length);
}

function encrypt(message, password) {
  const salt = CryptoJS.lib.WordArray.random(8);
  const iv = CryptoJS.lib.WordArray.random(8);
  const key = CryptoJS.PBKDF2(password, salt, { keySize: 256/32, iterations: 10000 });
  const encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
  const combined = salt.clone().concat(iv).concat(encrypted.ciphertext);
  return bytesToEmojis(combined);
}

function decrypt(emojiString, password) {
  const combined = emojisToBytes(emojiString);
  const salt = CryptoJS.lib.WordArray.create(combined.words.slice(0, 2));
  const iv = CryptoJS.lib.WordArray.create(combined.words.slice(2, 4));
  const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4), combined.sigBytes - 16);
  const key = CryptoJS.PBKDF2(password, salt, { keySize: 256/32, iterations: 10000 });
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// Tests
console.log("--- Emoji Length Reduction Verification ---");
const msg = "Hello World";
const pass = "password123";
const enc = encrypt(msg, pass);
const dec = decrypt(enc, pass);

console.log(`Original: "${msg}"`);
console.log(`Encrypted (${[...enc].length} emojis): ${enc}`);
console.log(`Decrypted: "${dec}"`);
console.log(`Correct? ${msg === dec ? "✅" : "❌"}`);

if (msg === dec) {
  console.log("\nLength Comparison (Estimate):");
  console.log("- Old System: ~64 emojis");
  console.log(`- New System: ${[...enc].length} emojis`);
  console.log(`- Reduction: ${Math.round((1 - [...enc].length/64) * 100)}%`);
} else {
  process.exit(1);
}
