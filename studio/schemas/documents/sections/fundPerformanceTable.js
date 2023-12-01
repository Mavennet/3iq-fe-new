import supportedLanguages from "../../supportedLanguages";
import { ComponentIcon } from "@sanity/icons";

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  type: "document",
  name: "fundPerformanceTable",
  title: "Fund Performance Table",
  icon: ComponentIcon,
  fields: [
    {
      name: "name",
      type: "string",
      title: "Name (*)",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "heading",
      type: "localeString",
      description: "Optional title that will be displayed above the table",
      title: "Heading"
    },
    {
      name: "downloadButton",
      type: "boolean",
      title: "Enable download button?",
      description: "Show download button to save CSV data",
      initialValue: false
    },
    {
      name: "downloadFileName",
      type: "string",
      description: "Download File Name",
      title: "Download File Name"
    },
    {
      name: "headerTransparentLayout",
      type: "boolean",
      title: "Use layout with transparent header?",
      description: "Header will be a white color",
      initialValue: false
    },
    {
      name: "headerFundPerformance",
      type: "boolean",
      title: "Enable a specific header to Fund Performance Section?",
      description:
        "First cell blank, second cell Total Returns and third cell Annualized Returns",
      initialValue: false
    },
    {
      name: "colorfulLayout",
      type: "boolean",
      title: "Use a colorful layout?",
      description:
        "First cells with orange font and last cells with background blue",
      initialValue: false
    },
    {
      title: "Color",
      name: "color",
      type: "string",
      options: {
        list: [
          { title: "Light Blue", value: "lightBlue" },
          { title: "Dark Blue", value: "darkBlue" },
          { title: "Orange", value: "orange" }
        ],
        layout: "radio"
      }
    },
    {
      name: "fundPerformance",
      title: "Fund Performance",
      description: "Add new rows to the table",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "fundPerformance" }],
          title: "Fund Performance"
        }
      ]
    },
    {
      name: "embed",
      type: "localePortableText",
      title: "Description",
      description:
        "This field you can add any text to display above either the Endpoint API table or the HTML one"
    }
  ],
  preview: {
    select: {
      title: "name"
    },
    prepare({ title }) {
      return {
        title,
        subtitle: "Custom Table section"
      };
    }
  }
};
