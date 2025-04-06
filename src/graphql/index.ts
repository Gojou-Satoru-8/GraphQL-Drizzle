export const schema = `#graphql

    type User {
        # id: ID!
        id: Int!
        name: String!
        email: String!
        # age: Number
        role: String!
        status: String!  
    }

    type Query {
    hello: String 
    hello2: String
    users: [User]
    }
`;
