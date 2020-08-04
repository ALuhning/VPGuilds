export const userSchema = {
    $id: 'https://example.com/post.schema.json',
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'User',
    type: 'object',
    required: ['_id'],
    properties: {
      _id: {
        type: 'string',
      },
      userName: {
        type: 'string',
      },
      accountId: {
        type: 'string',
      },
      publicKey: {
        type: 'string',
      },
      privateKey: {
        type: 'string',
      },
      userType: {
          type: 'string',
      },
      balance: {
        type: 'integer',
        minimum: 0,
      },
    },
}