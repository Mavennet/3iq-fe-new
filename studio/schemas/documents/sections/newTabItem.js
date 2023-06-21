import supportedLanguages from "../../supportedLanguages";
import { SplitHorizontalIcon } from "@sanity/icons";

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  type: "document",
  name: "newTabItem",
  title: "Tab Itemu",
  icon: SplitHorizontalIcon,
  fields: [
    {
      name: "name",
      type: "localeString",
      title: "Name (*)",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "pageSections",
      type: "array",
      title: "Page Sections (*)",
      description: "Select the page section that will be displayed",
      validation: Rule => [
        Rule.error("Information required.").required(),
        Rule.min(1).error("Please, select at least 1 page section.")
      ],
      of: [
        {
          type: "reference",
          to: [
            { type: "textSection" },
            { type: "why3iQ" },
            { type: "accordionText" }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      name: `name.${baseLanguage.id}`
    },
    prepare({ name = "" }) {
      const title = name;
      return {
        title,
        subtitle: "Tab Item"
      };
    }
  }
};
