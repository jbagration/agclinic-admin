import React from 'react';
import Cookies from "js-cookie"

const SetCookie = (name, value) => {
    Cookies.set(name, value, {
        expires: 1,
        secure: true,
        sameSite: 'string',
        path: "/"
    });
};

export default SetCookie;
