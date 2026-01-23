# Language Switcher System Documentation

## Overview
A global language switcher system has been implemented with English and Japanese support.

## Files Created/Modified

### 1. **lib/translations.ts** (New)
Contains all translation strings for both English and Japanese.
```typescript
import { useLanguage } from "@/lib/LanguageContext";

// Usage in components
const { language, setLanguage, t } = useLanguage();

// Get translated text
<h1>{t("HOME")}</h1>

// Change language
<button onClick={() => setLanguage("en")}>English</button>
<button onClick={() => setLanguage("ja")}>Japanese</button>
```

### 2. **lib/LanguageContext.tsx** (New)
React Context for managing language state globally with localStorage persistence.

### 3. **app/layout.tsx** (Updated)
Wrapped the entire app with `LanguageProvider` to enable language switching everywhere.

### 4. **components/header.tsx** (Updated)
- Added language dropdown next to the Globe icon
- All navigation labels and taglines now use translations
- Mobile menu includes language selection buttons

## Usage in Components

To use the language system in any component:

```typescript
"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function MyComponent() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div>
      <h1>{t("HOME")}</h1>
      <p>{t("ABOUT_DESCRIPTION")}</p>
      
      <button onClick={() => setLanguage("en")}>
        {t("ENGLISH")}
      </button>
      <button onClick={() => setLanguage("ja")}>
        {t("JAPANESE")}
      </button>
    </div>
  );
}
```

## Features

✅ Global language switching across entire website
✅ Persistent language selection (saved in localStorage)
✅ Language dropdown in navbar with Globe icon
✅ Mobile-friendly language selection
✅ Smooth animations on language menu
✅ English and Japanese support

## Adding New Translations

Edit `lib/translations.ts` and add new key-value pairs to both `en` and `ja` objects:

```typescript
export const translations = {
  en: {
    MY_NEW_KEY: "English text here",
  },
  ja: {
    MY_NEW_KEY: "日本語テキスト",
  },
};
```

Then use in your component:
```typescript
{t("MY_NEW_KEY")}
```

## Current Translations Available

- Navigation: HOME, ABOUT, OUR_TEAM, PROJECTS, PUBLICATIONS, GALLERY, RESEARCH, CONTACT
- Taglines: RESEARCH_HIGHLIGHT, SUSTAINABLE_HIGHLIGHT, COMMUNITIES_HIGHLIGHT, TOGETHER_HIGHLIGHT
- Language: LANGUAGE, ENGLISH, JAPANESE
- Basic: HERO_TITLE, HERO_SUBTITLE, EXPLORE_NOW, ABOUT_TITLE, ABOUT_DESCRIPTION, FOOTER_TEXT, FOLLOW_US

## Language Persistence

The selected language is saved in browser localStorage under the key `"language"` and restored on page reload.
