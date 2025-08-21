import axios from "axios";

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