export const newsPostSchema = {
    $id: 'https://example.com/post.schema.json',
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'NewsPost',
    type: 'object',
    required: ['_id'],
    properties: {
      _id: {
        type: 'string',
      },
      title: {
        type: 'string',
      },
      body: {
        type: 'string',
      },
      category: {
        type: 'string',
      },
      verificationHash: {
        type: 'string',
      },
      author: {
        type: 'string',
      },
      postDate: {
        type: 'integer',
        minimum: 0,
      },
      published: {
        type: 'boolean'
      },
    },
}