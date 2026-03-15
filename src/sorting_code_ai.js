import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Vocabulary from "./english-uzbek.js";

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure output folder exists
const outputDir = path.join(__dirname, "vocabularies");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

for (let i = 97; i <= 122; i++) {
  const letter = String.fromCharCode(i); // a

  const filtered = Vocabulary.filter(word =>
    word.eng.toLowerCase().startsWith(letter)
  );

  if (filtered.length > 0) {
    // ✅ Use ESM export instead of module.exports
    const fileContent = `export default ${JSON.stringify(filtered, null, 2)};`;

    const fileName = `${letter}.js`;
    const filePath = path.join(outputDir, fileName);

    try {
      fs.writeFileSync(filePath, fileContent, "utf-8");
      console.log(`Created: ${fileName}`);
    } catch (err) {
      console.error(`Could not write file for ${letter}:`, err.message);
    }
  }
}

console.log("All words are sorted by their letters! ✅");