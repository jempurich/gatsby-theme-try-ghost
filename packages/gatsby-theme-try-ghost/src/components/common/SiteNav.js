import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import { Navigation, SocialLinks } from '.'

const SiteNav = ({ data, className, postTitle }) => {
    const config = data.site.siteMetadata
    const site = data.allGhostSettings.edges[0].node
    const secondaryNav = site.secondary_navigation && 0 < site.secondary_navigation.length

    // allow plugins to add menu items
    let navigation = site.navigation
    let urls = navigation.map(item => item.url)
    if (config.navigation && config.navigation.length >= 0) {
        config.navigation.map(item => urls.indexOf(item.url) === -1 && navigation.push(item))
    }

    return (
        <nav className={className}>
            <div className="site-nav-left-wrapper">
                <div className="site-nav-left">
                    {site.logo ? (
                        <a className="site-nav-logo" href={config.siteUrl}><img src={site.logo} alt={site.title} /></a>
                    ) : (
                        <a className="site-nav-logo" href={config.siteUrl}>{site.title}</a>
                    )}
                    <div className="site-nav-content">
                        <Navigation data={navigation} />
                        { postTitle &&
                            <span className={`nav-post-title ${site.logo || `dash`}`}>{postTitle}</span>
                        }
                    </div>
                </div>
            </div>
            <div className="site-nav-right">
                { secondaryNav ? (
                    <Navigation data={site.secondary_navigation} />
                ) : (
                    <div className="social-links">
                        <SocialLinks site={site} siteUrl={config.siteUrl} />
                    </div>
                )}
            </div>
        </nav>
    )
}

SiteNav.propTypes = {
    data: PropTypes.shape({
        file: PropTypes.object,
        allGhostSettings: PropTypes.object.isRequired,
        site: PropTypes.object.isRequired,
    }).isRequired,
    className: PropTypes.string.isRequired,
    postTitle: PropTypes.string,
}

const SiteNavQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettingsForSiteNav {
                allGhostSettings {
                    edges {
                        node {
                            ...GhostSettingsFields
                        }
                    }
                }
                file(relativePath: {eq: "ghost-icon.png"}) {
                    childImageSharp {
                        fixed(width: 30, height: 30) {
                            ...GatsbyImageSharpFixed
                        }
                    }
                }
                site {
                    siteMetadata {
                        ...SiteMetadataFields
                    }
                }
            }
        `}
        render={data => <SiteNav data={data} {...props} />}
    />
)

export default SiteNavQuery
