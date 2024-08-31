export type LOGIN_FORM_DATA_TYPE = {
  email: string;
  password: string;
};

export type SIGNUP_FORM_DATA_TYPE = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  avatar: string | null;
};

export const filterOptions = [
  { label: "All", value: null },
  { label: "VERIFIED", value: true },
  { label: "NOT VERIFIED", value: false },
];
