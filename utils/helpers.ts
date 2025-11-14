import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle,
  Printer 
} from 'lucide-react-native';

// Page update checker
export const updatePageChecker = (pathname: string, updatedPage: string | null): boolean => {
  return pathname === updatedPage;
};

// Contact types
export type ContactType = 'phone' | 'email' | 'whatsapp' | 'location' | 'fax';

export const profileDataIcon = [
  {
    contactType: 'phone' as ContactType,
    IconComponent: Phone
  },
  {
    contactType: 'email' as ContactType,
    IconComponent: Mail
  },
  {
    contactType: 'whatsapp' as ContactType,
    IconComponent: MessageCircle
  },
  {
    contactType: 'location' as ContactType,
    IconComponent: MapPin
  }
];

export const generateProfileIcon = (contactType: ContactType) => {
  if (contactType) {
    const findIcon = profileDataIcon.find(el => el.contactType === contactType);
    return findIcon?.IconComponent;
  }
  return null;
};

export const linkData = [
  {
    value: 'Mobil',
    contactType: 'phone' as ContactType
  },
  {
    value: 'Whatsapp',
    contactType: 'whatsapp' as ContactType
  },
  {
    value: 'Mail',
    contactType: 'email' as ContactType
  },
  {
    value: 'Konum',
    contactType: 'location' as ContactType
  },
  {
    value: 'Fax',
    contactType: 'fax' as ContactType
  }
];

// Social Media Icons
import { 
  Linkedin, 
  Facebook, 
  Github, 
  Twitter, 
  Youtube, 
  Instagram 
} from 'lucide-react-native';

export type SocialMediaPlatform = 
  | 'LINKEDIN' 
  | 'FACEBOOK' 
  | 'GITHUB' 
  | 'X' 
  | 'YOUTUBE' 
  | 'INSTAGRAM' 
  | 'PINTEREST' 
  | 'BEHANCE' 
  | 'DRIBBBLE' 
  | 'SNAPCHAT' 
  | 'SPOTIFY';

// Social Media icon mapping (using Lucide icons)
const socialMediaIcons: Record<string, any> = {
  linkedin: Linkedin,
  facebook: Facebook,
  github: Github,
  x: Twitter,
  youtube: Youtube,
  instagram: Instagram,
  pinterest: Instagram, // Fallback to Instagram
  behance: Instagram,   // Fallback to Instagram
  dribbble: Instagram,  // Fallback to Instagram
  snapchat: Instagram,  // Fallback to Instagram
  spotify: Instagram    // Fallback to Instagram
};

export const generateSocialMediaIcon = (platform: string) => {
  return socialMediaIcons[platform.toLowerCase()];
};

export const socialMediaPlatforms = [
  {
    platform: 'LINKEDIN',
    IconComponent: Linkedin,
    value: 'Linkedin'
  },
  {
    platform: 'FACEBOOK',
    IconComponent: Facebook,
    value: 'Facebook'
  },
  {
    platform: 'GITHUB',
    IconComponent: Github,
    value: 'Github'
  },
  {
    platform: 'X',
    IconComponent: Twitter,
    value: 'X'
  },
  {
    platform: 'YOUTUBE',
    IconComponent: Youtube,
    value: 'Youtube'
  },
  {
    platform: 'INSTAGRAM',
    IconComponent: Instagram,
    value: 'Instagram'
  },
  {
    platform: 'PINTEREST',
    IconComponent: Instagram,
    value: 'Pinterest'
  },
  {
    platform: 'BEHANCE',
    IconComponent: Instagram,
    value: 'Behance'
  },
  {
    platform: 'DRIBBBLE',
    IconComponent: Instagram,
    value: 'Dribbble'
  },
  {
    platform: 'SNAPCHAT',
    IconComponent: Instagram,
    value: 'Snapchat'
  },
  {
    platform: 'SPOTIFY',
    IconComponent: Instagram,
    value: 'Spotify'
  }
];

// Error message generator
export const generateMessage = (error: any, frontMessage: string): string => {
  return error?.response?.data?.message || `[${frontMessage}] Beklenmeyen Bir Hata Oluştu`;
};
