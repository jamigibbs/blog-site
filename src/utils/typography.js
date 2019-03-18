import Typography from "typography"
import Wordpress2016 from "typography-theme-wordpress-2016"

Wordpress2016.overrideThemeStyles = () => {
  return {
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
    "body": {
      color: 'rgba(0,0,0,.84)'
    },
    "h1,h2,h3,h4,h5,h6": {
      fontFamily: "'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Geneva,Arial,sans-serif",
      color: 'black',
      marginTop: '10px',
      marginBottom: '10px'
    },
    "h2, h3, h4": {
      letterSpacing: '-.03em'
    },
    "h4": {
      lineHeight: 1.58,
      fontSize: '18px',
      textTransform: 'normal'
    },
    "p": {
      fontSize: "18px",
      lineHeight: 1.8,
      color: "rgba(0, 0, 0, .7)",
      letterSpacing: "-.003em"
    },
    "a": {
      color: 'rgba(0, 0, 0, .80)'
    },
    "hr": {
      background: "hsla(0,0%,0%,0.1)"
    },
    "ul, ol": {
      marginLeft: '1.75rem',
      fontSize: '18px',
      lineHeight: 1.8,
      color: 'rgba(0, 0, 0, .7)',
      letterSpacing: '-.003em'
    },
    "code": {
      fontFamily: 'Menlo,Monaco,"Courier New",Courier,monospace',
      padding: '3px 4px',
      background: 'rgba(0,0,0,.05)',
      fontSize: '16px'
    },
    "pre": {
      display: "block",
      padding: "20px",
      margin: "0 0 10px",
      fontSize: "16px",
      lineHeight: "1.42857143",
      color: "#333",
      wordBreak: "break-all",
      wordWrap: "break-word",
      backgroundColor: "#f5f5f5",
    },
    "pre code": {
      padding: 0,
      fontSize: "inherit",
      color: "inherit",
      whiteSpace: "pre-wrap",
      backgroundColor: "transparent",
      borderRadius: 0,
      lineHeight: 1
    }
  }
}

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
