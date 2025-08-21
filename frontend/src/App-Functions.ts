import axios from "axios";
import type { UserModel } from "./components/model/UserModel.ts";

export function getUser(setUser: (user: string) => void) {
    axios.get("/api/users/me")
        .then((response) => {
            setUser(response.data.toString());
        })
        .catch((error) => {
            console.error(error);
            setUser("anonymousUser");
        });
}

export function getUserDetails(setUserDetails: (details: UserModel | null) => void) {
    axios.get("/api/users/me/details")
        .then((response) => {
            setUserDetails(response.data as UserModel);
        })
        .catch((error) => {
            console.error(error);
            setUserDetails(null);
        });
}