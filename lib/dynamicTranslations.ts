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
export const researchTranslations: Record<string, Record<'en' | 'ja', DynamicTranslation>> = {
  // Example: Add research translations here with research ID as key
  // '1': {
  //   'en': { title: 'Original Title', description: 'Original Description' },
  //   'ja': { title: '翻訳されたタイトル', description: '翻訳された説明' }
  // },
  // '2': {
  //   'en': { title: 'Another Paper', description: 'Research on climate change' },
  //   'ja': { title: '別の論文', description: '気候変動に関する研究' }
  // }
};

// Project Content Translations
export const projectTranslations: Record<string, Record<'en' | 'ja', DynamicTranslation>> = {
  // Example: Add project translations here with project ID as key
  // '1': {
  //   'en': { title: 'Project Name', description: 'Project description in English' },
  //   'ja': { title: 'プロジェクト名', description: '日本語でのプロジェクト説明' }
  // }
};

// Activity Content Translations
export const activityTranslations: Record<string, Record<'en' | 'ja', DynamicTranslation>> = {
  // Example: Add activity translations here with activity ID as key
  // '1': {
  //   'en': { title: 'Activity Title', category: 'Workshop' },
  //   'ja': { title: 'アクティビティのタイトル', category: 'ワークショップ' }
  // }
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
