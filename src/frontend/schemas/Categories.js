export const categorySchema = {
    $id: 'https://example.com/post.schema.json',
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Category',
    type: 'object',
    required: ['_id'],
    properties: {
      _id: {
        type: 'string',
      },
      tag: {
        type: 'string',
      },
    },
}