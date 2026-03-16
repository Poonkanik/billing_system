export const theme = {
  // Core palette — clean, professional, easy to read
  colors: {
    primary: '#1565C0',       // deep blue — primary actions
    primaryLight: '#1976D2',
    primaryDark: '#0D47A1',
    primaryBg: '#E3F2FD',     // blue tint bg

    secondary: '#00897B',     // teal — secondary actions / success
    secondaryBg: '#E0F2F1',

    danger: '#C62828',        // red — delete / cancel
    dangerLight: '#EF5350',
    dangerBg: '#FFEBEE',

    warning: '#E65100',       // orange — warnings
    warningBg: '#FFF3E0',

    success: '#2E7D32',       // green — positive
    successBg: '#E8F5E9',

    // Neutrals
    bg: '#F5F7FA',            // page background
    surface: '#FFFFFF',       // card / panel
    surfaceAlt: '#F0F4F8',    // alternate rows, subtle bg
    border: '#DDE3EA',        // borders
    borderDark: '#B0BEC5',

    // Text
    text: '#1A2332',          // primary text
    textMuted: '#546E7A',     // secondary text
    textLight: '#90A4AE',     // placeholder / hint

    // Sidebar
    sidebar: '#1A2332',       // dark sidebar
    sidebarActive: '#1565C0',
    sidebarText: '#B0BEC5',
    sidebarActiveText: '#FFFFFF',
  },
  fontSize: {
    xs: '11px', sm: '12px', base: '13px', md: '14px', lg: '16px', xl: '20px', xxl: '24px',
  },
  radius: { sm: '4px', md: '6px', lg: '10px', xl: '14px', full: '9999px' },
  shadow: {
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 2px 8px rgba(0,0,0,0.1)',
    lg: '0 4px 16px rgba(0,0,0,0.12)',
  },
};

export const C = theme.colors;
