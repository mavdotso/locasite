import { ModernTheme } from "@/types/simple-theme";

export function getBusinessStyles(theme: ModernTheme) {
  const fontSizes = {
    small: { base: '14px', h1: '2rem', h2: '1.75rem', h3: '1.5rem' },
    normal: { base: '16px', h1: '2.5rem', h2: '2rem', h3: '1.75rem' },
    large: { base: '18px', h1: '3rem', h2: '2.5rem', h3: '2rem' }
  };
  
  const spacings = {
    compact: { section: '2rem', element: '0.75rem', gap: '0.5rem' },
    normal: { section: '4rem', element: '1.5rem', gap: '1rem' },
    spacious: { section: '6rem', element: '2.5rem', gap: '1.5rem' }
  };
  
  const radii = {
    none: '0',
    small: '0.375rem',
    medium: '0.75rem',
    large: '1.5rem'
  };

  return {
    // Hero section styles
    hero: {
      section: {
        background: `linear-gradient(to right, ${theme.brandColor}, ${theme.primaryButtonColor})`,
        color: 'white',
        minHeight: '60vh',
        position: 'relative' as const,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      },
      overlay: {
        position: 'absolute' as const,
        inset: 0,
        backgroundColor: `${theme.brandColor}66`, // 40% opacity
      },
      content: {
        position: 'relative' as const,
        zIndex: 10,
        textAlign: 'center' as const,
        padding: '8rem 1rem',
      },
      title: {
        fontSize: fontSizes[theme.fontSize].h1,
        fontWeight: 700,
        marginBottom: '1.5rem',
        color: 'white',
      },
      subtitle: {
        fontSize: '1.5rem',
        color: 'rgba(255, 255, 255, 0.9)',
        maxWidth: '48rem',
        margin: '0 auto',
      },
    },
    
    // About section styles
    about: {
      section: {
        padding: `${spacings[theme.spacing].section} 0`,
        backgroundColor: theme.sectionBackgroundColor,
      },
      container: {
        maxWidth: '80rem',
        margin: '0 auto',
        padding: `0 ${spacings[theme.spacing].element}`,
      },
      title: {
        fontSize: fontSizes[theme.fontSize].h2,
        fontWeight: 700,
        textAlign: 'center' as const,
        marginBottom: '3rem',
        color: theme.headingColor,
      },
      content: {
        fontSize: '1.125rem',
        lineHeight: 1.7,
        color: theme.textColor,
        maxWidth: '56rem',
        margin: '0 auto',
      },
    },
    
    // Gallery styles
    gallery: {
      section: {
        padding: `${spacings[theme.spacing].section} 0`,
        backgroundColor: theme.backgroundColor,
      },
      container: {
        maxWidth: '80rem',
        margin: '0 auto',
        padding: `0 ${spacings[theme.spacing].element}`,
      },
      title: {
        fontSize: fontSizes[theme.fontSize].h2,
        fontWeight: 700,
        textAlign: 'center' as const,
        marginBottom: '3rem',
        color: theme.headingColor,
      },
      grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: spacings[theme.spacing].gap,
      },
      image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        borderRadius: radii[theme.borderRadius],
      },
      imageWrapper: {
        position: 'relative' as const,
        aspectRatio: '1',
        overflow: 'hidden',
        borderRadius: radii[theme.borderRadius],
      },
    },
    
    // General styles
    text: {
      color: theme.textColor,
      fontFamily: theme.fontFamily === 'system' ? 'system-ui, -apple-system, sans-serif' : theme.fontFamily,
    },
    link: {
      color: theme.linkColor,
      textDecoration: 'none',
    },
    button: {
      primary: {
        backgroundColor: theme.primaryButtonColor,
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: radii[theme.borderRadius],
        border: 'none',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'opacity 0.2s',
      },
      secondary: {
        backgroundColor: theme.secondaryButtonColor,
        color: theme.textColor,
        padding: '0.75rem 1.5rem',
        borderRadius: radii[theme.borderRadius],
        border: 'none',
        fontWeight: 500,
        cursor: 'pointer',
        opacity: theme.secondaryButtonOpacity / 100,
        transition: 'opacity 0.2s',
      },
    },
  };
}