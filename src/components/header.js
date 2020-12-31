import React from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"

import Bio from "./bio"

class Header extends React.Component {
  state = {
    scrollPos: 0
  }

  constructor(props){
    super(props)
    //this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    //window.addEventListener('scroll', this.handleScroll)
    //this.header = document.querySelector('.header')
  }
  
  componentWillUnmount() {
    //window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    if ((document.body.getBoundingClientRect()).top > this.state.scrollPos) {
      // Going up
      this.header.style.position = 'fixed'
      this.header.classList.remove('header--hidden')
    } else {
      // Going down
      this.header.classList.add('header--hidden')
    }

    this.setState({
      scrollPos: document.body.getBoundingClientRect().top
    })

    if (this.state.scrollPos === 0) {
      this.header.classList.remove('header--hidden')
      this.header.style.position = 'relative'
    }
  }

  render() {
    const { title, logoImage } = this.props

    return (
      <header className="header">
        <div className="header__wrap">
          <div className="header__content">
            <div className="header__logo-wrap">
              <div className="header__logo">
              <Image
                title="Logo"
                alt="Logo"
                fixed={logoImage.childImageSharp.fixed}
              />
              </div>
              <div className="header__line">&nbsp;</div>
              <h1 className="header__title"><Link to="/">{title}</Link></h1>
            </div>
            <div className="header__profile">
              <Bio />
            </div>
          </div>
        </div>
      </header>
    )
  }
}


export default Header