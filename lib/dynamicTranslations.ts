/**
 * Dynamic Content Translations
 * Maps database content IDs to their translated versions
 * This allows translating dynamic content without modifying database schema
 */

export interface DynamicTranslation {
  title?: string;
  description?: string;
  category?: string;
  tags?: string;
}

// Research Content Translations
// Add translations by matching the ID from your database
export const researchTranslations: Record<string, Record<'en' | 'ja', DynamicTranslation>> = {
  // Example for testing - replace IDs with actual database IDs
  '1': {
    'en': { title: 'Research Item 1', description: 'Description in English' },
    'ja': { title: '研究項目 1', description: '日本語での説明' }
  },
  '2': {
    'en': { title: 'Research Item 2', description: 'Environmental research description' },
    'ja': { title: '研究項目 2', description: '環境研究の説明' }
  }
};

// Project Content Translations
// Add translations by matching the ID from your database  
export const projectTranslations: Record<string, Record<'en' | 'ja', DynamicTranslation>> = {
  // Example for testing - replace IDs with actual database IDs
  '1': {
    'en': { title: 'Project One', description: 'Main project description' },
    'ja': { title: 'プロジェクト 1', description: 'メインプロジェクトの説明' }
  },
  '2': {
    'en': { title: 'Project Two', description: 'Secondary project details' },
    'ja': { title: 'プロジェクト 2', description: 'セカンダリプロジェクトの詳細' }
  }
};

// Activity Content Translations
// Add translations by matching the ID from your database
export const activityTranslations: Record<string, Record<'en' | 'ja', DynamicTranslation>> = {
  // Example for testing - replace IDs with actual database IDs
  '1': {
    'en': { title: 'Activity Title', category: 'Workshop' },
    'ja': { title: 'アクティビティのタイトル', category: 'ワークショップ' }
  }
};

/**
 * Get translated content for research
 * If translation exists, returns Japanese version; otherwise returns original
 */
export function getTranslatedResearch(item: any, language: 'en' | 'ja'): any {
  if (language === 'en') return item;

  const translation = researchTranslations[item.id?.toString()];
  if (!translation) return item;

  return {
    ...item,
    title: translation.ja?.title || item.title,
    description: translation.ja?.description || item.description,
  };
}

/**
 * Get translated content for projects
 */
export function getTranslatedProject(item: any, language: 'en' | 'ja'): any {
  if (language === 'en') return item;

  const translation = projectTranslations[item.id?.toString()];
  if (!translation) return item;

  return {
    ...item,
    title: translation.ja?.title || item.title,
    description: translation.ja?.description || item.description,
  };
}

/**
 * Get translated content for activities
 */
export function getTranslatedActivity(item: any, language: 'en' | 'ja'): any {
  if (language === 'en') return item;

  const translation = activityTranslations[item.id?.toString()];
  if (!translation) return item;

  return {
    ...item,
    title: translation.ja?.title || item.title,
    category: translation.ja?.category || item.category,
  };
}

/**
 * Get translated array of research items
 */
export function getTranslatedResearchList(items: any[], language: 'en' | 'ja'): any[] {
  return items.map(item => getTranslatedResearch(item, language));
}

/**
 * Get translated array of project items
 */
export function getTranslatedProjectList(items: any[], language: 'en' | 'ja'): any[] {
  return items.map(item => getTranslatedProject(item, language));
}

/**
 * Get translated array of activity items
 */
export function getTranslatedActivityList(items: any[], language: 'en' | 'ja'): any[] {
  return items.map(item => getTranslatedActivity(item, language));
}

/**
 * Helper to add translations to the maps
 * Call this to register new translations
 */
export function registerResearchTranslation(
  id: string,
  enVersion: DynamicTranslation,
  jaVersion: DynamicTranslation
) {
  researchTranslations[id] = { en: enVersion, ja: jaVersion };
}

export function registerProjectTranslation(
  id: string,
  enVersion: DynamicTranslation,
  jaVersion: DynamicTranslation
) {
  projectTranslations[id] = { en: enVersion, ja: jaVersion };
}

export function registerActivityTranslation(
  id: string,
  enVersion: DynamicTranslation,
  jaVersion: DynamicTranslation
) {
  activityTranslations[id] = { en: enVersion, ja: jaVersion };
}
