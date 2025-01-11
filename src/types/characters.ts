export interface Character {
  id: string;
  type: string;
  category: string;
  race: string;
  faction: string;
  name: string;
  image: string;
  description: string;
  appearance: string;
  stats: string;
  abilities: string[];
  goal: string;
}

export interface FactionDetails {
  merkez: string;
  lider: string;
  uyeSayisi: string;
  etkiAlani: string;
  uzmanlik: string;
}

export interface Faction {
  id: string;
  type: string;
  name: string;
  image: string;
  description: string;
  goal: string;
  details: FactionDetails;
  varliklar: string[];
}

export interface CharactersData {
  characters: Character[];
  factions: Faction[];
} 