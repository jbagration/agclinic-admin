import React from 'react';
import Cookies from "js-cookie"

const GetCookie = (name) => {
    return Cookies.get(name)
};

export default GetCookie;
