import supportedLanguages from "../supportedLanguages";
import { BookIcon } from "@sanity/icons";

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  name: "tiqFundPerformance",
  type: "document",
  title: "Global Cryptoasset Fund Performance",
  icon: BookIcon,
  fields: [
    {
      name: "name",
      type: "localeString",
      title: "Name (*)",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "cryptoName",
      type: "localeString",
      title: "Cryptocurrency Price Feed*",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "cryptoLogo",
      type: "image",
      title: "Cryptocurrency Logo*",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "price",
      type: "url",
      description:
        "Insert a CoinGecko URL for the API endpoint that will retrieve the data to populate the table automatically",
      title: "Price Endpoint"
    },
    {
      name: "indexWeight",
      type: "localeString",
      title: "Index Weight~"
    },
    {
      name: "portfolioWeight",
      type: "localeString",
      title: "Portfolio Weight"
    },
    {
      name: "priority",
      title: "Priority",
      type: "number",
      validation: Rule =>
        Rule.min(0)
          .integer()
          .positive()
    }
  ],
  preview: {
    select: {
      name: `name.${baseLanguage.id}`
    },
    prepare({ name }) {
      return {
        title: `${name}`
      };
    }
  }
};
