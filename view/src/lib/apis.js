/* eslint-disable no-undef */
export const prod = process.env.NODE_ENV === "production";
export const apiUrl = prod ? "https://shopin-297o.onrender.com" : "http://localhost:5000";
