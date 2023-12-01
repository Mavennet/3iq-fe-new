import supportedLanguages from "../supportedLanguages";
import { BookIcon } from "@sanity/icons";

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  name: "fundPerformance",
  type: "document",
  title: "Fund Performance",
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
      title: "Fund Returns",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "a2",
      type: "string",
      title: "Inception Date"
    },
    {
      name: "a3",
      type: "string",
      title: "1 Month"
    },
    {
      name: "a4",
      type: "string",
      title: "3 Month"
    },
    {
      name: "a5",
      type: "string",
      title: "6 Month"
    },
    {
      name: "a6",
      type: "string",
      title: "1 YR"
    },
    {
      name: "a7",
      type: "string",
      title: "Yeaer to Date"
    },
    {
      name: "a8",
      type: "string",
      title: "Since Inception	"
    },
    {
      name: "a9",
      type: "string",
      title: "3 YR"
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
