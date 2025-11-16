// Connection sabitler ve yardımcı fonksiyonlar

export const CONNECTION_CONSTANTS = {
  DEFAULT_AVATAR: 'https://ui-avatars.com/api/?name=User&background=2a3438&color=fff&size=150',
  ITEMS_PER_PAGE: 20,
  MIN_SEARCH_LENGTH: 2,
};

export const getAvatarUrl = (avatar?: string, fallbackName?: string): string => {
  if (avatar) return avatar;
  
  if (fallbackName) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=2a3438&color=fff&size=150`;
  }
  
  return CONNECTION_CONSTANTS.DEFAULT_AVATAR;
};

export const formatConnectionDate = (date: string): string => {
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Bugün';
  if (diffDays === 1) return 'Dün';
  if (diffDays < 7) return `${diffDays} gün önce`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`;
  return `${Math.floor(diffDays / 365)} yıl önce`;
};
