import { SplitHorizontalIcon } from '@sanity/icons'

export default {
  type: "document",
  name: "textSection",
  title: "Text Block",
  icon: SplitHorizontalIcon,
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
      title: "Heading",
      description: "Optional heading for the text section above the content"
    },
    {
      name: "text",
      type: "localePortableText",
      title: "Text (*)",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "videoSrc",
      type: "string",
      title: "YouTube video ID",
      description: "Optional display of an YouTube video through its ID"
    },
    {
      name: "videoDescription",
      type: "localePortableText",
      title: "Video Description"
    },
    {
      name: "member",
      type: "array",
      title: "Team member",
      description: "Select the team members that are part of this team",
      validation: Rule => [
        Rule.max(1).error("Please, select at only 1 team member.")
      ],
      of: [
        {
          type: "reference",
          to: [{ type: "person" }]
        }
      ]
    },
    {
      name: "button",
      type: "localeCta",
      title: "Optional button",
      description: "Optional button that will be displayed above the content"
    },
    {
      name: "isButtonCentralized",
      type: "boolean",
      title: "Is the button centralized?",
      description:
        "Enable this option to display the optional button aligned on the center",
      initialValue: true
    },
    {
      name: "backgroundImage",
      type: "image",
      title: "Background image",
      description: "Optional background image for the section",
      options: {
        hotspot: true
      }
    },
    {
      name: "isGrayBackground",
      type: "boolean",
      description:
        "Enable this to add an optional gray background to highlight the text",
      title: "Add gray background to the text?",
      initialValue: false
    },
    {
      name: "elementId",
      type: "string",
      title: "Element Id",
    }
  ],
  preview: {
    select: {
      title: "name",
      media: "backgroundImage"
    },
    prepare({ title, media }) {
      return {
        title,
        subtitle: "Text Block section",
        media
      };
    }
  }
};
