import * as React from "react";
import {LanguagesImages} from "./utils/FlagImages.ts";
import {translatedInfo} from "./utils/TranslatedInfo.ts";

type ProfileProps = {
    user: string;
    userDetails: UserDetails | null;
    language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>
}


export default function Profile(props: Readonly<ProfileProps>){

    const [showLanguagePopup, setShowLanguagePopup] = React.useState(false);

    return (
        <>
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

            <>
                <h2>Profile</h2>
                {props.userDetails ? (
                    <div>
                        <p>ID: {props.userDetails.id}</p>
                        <p>Microsoft ID: {props.userDetails.microsoftId}</p>
                        <p>Username: {props.userDetails.username}</p>
                        <p>Email: {props.userDetails.email}</p>
                        <p>Role: {props.userDetails.role}</p>
                        {props.userDetails.avatarUrl && (
                            <img
                                className="profile-container-img"
                                src={props.userDetails.avatarUrl}
                                alt={props.userDetails.username}
                            />
                        )}
                        <p>
                            Created At:{" "}
                            {props.userDetails.createdAt
                                ? new Date(props.userDetails.createdAt).toLocaleString()
                                : "—"}
                        </p>
                        <p>
                            Last Login At:{" "}
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