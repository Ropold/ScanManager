
import welcomePic from '../assets/scanner-logo.svg';
import {translatedInfo} from "./utils/TranslatedInfo.ts";
import "./styles/Welcome.css"
import "./styles/Buttons.css"

type WelcomeProps = {
    language: string;
}

export default function Welcome(props: Readonly<WelcomeProps>) {
    return (
        <>
            <h2>Scan Manager</h2>
            <p>{translatedInfo["Welcome"][props.language]}</p>
            <p></p>
            <div className="image-wrapper margin-top-20">
                <img
                    src={welcomePic}
                    alt="Welcome to Scan Manager"
                    className="logo-welcome"
                />
            </div>
        </>
    )
}