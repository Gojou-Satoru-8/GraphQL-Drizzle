export const schema = `#graphql

    type User {
        # id: ID!
        id: Int!
        name: String!
        email: String!
        # age: Number
        role: String!
        theme: String 
    }

    type UserPreferences {
        userId: Int!
        emailUpdates: Boolean!
        theme: String
    }

    type UserWithPreferences {
        id: Int!
        name: String!
        email: String!
        preferences: UserPreferences
    }

    type Query {
        # hello: String 
        # hello2: String
        users: [User]
        user (userId: Int!): User
        usersWithPreferences: [UserWithPreferences]
        userWithPreferences (userId: Int!): UserWithPreferences
        
    }

`;
