/**
 * Test Script for Base-65 Emoji Encoding/Decoding
 * This script tests the emoji encryption implementation
 */

// EMOJI MAP - Base-65 Encoding System (same as in index.html)
const EMOJI_MAP = [
  // Smileys & Emotion (20 emojis) - Indices 0-19
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
  '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
  
  // Expressive Faces (15 emojis) - Indices 20-34
  '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
  '🤐', '🤨', '😐', '😑', '😶',
  
  // Negative Emotions (10 emojis) - Indices 35-44
  '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴',
  
  // Hearts & Symbols (10 emojis) - Indices 45-54
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯',
  
  // Hand Gestures (10 emojis) - Indices 55-64
  '👋', '🤚', '✋', '👌', '✌️', '🤞', '🤟', '👍', '👎', '✊'
];

const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

console.log("=".repeat(60));
console.log("EMOJI ENCRYPTION TEST - Step 7 Verification");
console.log("=".repeat(60));

// Test 1: Verify emoji map has exactly 65 emojis
console.log("\n✓ Test 1: Emoji Map Size");
console.log(`  Expected: 65 emojis`);
console.log(`  Actual: ${EMOJI_MAP.length} emojis`);
console.log(`  Status: ${EMOJI_MAP.length === 65 ? "✅ PASS" : "❌ FAIL"}`);

// Test 2: Verify all emojis are unique
console.log("\n✓ Test 2: Emoji Uniqueness");
const uniqueEmojis = new Set(EMOJI_MAP);
console.log(`  Expected: 65 unique emojis`);
console.log(`  Actual: ${uniqueEmojis.size} unique emojis`);
console.log(`  Status: ${uniqueEmojis.size === 65 ? "✅ PASS" : "❌ FAIL"}`);

// Test 3: Test encoding function
console.log("\n✓ Test 3: Encoding Function");

function textToEmoji(text) {
  if (!text || text.length === 0) {
    return "";
  }
  
  let result = "";
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const index = BASE64_CHARS.indexOf(char);
    
    if (index !== -1) {
      result += EMOJI_MAP[index];
    } else {
      console.warn('Non-Base64 character found:', char);
      result += char;
    }
  }
  
  return result;
}

const testString = "ABC123";
const encoded = textToEmoji(testString);
// A=0, B=1, C=2, 1=53, 2=54, 3=55
// Expecting EMOJI_MAP[0,1,2,53,54,55]
console.log(`  Input: "${testString}"`);
console.log(`  Encoded: ${encoded}`);
console.log(`  Encoded length: ${Array.from(encoded).length} emojis`);

// Test 4: Test decoding function
console.log("\n✓ Test 4: Decoding Function");

function emojiToText(emojiText) {
  if (!emojiText || emojiText.length === 0) {
    return "";
  }
  
  // Create reverse mapping for O(1) lookup
  const emojiToIndex = new Map();
  EMOJI_MAP.forEach((emoji, index) => {
    emojiToIndex.set(emoji, index);
  });
  
  let result = "";
  
  // Convert string to array to handle surrogate pairs correctly
  const emojis = Array.from(emojiText);
  
  for (const emoji of emojis) {
    const index = emojiToIndex.get(emoji);
    
    if (index !== undefined && index < BASE64_CHARS.length) {
      result += BASE64_CHARS[index];
    }
  }
  
  return result;
}

const decoded = emojiToText(encoded);
console.log(`  Encoded: ${encoded}`);
console.log(`  Decoded: "${decoded}"`);
console.log(`  Status: ${decoded === testString ? "✅ PASS" : "❌ FAIL"}`);

// Test 5: Round-trip test with various strings
console.log("\n✓ Test 5: Round-Trip Tests");

const testCases = [
  "Hello World", // Invalid Base64 (spaces), so this test might fail if strict
  // Wait, standard Base64 does not have spaces.
  // The input to textToEmoji is EXPECTED to be Base64 from AES.
  // So I should test with valid Base64 strings.
  "SGVsbG8gV29ybGQ=", // "Hello World" in Base64
  "VGVzdDEyMw==",     // "Test123" in Base64
  "YQ==",             // "a" in Base64
  "QUJD",             // "ABC" in Base64
  "VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw==", // Pangram
  "U3BlY2lhbCBjaGFyczogIUAjJCVeJiooKQ==", // Special chars
  "TnVtYmVyczogMDEyMzQ1Njc4OQ=="          // Numbers
];

let allPassed = true;
testCases.forEach((testCase, index) => {
  const enc = textToEmoji(testCase);
  const dec = emojiToText(enc);
  const passed = dec === testCase;
  allPassed = allPassed && passed;
  console.log(
    `  Test ${index + 1}: "${testCase.substring(0, 30)}${testCase.length > 30 ? "..." : ""}"`,
  );
  console.log(`    Encoded to: ${Array.from(enc).length} emojis`);
  console.log(`    Decoded correctly: ${passed ? "✅" : "❌"}`);
});

console.log(
  `  Overall Status: ${allPassed ? "✅ ALL PASS" : "❌ SOME FAILED"}`,
);
