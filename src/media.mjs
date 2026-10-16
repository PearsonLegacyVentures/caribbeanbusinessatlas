/**
 * Business-specific editorial visual references.
 * These are links to real published business websites or publisher-owned portfolio screenshots.
 * Publicly visible does NOT mean licensed for republication. Third-party image permission
 * and host hotlink permission must be cleared before production publication.
 * A real photograph from a source website is NOT evidence of a company's specific results.
 */
const media=(url,alt,credit,source,kind="Company photograph",rights="permission-pending")=>({url,alt,credit,source,kind,rights});

export const companyMedia={
 "tranquilitas-day-spa":media(
  "https://static.wixstatic.com/media/8baa80_9f369da51736427ea8060145774ea1a4~mv2.jpg/v1/crop/x_0,y_1269,w_4000,h_3462/fill/w_600,h_450,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/5A8A5993.jpg",
  "Photography from Tranquilitas Day Spa's real treatments and experiences gallery","Tranquilitas Day Spa","https://massagebahamas.com/","Company gallery photograph","publisher-owned"),
 "bahamas-ai-solutions":media(
  "https://raw.githubusercontent.com/PearsonLegacyVentures/BahamasAISolutions/main/public/project-previews/bahamas-ai-solutions.jpg",
  "Actual website preview for Bahamas AI Solutions, taken from its portfolio","Bahamas AI Solutions portfolio","https://bahamasaisolutions.com/our-work/","Actual website screenshot","publisher-owned"),
 "bahamas-mineral-company":media(
  "https://bahamamineralcompany.com/assets/conch-recovery.webp",
  "Conch shell material image published on the Bahama Mineral Co. website","Bahama Mineral Co.","https://bahamamineralcompany.com/","Company website image","publisher-owned"),
 "mel-js-event-rentals":media(
  "https://meljs-bahamas-joy.lovable.app/assets/gallery-sweetheart-table-DrhdNSKm.png",
  "Event table setting photographed for Mel J's Event Rentals gallery","Mel J's Event Rentals","https://meljs-bahamas-joy.lovable.app/","Company gallery photograph","publisher-owned"),
 "graycliff":media(
  "https://www.graycliff.com/wp-content/uploads/2013/11/hotel.jpg",
  "Graycliff Hotel exterior and historic Nassau property","Graycliff Hotel & Restaurant","https://www.graycliff.com/","Company website photograph"),
 "john-watlings-distillery":media(
  "https://johnwatlings.com/wp-content/uploads/2025/05/TheEstate2.jpg",
  "The historic estate pictured by John Watling's Distillery in Nassau","John Watling's Distillery","https://johnwatlings.com/","Company website photograph"),
 "cocoloop-bahamas":media(
  "https://raw.githubusercontent.com/PearsonLegacyVentures/BahamasAISolutions/main/public/project-previews/cocoloop-bahamas.jpg",
  "Website concept preview for CocoLoop Bahamas, not evidence of commercial operations","Bahamas AI Solutions project preview","https://bahamasaisolutions.com/our-work/","In-development concept screenshot","publisher-owned"),
 "pedal-paradise-bahamas":media(
  "https://img1.wsimg.com/isteam/ip/c1b0a4a6-d8ba-49b8-9f7f-1299f568af38/0F13127D-A03E-4D3B-B935-CD036589389D.jpeg",
  "Pedal Paradise Bahamas party-bike tour photo from the operator's official site","Pedal Paradise Bahamas","https://pedalparadiseadventures.com/","Operator website photograph"),
 "triblock-hr":media(
  "https://triblockhr.com/wp-content/uploads/2023/09/TRIBLOCK-HR-MAIN-Cropped-e1727052037859.png",
  "TriblockHR product illustration published on the software company's website","TriblockHR","https://triblockhr.com/","Product website artwork"),
 "gracekennedy":media(
  "https://gracekennedy.com/wp-content/uploads/2025/01/GraceKennedy-home-hero-1024x610.jpg",
  "GraceKennedy company website hero photograph","GraceKennedy Group","https://gracekennedy.com/","Company website photograph"),
 "massy-group":media(
  "https://massygroup.com/wp-content/uploads/2020/12/integrated-retail.jpg",
  "Massy Group integrated retail business image published on its official website","Massy Group","https://massygroup.com/our-business/","Company website photograph"),
 "sagicor":media(
  "https://www.sagicor.com/-/media/hero-images/boys-in-the-park.jpg?h=840&la=en-BB&w=1600&hash=3E4F428AFC035DEED2FC99756964F72E359E2C5E",
  "Community scene from the official Sagicor Barbados company website","Sagicor","https://www.sagicor.com/en-bb/about-sagicor","Company website photograph")
};
/** No Creative Growth Agency image: the specific entity has not been verified. */
export const storyImageCompany={
 "beyond-the-beach":"pedal-paradise-bahamas",
 "directory-trust":"graycliff",
 "regional-publication":"gracekennedy",
 "practical-technology":"bahamas-ai-solutions",
 "pedal-paradise-nassau-experience":"pedal-paradise-bahamas",
 "caribbean-native-payroll-triblock-hr":"triblock-hr",
 "conch-shell-commercial-materials-bahamas":"bahamas-mineral-company",
 "cocoloop-bahamas-circular-business-concept":"cocoloop-bahamas",
 "regional-firms-what-scale-looks-like":"massy-group"
};
export const storyMedia=slug=>companyMedia[storyImageCompany[slug]]||null;
