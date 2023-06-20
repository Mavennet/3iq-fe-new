import supportedLanguages from "../../supportedLanguages";
import { SplitHorizontalIcon } from "@sanity/icons";

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  type: "document",
  name: "tabMenu",
  title: "Tab Menu",
  icon: SplitHorizontalIcon,
  fields: [
    {
      name: "name",
      type: "localeString",
      title: "Name (*)",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "newTabItems",
      type: "array",
      title: "Tab Items (*)",
      description: "Select the tab items that will be displayed",
      validation: Rule => [
        Rule.error("Information required.").required(),
        Rule.min(1).error("Please, select at least 1 tab item.")
      ],
      of: [
        {
          type: "reference",
          to: [{ type: "newTabItem" }]
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
        subtitle: "Tab Menu"
      };
    }
  }
};
