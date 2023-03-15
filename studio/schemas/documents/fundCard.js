import { MdCreditCard } from "react-icons/md";
import supportedLanguages from "../supportedLanguages";

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  name: "fundCard",
  title: "Fund Card",
  type: "document",
  icon: MdCreditCard,
  fields: [
    {
      name: "heading",
      title: "Heading (*)",
      type: "localeString",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "codes",
      type: "array",
      title: "Codes",
      of: [
        {
          title: "Code",
          type: "string"
        }
      ]
    },
    {
      name: "text",
      title: "Text",
      type: "localeString"
    },
    {
      name: "dailyNavLabel",
      title: "Daily NAV Label",
      type: "localeString",
    },
    {
      name: "dailyNav",
      title: "Daily NAV (*)",
      type: "localeString",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: 'endpoint',
      type: 'url',
      title: 'API Endpoint',
      description: "Insert an optional URL for the API endpoint that will retrieve the data to populate the table automatically",
      validation: Rule =>
        Rule.uri({
          allowRelative: false,
          scheme: ['https', 'http'],
        }),
    },
    {
      title: "Card Color",
      name: "cardColor",
      type: "string",
      options: {
        list: [
          { title: "Yellow", value: "0" },
          { title: "Dark Blue", value: "1" },
          { title: "Blue", value: "2" },

        ],
        layout: "radio"
      }
    },
    {
      name: "button",
      type: "localeCta",
      title: "Read More Button"
    },
    {
      name: "backgroundImage",
      title: "Background Image",
      type: "figure"
    }
  ],

  preview: {
    select: {
      title: `heading.${baseLanguage.id}`,
      media: "backgroundImage"
    },
    prepare({ title = "No title", media }) {
      return {
        title,
        media
      };
    }
  }
};
