import type {
  LoginUserRequest,
  RegisterUserRequest,
} from "@/lib/types/user-types";

const BASE_URL = import.meta.env.VITE_API_PATH;

export const userRegister = async (data: RegisterUserRequest) => {
  return await fetch(`${BASE_URL}/_register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
      company_name: data.company_name,
    }),
  });
};

export const userLogin = async (data: LoginUserRequest) => {
  return await fetch(`${BASE_URL}/_login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });
};

export const userCurrent = async (token: string) => {
  return await fetch(`${BASE_URL}/users/_current`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
};

export const userLogout = async (token: string) => {
  return await fetch(`${BASE_URL}/users/_logout`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
};
