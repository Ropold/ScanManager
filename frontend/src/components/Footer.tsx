import {translatedInfo} from "./utils/TranslatedInfo.ts";

type FooterProps = {
    language: string;
}

export default function Footer(props: Readonly<FooterProps>) {
    return (
        <footer className="footer">
            <p>{translatedInfo["Footer-Info"][props.language]}</p>
        </footer>
    )
}