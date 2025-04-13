import { useMutation } from "@apollo/client";
import { FormEvent } from "react";
import { CREATE_USER } from "../../../utils/graphql/mutations";
import { GET_USERS_WITH_PREFERENCES } from "../../../utils/graphql/queries";

const NewUserForm = () => {
  const [createUserMutation, { data, loading }] = useMutation(CREATE_USER, {
    refetchQueries: [GET_USERS_WITH_PREFERENCES],
  });
  console.log("🚀 ~ NewUserForm ~ data | loading:", data, loading);

  const createUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newUserDetails = Object.fromEntries(formData);
    console.log("🚀 ~ createUser ~ newUserDetails:", newUserDetails);

    if (!newUserDetails.name) {
      alert("Name is empty");
      return;
    }
    if (!newUserDetails.email) {
      alert("Email is empty");
      return;
    }

    createUserMutation({
      variables: newUserDetails,
      onCompleted: (data) => {
        console.log("New user created successfully:", data);
        const inputFields = (e.target as HTMLFormElement).getElementsByTagName("input");
        console.log("Input fields:", inputFields);
        [...inputFields].forEach((inputField) => (inputField.value = ""));
      },
      onError: (error) => {
        console.log("Error in creating new user:", { ...error });
      },
    });
  };

  return (
    <form onSubmit={createUser} style={{ display: "flex", gap: 20, marginTop: 50 }}>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </div>
      <button>Create User</button>
    </form>
  );
};

export default NewUserForm;
