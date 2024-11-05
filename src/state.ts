import { User } from "./class.js";

export const users: User[] = [];

export function getUser(_address: string): User {
  let user: User = users.find((user) => user.address.toLowerCase() === _address.toLowerCase());

  if (!user) {
    user = new User();
    user.address = _address.toLowerCase();
    users.push(user);
  }

  return user;
}

export function getUsers(): User[] {
  return users;
}