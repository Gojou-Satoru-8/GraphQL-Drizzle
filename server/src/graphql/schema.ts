export const schema = `#graphql

    type User {
        # id: ID!
        id: Int!
        name: String!
        email: String!
        age: Int
        role: String!
        theme: String 
    }

    input UserUpdateInput {
        name: String, 
        email: String,
        age: Int,
        role: String
    }

    type UserPreferences {
        userId: Int!
        emailUpdates: Boolean!
        theme: String
        # preferredTheme: String
    }

    input UserPreferencesUpdateInput {
        emailUpdates: Boolean,
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

    type Mutation {
        createUser (name: String!, age: Int, email: String!, role: String): User
        updateUser (userId: Int!, updateValues: UserUpdateInput): User
        deleteUser (userId: Int!): User
        updatePreferences (userId: Int!, updateValues: UserPreferencesUpdateInput): UserPreferences
    }
`;
