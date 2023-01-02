import { useEffect, useState } from "react";
import { loginUser } from "./api";
import { isAuthCodeExists } from "./storage";


export function useGetLoginStatus() {
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    useEffect(() => {
        loginUser({}).then((res) => {
            setUserLoggedIn(
                isAuthCodeExists() &&
                res.err === undefined &&
                res.data?.user !== undefined
            )
        })
    });

    return userLoggedIn;
}