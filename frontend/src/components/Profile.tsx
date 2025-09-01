import * as React from "react";
import {LanguagesImages} from "./utils/FlagImages.ts";
import {translatedInfo} from "./utils/TranslatedInfo.ts";
import "./styles/Profile.css"
import type {UserModel} from "./model/UserModel.ts";
import axios from "axios";

type ProfileProps = {
    language: string;
    user: string;
    userDetails: UserModel | null;
    setLanguage: React.Dispatch<React.SetStateAction<string>>
}


export default function Profile(props: Readonly<ProfileProps>){

    const [showLanguagePopup, setShowLanguagePopup] = React.useState(false);

    function setPreferredLanguage(languageIso: string) {
        axios.post(`/api/users/me/language/${languageIso}`)
            .then(() => {
                console.log("Language updated successfully");
            })
            .catch((error) => {
                console.error("Error updating language:", error);
            });
    }

    return (
        <>
            <h2>Profile</h2>
            <div className="change-language-container">
                <p className="margin-right-5">Change Language:</p>
                <div
                    className="clickable-header"
                    onClick={() => setShowLanguagePopup(true)}
                >
                    <h2 className="header-title">
                        {translatedInfo["Language"][props.language] ?? props.language}
                    </h2>
                    <img src={LanguagesImages[props.language]} alt="Language Logo" className="logo-image" />
                </div>
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
                            {["de","en","pl","es","fr","it","cz","pt","hu","nl","gr","ru","tr","ir"].map((language) => (
                                <button
                                    key={language}
                                    className="language-option-button"
                                    onClick={() => {
                                        props.setLanguage(language);
                                        setPreferredLanguage(language);
                                        setShowLanguagePopup(false);
                                    }}
                                >
                                    <img
                                        src={LanguagesImages[language]}
                                        alt={language}
                                        className="language-flag"
                                    />
                                    {translatedInfo["Language"][language]}
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

            <>
                {props.userDetails ? (
                    <div>
                        <p><strong>SQL-ID:</strong> {props.userDetails.id}</p>
                        <p><strong>Microsoft ID:</strong> {props.userDetails.microsoftId}</p>
                        <p><strong>Username:</strong> {props.userDetails.username}</p>
                        <p><strong>Email:</strong> {props.userDetails.email}</p>
                        <p><strong>Role:</strong> {props.userDetails.role}</p>
                        {props.userDetails.avatarUrl && (
                            <div>
                                <p><strong>Avatar:</strong></p>
                                <img
                                    className="profile-container-img"
                                    src={props.userDetails.avatarUrl}
                                    alt={props.userDetails.username}
                                />
                            </div>
                        )}
                        <p>
                            <strong>Created At:</strong>{" "}
                            {props.userDetails.createdAt
                                ? new Date(props.userDetails.createdAt).toLocaleString()
                                : "—"}
                        </p>
                        <p>
                            <strong>Last Login At:</strong>{" "}
                            {props.userDetails.lastLoginAt
                                ? new Date(props.userDetails.lastLoginAt).toLocaleString()
                                : "—"}
                        </p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </>


        </>
    )
}