import supportedLanguages from "../supportedLanguages";
import { BookIcon } from "@sanity/icons";

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  name: "yearFundHistorialPerformance",
  type: "document",
  title: "Yearly Fund Historical Performance",
  icon: BookIcon,
  fields: [
    {
      name: "name",
      type: "string",
      title: "Name (*)",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "a1",
      type: "string",
      title: "Fund Returns (year)",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "a2",
      type: "string",
      title: "Jan"
    },
    {
      name: "a3",
      type: "string",
      title: "Feb"
    },
    {
      name: "a4",
      type: "string",
      title: "March"
    },
    {
      name: "a5",
      type: "string",
      title: "April"
    },
    {
      name: "a6",
      type: "string",
      title: "May"
    },
    {
      name: "a7",
      type: "string",
      title: "June"
    },
    {
      name: "a8",
      type: "string",
      title: "July"
    },
    {
      name: "a9",
      type: "string",
      title: "August"
    },
    {
      name: "a99",
      type: "string",
      title: "September"
    },
    {
      name: "a999",
      type: "string",
      title: "October"
    },
    {
      name: "a9999",
      type: "string",
      title: "November"
    },
    {
      name: "a99999",
      type: "string",
      title: "December"
    },
    {
      name: "a999999",
      type: "string",
      title: "Annual or YTD",
      validation: Rule => Rule.error("Information required.").required()
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
      title: `name`
    },
    prepare({ title }) {
      return {
        title: `${title}`
      };
    }
  }
};
