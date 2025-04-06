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
  console.log("🚀 ~ populatePreferences ~ parent:", parent); // Parent is the schema one level above
  // For preference field of type UserPreferences, nested in schema UserWithPreferences, running this function to actually
  // populate the preferences property means we wouldn't need to run joins in the database-service level.
  return userService.getPreferencesByUserId(parent?.id);
};
