/**
 * Database Content Translation Mappings
 * Maps database content to translated versions based on language
 */

type Language = 'en' | 'ja';

// Research Categories
export const researchCategoryTranslations: Record<string, Record<Language, string>> = {
  'Marine Litter': {
    en: 'Marine Litter',
    ja: '海洋ゴミ'
  },
  'Microplastics': {
    en: 'Microplastics',
    ja: 'マイクロプラスチック'
  },
  'Plastic-Climate Nexus': {
    en: 'Plastic-Climate Nexus',
    ja: 'プラスチック-気候の関連性'
  },
  'Campus Compost': {
    en: 'Campus Compost',
    ja: 'キャンパスコンポスト'
  },
  'Open Burning': {
    en: 'Open Burning',
    ja: '野外焼却'
  },
  'Municipal Waste': {
    en: 'Municipal Waste',
    ja: '都市廃棄物'
  },
  'Heat Risk': {
    en: 'Heat Risk',
    ja: '熱リスク'
  },
  'Climate Mitigation': {
    en: 'Climate Mitigation',
    ja: '気候緩和'
  },
  'Community Resilience': {
    en: 'Community Resilience',
    ja: 'コミュニティの回復力'
  },
  'Solar Adoption': {
    en: 'Solar Adoption',
    ja: 'ソーラーエネルギー導入'
  },
  'Energy Efficiency': {
    en: 'Energy Efficiency',
    ja: 'エネルギー効率'
  },
  'Community Energy': {
    en: 'Community Energy',
    ja: 'コミュニティエネルギー'
  },
  'Urban Planning': {
    en: 'Urban Planning',
    ja: '都市計画'
  },
  'Environmental Justice': {
    en: 'Environmental Justice',
    ja: '環境正義'
  },
  'Public Health': {
    en: 'Public Health',
    ja: '公衆衛生'
  },
  'Fair Trade': {
    en: 'Fair Trade',
    ja: 'フェアトレード'
  },
  'Biodiversity': {
    en: 'Biodiversity',
    ja: '生物多様性'
  },
  'Policy Design': {
    en: 'Policy Design',
    ja: '政策設計'
  }
};

// Project Categories
export const projectCategoryTranslations: Record<string, Record<Language, string>> = {
  'Waste Management': {
    en: 'Waste Management',
    ja: '廃棄物管理'
  },
  'Climate Action': {
    en: 'Climate Action',
    ja: '気候変動対策'
  },
  'Renewable Energy': {
    en: 'Renewable Energy',
    ja: '再生可能エネルギー'
  },
  'Urban Sustainability': {
    en: 'Urban Sustainability',
    ja: '都市の持続可能性'
  },
  'Research': {
    en: 'Research',
    ja: '研究'
  },
  'Education': {
    en: 'Education',
    ja: '教育'
  },
  'Community Development': {
    en: 'Community Development',
    ja: 'コミュニティ開発'
  },
  'General': {
    en: 'General',
    ja: '一般'
  }
};

// Project Status Translations
export const projectStatusTranslations: Record<string, Record<Language, string>> = {
  'ongoing': {
    en: 'Ongoing',
    ja: '進行中'
  },
  'completed': {
    en: 'Completed',
    ja: '完了'
  },
  'planned': {
    en: 'Planned',
    ja: '計画中'
  },
  'on-hold': {
    en: 'On Hold',
    ja: '保留中'
  }
};

// Activity Categories
export const activityCategoryTranslations: Record<string, Record<Language, string>> = {
  'Workshop': {
    en: 'Workshop',
    ja: 'ワークショップ'
  },
  'Seminar': {
    en: 'Seminar',
    ja: 'セミナー'
  },
  'Conference': {
    en: 'Conference',
    ja: '会議'
  },
  'Fieldwork': {
    en: 'Fieldwork',
    ja: 'フィールドワーク'
  },
  'Collaboration': {
    en: 'Collaboration',
    ja: 'コラボレーション'
  },
  'Publication': {
    en: 'Publication',
    ja: '出版'
  },
  'Award': {
    en: 'Award',
    ja: '賞'
  },
  'Media': {
    en: 'Media',
    ja: 'メディア'
  },
  'Event': {
    en: 'Event',
    ja: 'イベント'
  }
};

// Helper function to translate a value
export function translateValue(
  value: string | undefined | null,
  translations: Record<string, Record<Language, string>>,
  language: Language = 'en'
): string {
  if (!value) return '';
  const normalizedValue = String(value).trim();
  return translations[normalizedValue]?.[language] || normalizedValue;
}

// Helper function to translate research category
export function translateResearchCategory(category: string | undefined, language: Language = 'en'): string {
  return translateValue(category, researchCategoryTranslations, language);
}

// Helper function to translate project category
export function translateProjectCategory(category: string | undefined, language: Language = 'en'): string {
  return translateValue(category, projectCategoryTranslations, language);
}

// Helper function to translate project status
export function translateProjectStatus(status: string | undefined, language: Language = 'en'): string {
  return translateValue(status, projectStatusTranslations, language);
}

// Helper function to translate activity category
export function translateActivityCategory(category: string | undefined, language: Language = 'en'): string {
  return translateValue(category, activityCategoryTranslations, language);
}

// Generic translate function that accepts any translation map
export function translate(
  value: string | undefined | null,
  translationMap: Record<string, Record<Language, string>>,
  language: Language = 'en'
): string {
  return translateValue(value, translationMap, language);
}
