export const profileSchema = {
    $id: 'https://example.com/post.schema.json',
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Profile',
    type: 'object',
    required: ['_id'],
    properties: {
      _id: {
        type: 'string',
      },
      member: {
        type: 'string',
      },
      firstName: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      avatar: {
        type: 'string',
        contentEncoding: 'base64',
      },
      verificationHash: {
          type: 'string',
      },
      privacy: {
        type: 'boolean'
      },
    },
}