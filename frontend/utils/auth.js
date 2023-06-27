import { redirect } from "react-router-dom";

export function checkAuthStatus() {
    const token = localStorage.getItem("token");
    if (token) return token;
    else return redirect("/login");
}

export function isLoggedIn() {
    if(localStorage.getItem('token')) return true;
    else return false;
}

export function getAuthToken() {
    return localStorage.getItem("token");
}
