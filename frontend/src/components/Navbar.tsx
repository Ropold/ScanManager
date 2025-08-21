import {useNavigate} from "react-router-dom";
import axios from "axios";
import "./styles/Navbar.css"
import * as React from "react";
import {LanguagesImages} from "./utils/FlagImages.ts";
import {translatedInfo} from "./utils/TranslatedInfo.ts";
import "./styles/Popup.css"
import bechtleLogoSmall from "../assets/logo-bechtle-small.svg"

type NavbarProps = {
    user:string;
    getUser: () => void;
    language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>
}

export default function Navbar(props: NavbarProps) {
    const [showLanguagePopup, setShowLanguagePopup] = React.useState(false);

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

            <div
                className="clickable-header"
                id="clickable-header"
                onClick={() => {
                    navigate("/");
                }}
            >
                <img src={bechtleLogoSmall} alt="Bechtle Small Logo" className="logo-image logo-bechtle" />
                <h2 className="header-title">Home</h2>
            </div>
            <div
                className="clickable-header"
                onClick={() => setShowLanguagePopup(true)}
            >
                <h2 className="header-title">
                    {translatedInfo["Language"][props.language] ?? props.language}
                </h2>
                <img src={LanguagesImages[props.language]} alt="Language Logo" className="logo-image" />
            </div>

            {showLanguagePopup && (
                <div
                    className="popup-overlay"
                    onClick={() => setShowLanguagePopup(false)}
                >
                    <div
                        className="popup-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Select Language</h2>
                        <div className="popup-language-options">
                            {["de","en","pl","es","fr","it","cz","pt","hu","nl","gr","ru"].map((lang) => (
                                <button
                                    key={lang}
                                    className="language-option-button"
                                    onClick={() => {
                                        props.setLanguage(lang);
                                        setShowLanguagePopup(false);
                                    }}
                                >
                                    <img
                                        src={LanguagesImages[lang]}
                                        alt={lang}
                                        className="language-flag"
                                    />
                                    {translatedInfo["Language"][lang]}
                                </button>
                            ))}
                        </div>
                        <button
                            className="popup-cancel margin-top-20"
                            onClick={() => setShowLanguagePopup(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}


            {props.user !== "anonymousUser" ? (
                <>
                    <button className="button-group-button" onClick={() => navigate("/profile")}>Profile</button>
                    <button className="button-group-button" onClick={logoutFromAzure}>{translatedInfo["Logout"][props.language]}</button>
                </>
            ) : (
                <button className="button-group-button" onClick={loginWithAzure}>{translatedInfo["Login"][props.language]}</button>
            )}
        </nav>
    );
}