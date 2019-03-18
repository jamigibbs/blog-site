import React from "react"
import { rhythm } from "../utils/typography"

class Layout extends React.Component {
  render() {
    const { children } = this.props
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: '740px',
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()} Jami Gibbs
        </footer>
      </div>
    )
  }
}

export default Layout
