export type CreateUserParams = {
  username: string;
  password: string;
};

export type UpdateUserParams = {
  username: string;
  password: string;
};

export type CreateUserProfileParams = {
  firstName: string;
  lastname: string;
  age: number;
  birthdate: string;
};

export type CreateUserPostParams = {
  title: string;
  description: string;
};
