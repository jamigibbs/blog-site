import React from "react"
import { Link, graphql } from "gatsby"

import Header from '../components/header'
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <div>
      <Header title={siteTitle} logoImage={data.logoImage} />
      <Layout location={this.props.location}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <small className="post__date">{node.frontmatter.date}</small>
              <h3
                className="post__title"
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              { node.frontmatter.subtitle && 
                <h2 className="post__subtitle">{node.frontmatter.subtitle}</h2>
              }
              <p
                style={{marginBottom: '10px'}}
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
              <div className="post__read-more">
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  Read more...
                </Link>
              </div>
              <hr />
            </div>
            
          )
        })}
      </Layout>
      </div>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    logoImage: file(absolutePath: { regex: "/logo/" }) {
      childImageSharp {
        fixed(width: 30, height: 30) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            subtitle
            description
          }
        }
      }
    }
  }
`
