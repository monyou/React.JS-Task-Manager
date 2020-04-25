export default class UserModel {
    constructor(
        email,
        password,
        names,
        role = 'user'
    ) {
        this.email = email;
        this.password = password;
        this.names = names;
        this.role = role;
        this.oldEmail = null;
    }
}