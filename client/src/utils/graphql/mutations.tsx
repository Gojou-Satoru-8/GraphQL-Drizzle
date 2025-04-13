import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $age: Int) {
    createUser(name: $name, email: $email, age: $age) {
      name
      age
      email
      role
    }
  }
`;

export const UPDATE_USER_INFO = gql`
  #   input UserUpdateInput {
  #     name: String
  #     email: String
  #     age: Int
  #     role: Int
  #   }
  #   mutation updateUserInfo($userId: Int!, $updateValues: UserUpdateInput) {
  mutation UpdateUserInfo($userId: Int!, $name: String, $email: String, $role: String, $age: Int) {
    updateUser(
      userId: $userId
      #   updateValues: { name: $name, updateValues: $updateValues }
      updateValues: { name: $name, email: $email, age: $age, role: $role }
    ) {
      name
      email
      #   age
      role
    }
  }
`;

export const UPDATE_USER_PREFERENCES = gql`
  mutation UpdateUserPreferences($userId: Int!, $emailUpdates: Boolean, $theme: String) {
    updatePreferences(
      userId: $userId
      updateValues: { emailUpdates: $emailUpdates, theme: $theme }
    ) {
      theme
      emailUpdates
    }
  }
`;
