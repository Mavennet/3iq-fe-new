import { format, parseISO } from "date-fns";
import { DocumentIcon } from "@sanity/icons";

export default {
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentIcon,
  initialValue: () => ({
    publishedAt: new Date().toISOString()
  }),
  fields: [
    {
      name: "name",
      title: "Name (*)",
      type: "string",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "heading",
      title: "Heading (*)",
      type: "localeString",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "publishedAt",
      title: "Published at (*)",
      type: "datetime",
      description:
        "Used in order to filter the latest posts when displaying new cards automatically by category",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "author",
      title: "Author (*)",
      type: "reference",
      to: [
        {
          type: "person"
        }
      ],
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "figure"
    },
    {
      name: "body",
      title: "Body (*)",
      type: "localePortableText",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "videoSrc",
      type: "string",
      title: "YouTube embed URL",
      description:
        "Optional display video in sidebar with related articles links. This is how you use, just replace the video_id here -> https://www.youtube.com/embed/{video_id}. It should look like https://www.youtube.com/embed/IA-ieZoS1lQ"
    },
    {
      name: "videoText",
      title: "Text below video",
      type: "localeString",
      description: "Optional text talking about video."
    },
    {
      name: "caDisclaimer",
      type: "localePortableText",
      title: "CA Disclaimer (*)"
    },
    {
      name: "aeDisclaimer",
      type: "localePortableText",
      title: "AE Disclaimer (*)"
    },
    {
      name: "usDisclaimer",
      type: "localePortableText",
      title: "US Disclaimer (*)"
    },
    {
      name: "categories",
      type: "array",
      title: "Categories",
      description: "Select one or more categories that this post belongs to",
      validation: Rule => [
        Rule.unique().error("You have duplicate categories"),
        Rule.error("Information required.").required(),
        Rule.min(1).error("Please, select at least 1 category")
      ],
      of: [
        {
          type: "reference",
          to: [{ type: "category" }]
        }
      ]
    },
    {
      name: "relatedContent",
      type: "array",
      title: "Related Content",
      description: "Select one or more posts that this post relates to",
      validation: Rule => [
        Rule.unique().error("You have duplicate posts")
      ],
      of: [
        {
          type: "reference",
          to: [{ type: "post" }]
        }
      ]
    }
  ],
  orderings: [
    {
      title: "Published At",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }]
    },
    {
      title: "Name",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }]
    }
  ],
  preview: {
    select: {
      title: "name",
      publishedAt: "publishedAt",
      media: "mainImage",
      author: "author.name"
    },
    prepare({ title = "No title", publishedAt, media, author }) {
      const subtitle =
        "Published at " +
        format(parseISO(publishedAt), "yyyy/MM/dd") +
        " by " +
        author;
      return {
        title,
        media,
        subtitle: subtitle
      };
    }
  }
};
