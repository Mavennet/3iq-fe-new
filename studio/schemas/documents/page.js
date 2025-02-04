import supportedLanguages from "../supportedLanguages";
import { MasterDetailIcon } from "@sanity/icons";

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  name: "page",
  type: "document",
  title: "Page",
  icon: MasterDetailIcon,
  fieldsets: [
    {
      title: "SEO & metadata",
      name: "metadata"
    }
  ],
  fields: [
    {
      name: "title",
      type: "localeString",
      title: "Title (*)",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "content",
      type: "array",
      title: "Page sections (*)",
      description:
        "Content that will be displayed in the page with the same order",
      validation: Rule => [
        Rule.error("Information required.").required(),
        Rule.min(1).error("Please, select at least 1 page section.")
      ],
      of: [
        {
          type: "reference",
          to: [
            { type: "post" },
            { type: "newsCard" },
            { type: "automatedNewsCard" },
            { type: "tabMenu" },
            { type: "automatedArticles" },
            { type: "automatedLatest" },
            { type: "readMoreCard" },
            { type: "textSection" },
            { type: "plainText" },
            { type: "textSeparator" },
            { type: "hero" },
            { type: "ourFunds" },
            { type: "heroWithImage" },
            { type: "headerPost" },
            { type: "postOverview" },
            { type: "heroSailGP" },
            { type: "advertisement" },
            { type: "mailchimp" },
            { type: "podcasts" },
            { type: "search" },
            { type: "articlesSearch" },
            { type: "mainHero" },
            { type: "teamsVideoDisplay" },
            { type: "componentsTests" },
            { type: "animatedHero" },
            { type: "heroFirstVariation" },
            { type: "heroDoubleButton" },
            { type: "heroBigImage" },
            { type: "heroNft" },
            { type: "heroSubscribe" },
            { type: "heroPreview" },
            { type: "highlights" },
            { type: "teamsDisplay" },
            { type: "whatWeOffer" },
            { type: "accordionText" },
            { type: "contactUsForm" },
            { type: "webinarSubscribe" },
            { type: "subscribeForm" },
            { type: "locationsDisplay" },
            { type: "note" },
            { type: "quoteHeads" },
            { type: "quoteFounder" },
            { type: "quoteHeadsDubai" },
            { type: "readyToInvest" },
            { type: "awards" },
            { type: "categoriesList" },
            { type: "fundsDisclaimer" },
            { type: "keyBenefits" },
            { type: "sideBySideImages" },
            { type: "subscribeBlock" },
            { type: "headlineWithImages" },
            { type: "doubleOptions" },
            { type: "descriptionsWithButton" },
            { type: "tabsContent" },
            { type: "fundsContent" },
            { type: "fundsOverview" },
            { type: "timeline" },
            { type: "imageBesideText" },
            { type: "overflowHero" },
            { type: "articles" },
            { type: "howWePartnerClients" },
            { type: "serviceAndSolutions" },
            { type: "ocioServices" },
            { type: "why3iQ" },
            { type: "ocioHero" },
            { type: "textAndThreeImages" },
            { type: "textAndFourImages" }
          ]
        }
      ]
    },
    {
      name: "countries",
      title: "Countries (*)",
      description:
        "Choose the country that this content will be displayed into",
      type: "array",
      validation: Rule => [
        Rule.error("Information required.").required(),
        Rule.min(1).error("Please, select a country.")
      ],
      of: [{ type: "reference", to: { type: "country" } }]
    },
    {
      name: "description",
      type: "localeText",
      title: "Description",
      description: "This description populates meta-tags on the webpage",
      fieldset: "metadata"
    },
    {
      name: "openGraphImage",
      type: "image",
      title: "Open Graph Image",
      description: "Image for sharing previews on Facebook, Twitter etc.",
      fieldset: "metadata"
    }
  ],

  preview: {
    select: {}
  },
  preview: {
    select: {
      title: `title.${baseLanguage.id}`,
      media: "openGraphImage",
      firstCountryName: `countries.0.name`,
      secondCountryName: `countries.1.name`,
      thirdCountryName: `countries.2.name`,
      fourthCountryName: `countries.3.name`,
      fifthCountryName: `countries.4.name` // By passing the countries names, it will be able to access them within prepare() without only receiving the reference _ref
    },
    prepare({
      title,
      media,
      firstCountryName = "",
      secondCountryName,
      thirdCountryName,
      fourthCountryName,
      fifthCountryName
    }) {
      let countryNames = firstCountryName;
      countryNames = secondCountryName
        ? countryNames.concat(", " + secondCountryName)
        : countryNames;
      countryNames = thirdCountryName
        ? countryNames.concat(", " + thirdCountryName)
        : countryNames;
      countryNames = fourthCountryName
        ? countryNames.concat(", " + fourthCountryName)
        : countryNames;
      countryNames = fifthCountryName
        ? countryNames.concat(", " + fifthCountryName)
        : countryNames;

      return {
        title,
        media,
        subtitle: `${countryNames}`
      };
    }
  }
};
