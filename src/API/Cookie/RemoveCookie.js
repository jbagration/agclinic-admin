import React from 'react';
import Cookies from "js-cookie"

const RemoveCookie = (name) => {
    return Cookies.remove(name)
};

export default RemoveCookie;
