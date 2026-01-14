export type RegisterUserRequest = {
  name: string;
  email: string;
  password: string;
  company_name: string;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};
