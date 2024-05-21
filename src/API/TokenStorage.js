export default class TokenStorage {
    static setAccessToken(token) {
        localStorage.setItem('access_token', token);
    }

    static setRefreshToken(token) {
        localStorage.setItem('refresh_token', token);
    }

    static setTokenExpire(data) {
        localStorage.setItem('expires_in', data);
    }

    static setTokenReceived(data) {
        localStorage.setItem('token_received', data);
    }

    static setUser(data) {
        localStorage.setItem('user', JSON.stringify(data));
    }

    static returnTokenValue(nameStr) {
        let value = localStorage.getItem(nameStr);

        if (!value) {
            value = '';
        }

        return value;
    }

    static getAccessToken() {
        return this.returnTokenValue('access_token');
    }

    static getRefreshToken() {
        return this.returnTokenValue('refresh_token');
    }

    static getTokenExpire() {
        return this.returnTokenValue('expires_in');
    }

    static getUser() {
        return JSON.parse(localStorage.getItem("user"));
    }

    static getTokenReceived() {
        return this.returnTokenValue('token_received');
    }

    static logOut() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_received');
    }
}
