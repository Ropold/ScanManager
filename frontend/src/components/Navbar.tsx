import {useNavigate} from "react-router-dom";
import axios from "axios";
import "./styles/Navbar.css"

type NavbarProps = {
    user:string;
    getUser: () => void;
    language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>
}

export default function Navbar(props: NavbarProps) {
    // const [showLanguagePopup, setShowLanguagePopup] = React.useState(false);

    const navigate = useNavigate();

    function loginWithAzure() {
        const host = window.location.host === "localhost:5173" ? "http://localhost:8080" : window.location.origin;
        window.open(host + "/oauth2/authorization/azure", "_self");
    }

    function logoutFromAzure() {
        axios
            .post("/api/users/logout")
            .then(() => {
                props.getUser();
                navigate("/");
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    }

    return (
        <nav className="navbar">

            {props.user !== "anonymousUser" ? (
                <>
                    <button className="purple-button" onClick={() => navigate("/profile")}>Profile</button>
                    <button className="button-group-button" onClick={logoutFromAzure}>Logout</button>
                </>
            ) : (
                <button className="button-group-button" onClick={loginWithAzure}>Login with Azure</button>
            )}
        </nav>
    );
}