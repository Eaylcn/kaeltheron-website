import fs from 'fs';
import path from 'path';

export function getCharacters() {
  const filePath = path.join(process.cwd(), 'src/data/characters.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
} 