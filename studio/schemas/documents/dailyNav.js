import supportedLanguages from "../supportedLanguages";
import { BookIcon } from "@sanity/icons";

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  name: "dailyNav",
  type: "document",
  title: "Daily Nav",
  icon: BookIcon,
  fields: [
    {
      name: "name",
      type: "localeString",
      title: "Name (*)",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "dailyNavTitle",
      type: "localeString",
      title: "Daily Nav Title (*)",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "columnOne",
      type: "localeString",
      title: "Column One Value"
    },
    {
      name: "columnTwo",
      type: "localeString",
      title: "Column Two Value"
    },
    {
      name: "columnThree",
      type: "localeString",
      title: "Column Three Value"
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
