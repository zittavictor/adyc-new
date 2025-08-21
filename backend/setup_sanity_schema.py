"""
Sanity Schema Setup for ADYC Blog System

This file contains the schema definition that needs to be added to your Sanity Studio.
You need to create this schema in your Sanity project dashboard.

To set up the schema:
1. Go to https://www.sanity.io/manage
2. Select your project (dqcc4bw6)
3. Go to "Schema" tab or set up Sanity Studio
4. Create the following document type:

blogPost.js:
"""

SANITY_BLOG_POST_SCHEMA = """
export default {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'content',
      title: 'Content',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'Brief summary of the blog post'
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'authorEmail',
      title: 'Author Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'youtubeUrl',
      title: 'YouTube Video URL',
      type: 'url',
      description: 'YouTube video URL for this blog post',
      validation: Rule => Rule.uri({
        allowRelative: false,
        scheme: ['http', 'https']
      })
    },
    {
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime'
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      published: 'published'
    },
    prepare(selection) {
      const {title, author, published} = selection
      return {
        title: title,
        subtitle: `By ${author} ${published ? '(Published)' : '(Draft)'}`
      }
    }
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedDateDesc',
      by: [
        {field: 'publishedAt', direction: 'desc'},
        {field: 'createdAt', direction: 'desc'}
      ]
    },
    {
      title: 'Created Date, New',
      name: 'createdDateDesc',
      by: [
        {field: 'createdAt', direction: 'desc'}
      ]
    }
  ]
}
"""

if __name__ == "__main__":
    print("Sanity Schema for ADYC Blog System")
    print("=" * 50)
    print("\nCopy the following schema to your Sanity Studio:\n")
    print(SANITY_BLOG_POST_SCHEMA)
    print("\n" + "=" * 50)
    print("\nNext Steps:")
    print("1. Go to https://www.sanity.io/manage")
    print("2. Select your project (dqcc4bw6)")
    print("3. Set up Sanity Studio or go to Schema tab")
    print("4. Create a new document type called 'blogPost'")
    print("5. Copy the schema above into the blogPost.js file")
    print("6. Deploy the schema changes")