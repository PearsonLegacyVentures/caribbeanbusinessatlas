# Photo source and publication-permission register

**Source images on the public site — updated 16 October 2026.** The previous design used abstract, misleadingly generic imagery. This branch replaces it with images located on actual company websites. Images are **remotely referenced**, not copied into our repository. Website visibility and attribution do **not** grant image republication rights. The site is publicly accessible; licenses or publication permissions for third-party imagery remain to be confirmed. External image hotlinking does not grant republication rights. Do not imply that website art, screenshots, or concept mockups are photographs of commercial operations.

Source-of-truth: `src/media.mjs`, which records every remote image URL, its company source, descriptive alt text, media type, and rights status.

| Business | Real source | Material | Before public launch |
|---|---|---|---|
| Tranquilitas Day Spa | massagebahamas.com official gallery | Company treatment photograph | Publisher confirms own rights to image |
| Bahamas AI Solutions | `PearsonLegacyVentures/BahamasAISolutions/public/project-previews/` | Actual website screenshot | Publisher-owned; verify screenshot shows current build |
| Bahama Mineral Co. | bahamamineralcompany.com/assets | Company site conch imagery | Confirm whether visual is a photo vs composed concept art; do not claim operating plant |
| Mel J's Event Rentals | meljs-bahamas-joy.lovable.app gallery | Event-setup gallery photograph | Publisher confirms rights |
| Graycliff | graycliff.com official hotel gallery | Property photo | **External permission pending** |
| John Watling's Distillery | johnwatlings.com official photos | Estate/property photo | **External permission pending** |
| CocoLoop Bahamas | Bahamas AI Solutions published portfolio preview | **Website concept screenshot only** | Do not imply product launch or photographed operations |
| Pedal Paradise Bahamas | pedalparadiseadventures.com official meta image | Tour/product image | **External permission pending** |
| Creative Growth Agency | No verified company | **No photograph used** | Confirm correct company identity and rights |
| Triblock HR | triblockhr.com official site | Product/site artwork (not a staff photograph) | **External permission pending** |
| GraceKennedy | gracekennedy.com official site | Official hero photograph | **External permission pending** |
| Massy Group | massygroup.com official business page | Integrated retail photo | **External permission pending** |
| Sagicor | sagicor.com Barbados company pages | Official community photograph | **External permission pending** |
| The New Duff | Official New Duff/Gran Bahama Squarespace site | Business website photograph | **External permission pending** |
| Blue Mountain Tours Jamaica | Official tour site / Island Routes image host | Tour photograph | **External permission pending** |
| Earthworks Pottery | earthworks-pottery.com | Studio ceramics photograph | **External permission pending** |
| D’ Market Movers | dmarketmovers.com | Company identity artwork, not operations photograph | **External permission pending**; storefront availability to confirm |
| Fond Doux Eco Resort | fonddouxresort.com | Estate/resort photograph | **External permission pending** |
| Grenada Chocolate Company | thegrenadachocolate.com | Product photograph | **External permission pending** |
| Caicos Dream Tours | caicosdreamtours.com | Operator snorkeling photograph | **External permission pending** |
| Kreyòl Essence | kreyolessence.com | Official sourcing/social-impact photograph | **External permission pending** |

## Implementation and limitations

- Each image has a direct source credit linking to the official company page.
- The build uses HTML `img` with descriptive alt, explicit width/height, lazy loading except high-priority hero media, and progressive enhancement.
- A photo error removes the broken image glyph and reveals a branded fallback. Inaccessible third-party hosts will therefore not leave visually broken cards.
- Hotlinked image URLs can change, refuse external embeds, disappear or impose unpredictable bandwidth. Photograph loading should be smoke-tested after major deployments.
- Rights must be cleared before we self-host, modify, or use external photographs in production/marketing. If permission cannot be secured, choose legitimately licensed editorial photography clearly labeled as illustrative or replace with a real company-approved image.
- No generated images are presented as independent documentary proof.

## New article imagery — 28 October 2026

- **Beach Massage in Nassau: Tranquilitas Brings the Spa to the Shore** (`/stories/beach-massage-nassau-tranquilitas/`): image URL `https://static.wixstatic.com/media/8baa80_43023c407ba041e4aa27791a2c22479f~mv2.jpg` retrieved from the official Tranquilitas Nassau service page at `https://www.massagebahamas.com/best-massage-nassau-bahamas`. This is a **company-supplied service-page image**, not independent evidence of a specific delivered session. The editor treats it as a publisher-owned promotional visual; confirm the underlying image's original rights before reusing it elsewhere.

- Current beach treatment settings and booking conditions were confirmed against the official `https://www.massagebahamas.com/beach-massage-nassau` page. The article does not promise beach access at any hotel without approval.
