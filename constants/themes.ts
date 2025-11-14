export interface Theme {
  primaryColor: string;
  backgroundColor: string;
  headerBackgroundColor: string;
  textColor: string;
  menuBackgroundColor: string;
  activeMenuBackgroundColor: string;
  activeMenuColor: string;
  titleBackground: string;
  submitButtonBackgroundColor: string;
  avatarBorderColor?: string;
  linkBackgroundColor: string;
  labelColor: string;
  jobColor: string;
  addCompanyButton?: string;
  selectedMenuItem?: string;
}

export interface Themes {
  [key: string]: Theme;
}

const themes: Themes = {
  default: {
    primaryColor: "#3C616D",
    backgroundColor: "#141e22",
    headerBackgroundColor: "#273034",
    textColor: "#ffffff",
    menuBackgroundColor: "#1B272C",
    activeMenuBackgroundColor: "#10181B",
    activeMenuColor: "#7196AC",
    titleBackground: "#243239",
    submitButtonBackgroundColor: "#70C094",
    avatarBorderColor: "#7196ac",
    linkBackgroundColor: "#32424A",
    labelColor: "#8E8E8E",
    jobColor: "#A2A2A2",
    addCompanyButton: "#10181B",
    selectedMenuItem: "#D9D9D9"
  },
  forest: {
    primaryColor: "#2F4F4F",
    backgroundColor: "#1B2A1B",
    headerBackgroundColor: "#304030",
    textColor: "#E0E8D8",
    menuBackgroundColor: "#223322",
    activeMenuBackgroundColor: "#1A261A",
    activeMenuColor: "#7BB661",
    titleBackground: "#324832",
    submitButtonBackgroundColor: "#6FAF70",
    linkBackgroundColor: "#425B42",
    labelColor: "#A3B18A",
    jobColor: "#8F9779"
  },
  ocean: {
    primaryColor: "#176C8D",
    backgroundColor: "#0B1D2B",
    headerBackgroundColor: "#194F6F",
    textColor: "#D1E8F2",
    menuBackgroundColor: "#123B57",
    activeMenuBackgroundColor: "#0A2A43",
    activeMenuColor: "#59A7D3",
    titleBackground: "#165B7D",
    submitButtonBackgroundColor: "#3BB0D6",
    linkBackgroundColor: "#256A87",
    labelColor: "#7AAAC0",
    jobColor: "#5B7D8A"
  },
  sunset: {
    primaryColor: "#D35400",
    backgroundColor: "#2C1A0A",
    headerBackgroundColor: "#7E3814",
    textColor: "#FAD7A0",
    menuBackgroundColor: "#4E2A0A",
    activeMenuBackgroundColor: "#3B1F07",
    activeMenuColor: "#F39C12",
    titleBackground: "#5A2E0B",
    submitButtonBackgroundColor: "#E67E22",
    linkBackgroundColor: "#7B3F00",
    labelColor: "#C2B280",
    jobColor: "#A57C3B"
  },
  lavender: {
    primaryColor: "#6A5ACD",
    backgroundColor: "#1E1B2A",
    headerBackgroundColor: "#483D8B",
    textColor: "#DCD6F7",
    menuBackgroundColor: "#2C2754",
    activeMenuBackgroundColor: "#211E3E",
    activeMenuColor: "#B39EB5",
    titleBackground: "#3B3475",
    submitButtonBackgroundColor: "#8A79AF",
    linkBackgroundColor: "#564F7A",
    labelColor: "#A99BBE",
    jobColor: "#7D73A3"
  },
  desert: {
    primaryColor: "#C19A6B",
    backgroundColor: "#3E2F1C",
    headerBackgroundColor: "#8B6D5C",
    textColor: "#F5F1E3",
    menuBackgroundColor: "#5C4A3C",
    activeMenuBackgroundColor: "#4A3B2B",
    activeMenuColor: "#D2B48C",
    titleBackground: "#7A5F46",
    submitButtonBackgroundColor: "#B38B59",
    linkBackgroundColor: "#927B63",
    labelColor: "#C1A57B",
    jobColor: "#A7885E"
  },
  aurora: {
    primaryColor: "#4ECDC4",
    backgroundColor: "#1A374D",
    headerBackgroundColor: "#406882",
    textColor: "#F1F6F9",
    menuBackgroundColor: "#33658A",
    activeMenuBackgroundColor: "#2F4858",
    activeMenuColor: "#72EFDD",
    titleBackground: "#274C77",
    submitButtonBackgroundColor: "#3FC1C9",
    linkBackgroundColor: "#2A6F97",
    labelColor: "#91A6FF",
    jobColor: "#5C7AEA"
  },
  coral: {
    primaryColor: "#FF6F61",
    backgroundColor: "#3B1F2B",
    headerBackgroundColor: "#7F4F4F",
    textColor: "#FFF5E1",
    menuBackgroundColor: "#613F3F",
    activeMenuBackgroundColor: "#4A2C2E",
    activeMenuColor: "#FFA07A",
    titleBackground: "#6E3B3B",
    submitButtonBackgroundColor: "#FF826E",
    linkBackgroundColor: "#98514E",
    labelColor: "#D9B08C",
    jobColor: "#B27666"
  },
  mint: {
    primaryColor: "#3EB489",
    backgroundColor: "#1C3F2D",
    headerBackgroundColor: "#2E6647",
    textColor: "#E6F2F0",
    menuBackgroundColor: "#2D5C42",
    activeMenuBackgroundColor: "#244733",
    activeMenuColor: "#70C1B3",
    titleBackground: "#3A6B4F",
    submitButtonBackgroundColor: "#5DD39E",
    linkBackgroundColor: "#2E7D54",
    labelColor: "#9AD3BC",
    jobColor: "#76B39D"
  }
};

export default themes;
