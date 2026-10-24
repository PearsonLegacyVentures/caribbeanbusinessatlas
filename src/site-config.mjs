// Single source of truth for the public magazine's SEO domain and metadata.
// Update this file (and the host redirect middleware) when the canonical domain changes.
export const SITE_ORIGIN = 'https://mag.bahamasaisolutions.com';
export const SITE_NAME = 'Caribbean Business Atlas';
export const SITE_DESCRIPTION = 'Discover Caribbean businesses, founders, makers and local operators. Explore our researched business directory, island guides and original stories.';

// These routes remain accessible but are not ready as Google landing pages.
export const UNREADY_ROUTES = new Set(['/submit/','/directory/creative-growth-agency/']);

export const PAGE_DESCRIPTIONS = {
 '/': SITE_DESCRIPTION,
 '/directory/': 'Discover 21 Caribbean businesses across eight markets. Explore real operators, founders, makers, tours and professional services with links to their websites.',
 '/stories/': 'Read sourced stories about Caribbean entrepreneurs, small businesses, island tourism, makers, technology and practical ways local companies operate.',
 '/islands/': 'Explore Caribbean businesses by country: The Bahamas, Jamaica, Barbados, Trinidad and Tobago, Saint Lucia, Grenada, Turks and Caicos and Haiti.',
 '/about/': 'Learn about Caribbean Business Atlas, its mission to make regional businesses easier to discover, and the editorial standards behind its research.',
 '/editorial-policy/': 'Read Caribbean Business Atlas editorial standards, source verification, corrections, publisher interests and clearly identified promotional placements.',
 '/privacy/': 'Understand the Caribbean Business Atlas privacy notice, research practices and current business-submission data collection status.',
 '/submit/': 'Business submissions are not yet available. Explore Caribbean Business Atlas directory profiles and learn how future editorial suggestions will work.'
};
