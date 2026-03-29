export interface WikiIngredient {
  name: string;
  count: number;
}

export interface WikiMysticForgeRecipe {
  ingredients: WikiIngredient[];
}

export async function fetchWikiMysticForgeRecipe(
  itemName: string,
): Promise<WikiMysticForgeRecipe | null> {
  try {
    const url =
      'https://wiki.guildwars2.com/api.php?action=parse&page=' +
      `${encodeURIComponent(itemName)}&prop=wikitext&format=json&redirects=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;
    const wikitext: string = data?.parse?.wikitext?.['*'] ?? '';
    return parseMysticForgeFromWikitext(wikitext);
  } catch {
    return null;
  }
}

function parseMysticForgeFromWikitext(
  wikitext: string,
): WikiMysticForgeRecipe | null {
  // Wiki format: {{Recipe | source = Mystic Forge | ingredient1 = N Item Name | ... }}
  // Find every {{Recipe...}} block and look for one with source = Mystic Forge
  const recipeRegex = /\{\{[Rr]ecipe([\s\S]*?)\}\}/g;
  let match: RegExpExecArray | null;

  while ((match = recipeRegex.exec(wikitext)) !== null) {
    const block = match[1];

    if (!/source\s*=\s*Mystic\s+Forge/i.test(block)) {
      continue;
    }

    const ingredients: WikiIngredient[] = [];

    for (let i = 1; i <= 4; i++) {
      const ingMatch = block.match(
        new RegExp(`\\|\\s*ingredient${i}\\s*=\\s*([^|\\n}]+)`, 'i'),
      );
      if (!ingMatch) continue;

      // Format: "N Item Name" where N is the quantity
      const raw = ingMatch[1].trim();
      const spaceIdx = raw.indexOf(' ');
      if (spaceIdx === -1) continue;

      const count = parseInt(raw.slice(0, spaceIdx), 10);
      const name = raw.slice(spaceIdx + 1).trim();

      if (name && !isNaN(count) && count > 0) {
        ingredients.push({name, count});
      }
    }

    if (ingredients.length > 0) {
      return {ingredients};
    }
  }

  return null;
}
