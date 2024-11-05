import { User } from "./class.js";
export const users = [];
export function getUser(_address) {
    let user = users.find((user) => user.address.toLowerCase() === _address.toLowerCase());
    if (!user) {
        user = new User();
        user.address = _address.toLowerCase();
        users.push(user);
    }
    return user;
}
export function getUsers() {
    return users;
}
//# sourceMappingURL=state.js.map