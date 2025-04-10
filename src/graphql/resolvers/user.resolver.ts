import * as userService from "@/services/user.service";

export const getAllUsers = async () => {
  //   const users = await userService.getAllUsers();
  //   return users;    // OR Directly:
  return userService.getAllUsers();
};

export const getUserById = async (parent: any, arg: { userId: number }) => {
  console.log("🚀 ~ getUserById ~ parent & arg:", parent, arg);
  return userService.getUserById(arg.userId);
};

export const getAllUsersWithPreferences = async () => {
  return userService.getAllUsersWithPreferences();
};

export const getUserWithPreferencesById = async (parent: any, arg: { userId: number }) => {
  console.log("🚀 ~ getUserById ~ parent & arg:", parent, arg);
  return userService.getUserWithPreferencesById(arg.userId);
};

export const populatePreferences = async (parent: any) => {
  // Here, parent is the UserWithPreferences object
  console.log("🚀 ~ populatePreferences ~ parent:", parent); // Parent is the schema one level above
  // For preference field of type UserPreferences, nested in schema UserWithPreferences, running this function to actually
  // populate the preferences property means we wouldn't need to run joins in the database-service level.
  return userService.getPreferencesByUserId(parent?.id);
};

// export const getPreferredTheme = async (parent: any) => {
//   // NOTE: Here the parent will be the UserPreferences object, which is used inside UserWithPererences type and UsersWithPreferences type. Thus everytime we query these two, the UserPreferences object will be populated by the above populatePreferences, but if we were to rename the theme property to preferredTheme in GraphQL schema, we would need to add a resolver for this:
//   console.log("🚀 ~ getPreferredTheme ~ parent:", parent);
//   return parent.theme;
// };

export const getThemeForUser = (parent: any) => {
  return userService.getThemeByUserId(parent.id);
};

type newUserArgsType = { name: string; age: number; email: string; role?: string };

export const createUser = async (parent: any, args: newUserArgsType) => {
  const newUser = await userService.insertUser({ ...args });
  const newUserPreferences = await userService.insertUserPreferences(newUser?.id as number);
  // if (!newUser) return "Failed to create user";
  // else return newUser;
  return { ...newUser, theme: newUserPreferences?.theme };
};

type updateUserArgsType = {
  userId: number;
  updateValues: { name?: string; age?: number; email?: string; role?: "admin" | "basic" };
};
export const updateUser = async (parent: any, args: updateUserArgsType) => {
  // const updatedUser = await userService.updateUserById(args.userId, args.updateValues);
  // return updatedUser;
  return userService.updateUserById(args.userId, args.updateValues);
};

type deleteUserType = {
  userId: number;
};
export const deleteUser = async (parent: any, args: deleteUserType) => {
  return userService.deleteUserById(args.userId);
};

type updatePreferencesArgsType = {
  userId: number;
  updateValues: {
    theme?: "light" | "dark" | "system";
    emailUpdates?: boolean;
  };
};

export const updatePreferencesByUserId = async (parent: any, args: updatePreferencesArgsType) => {
  return userService.updatePreferencesByUserId(args.userId, args.updateValues);
};
