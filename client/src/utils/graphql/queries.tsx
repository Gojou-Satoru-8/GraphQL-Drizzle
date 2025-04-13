import { gql } from "@apollo/client";

export const getAllUsers = gql`
  query GetUsers {
    users {
      id
      email
      name
    }
  }
`;

export const GET_USERS_WITH_PREFERENCES = gql`
  query GetUsersWithPreferences {
    usersWithPreferences {
      id
      name
      email
      preferences {
        theme
        emailUpdates
      }
    }
  }
`;

export const GET_USER_WITH_PREFERENCES = gql`
  query GetUserWithPreferences($userId: Int!) {
    userWithPreferences(userId: $userId) {
      id
      name
      email
      preferences {
        theme
        emailUpdates
      }
    }
  }
`;
