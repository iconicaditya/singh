# Language Support - Quick Reference Guide

## 🎯 What Was Implemented

Complete English ↔️ Japanese language switching for the entire Singh Lab website with instant updates across all sections.

## 🌐 How to Use

### Desktop
1. Look for the **Globe 🌍 Icon** in the top navbar (black header)
2. Click it to open the language dropdown
3. Select either **English** or **日本語 (Japanese)**
4. Website content updates instantly

### Mobile
1. Click the **Hamburger Menu** (☰) icon
2. Scroll down in the menu
3. Select your preferred language
4. Close the menu to see changes

## 📍 Translated Sections

| Section | Status |
|---------|--------|
| Navigation Menu | ✅ All items translated |
| Hero Slides | ✅ 4 slides with titles & subtitles |
| About Section | ✅ Vision, Mission, Approach |
| Gallery | ✅ Title, categories, buttons |
| Contact Form | ✅ All labels and messages |
| Footer | ✅ Links, contact info, copyright |
| All Buttons | ✅ CTA buttons throughout site |

## 🔤 Example Translations

### English → Japanese

| English | Japanese |
|---------|----------|
| HOME | ホーム |
| ABOUT | について |
| OUR TEAM | チーム |
| PROJECTS | プロジェクト |
| PUBLICATIONS | 出版物 |
| GALLERY | ギャラリー |
| RESEARCH | 研究 |
| CONTACT | お問い合わせ |
| Get In Touch | お問い合わせ |
| Send Message | メッセージを送信 |

## 💾 Data Persistence

Your language preference is **automatically saved** in your browser:
- Changes persist when you refresh the page
- Works across all pages on the site
- Stored securely in localStorage

## 🛠️ For Developers

### Adding New Text to Translation
1. Edit `lib/translations.ts`
2. Add key to both `en` and `ja` objects
3. Use in component: `const { t } = useLanguage(); {t("KEY")}`

### Example:
```typescript
// In lib/translations.ts
export const translations = {
  en: {
    NEW_PAGE: "My New Page",
  },
  ja: {
    NEW_PAGE: "新しいページ",
  },
};

// In component
const { t } = useLanguage();
<h1>{t("NEW_PAGE")}</h1>
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `lib/translations.ts` | All translation strings |
| `lib/LanguageContext.tsx` | Language state management |
| `app/layout.tsx` | LanguageProvider wrapper |
| `components/header.tsx` | Language switcher UI |

## ✅ Testing Checklist

- [x] Language switcher appears in navbar
- [x] Dropdown opens/closes smoothly
- [x] Both English and Japanese options available
- [x] All text updates when language changes
- [x] Language preference saves on page refresh
- [x] Mobile menu has language options
- [x] All sections have proper translations
- [x] No broken links or missing text

## 🎨 Design Notes

- Language dropdown matches navbar style (dark background)
- Smooth animations on menu open/close
- Selected language highlighted in blue
- Works seamlessly on mobile and desktop
- Non-intrusive, integrated into existing design

## 📞 Support

To add more languages or extend translations:
1. Add new language object to `translations.ts`
2. Update `Language` type
3. Add new language option to header dropdown
4. Add translations for all existing keys

Current supported languages: English, Japanese
Adding new language: ~30 minutes of translation work

---

**Status:** ✅ Live and Fully Functional
**Last Updated:** January 23, 2026
