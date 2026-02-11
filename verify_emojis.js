
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

console.log(`Total Emojis: ${EMOJI_MAP.length}`);

// Check for duplicates
const unique = new Set(EMOJI_MAP);
if (unique.size !== EMOJI_MAP.length) {
    console.error(`DUPLICATES FOUND! Unique: ${unique.size}, Total: ${EMOJI_MAP.length}`);
} else {
    console.log("No duplicates found.");
}

// Check splitting behavior
console.log("\nVerifying Array.from splitting behavior:");
let failures = 0;

EMOJI_MAP.forEach((emoji, index) => {
    const split = Array.from(emoji);
    if (split.length !== 1) {
        console.warn(`[WARNING] Emoji at index ${index} (${emoji}) splits into ${split.length} parts:`, split);
        // If it splits into multiple parts, it means Array.from sees it as multiple items.
        // This is BAD for our decryption logic which iterates using Array.from(emojiString).
        failures++;
    }
});

if (failures > 0) {
    console.error(`\nFound ${failures} emojis that split incorrectly with Array.from(). This will BREAK decryption.`);
} else {
    console.log("\nAll emojis split correctly as single items with Array.from().");
}

// Test round trip of the map itself
console.log("\nTesting full map round-trip:");
const fullString = EMOJI_MAP.join('');
const splitBack = Array.from(fullString);

if (splitBack.length !== EMOJI_MAP.length) {
    console.error(`Round-trip length mismatch! Original: ${EMOJI_MAP.length}, Split: ${splitBack.length}`);
    // Find where it desyncs
    for(let i=0; i<Math.max(EMOJI_MAP.length, splitBack.length); i++) {
        if(EMOJI_MAP[i] !== splitBack[i]) {
            console.error(`Mismatch at index ${i}: Expected ${EMOJI_MAP[i]}, Got ${splitBack[i]}`);
            break;
        }
    }
} else {
    console.log("Full string round-trip successful.");
}
