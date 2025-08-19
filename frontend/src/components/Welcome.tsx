
import welcomePic from '../assets/scanner-logo.svg';

type WelcomeProps = {
    language: string;
}

export default function Welcome(props: Readonly<WelcomeProps>) {
    return (
        <>
            <h2>License Platform</h2>
            <p>Welcome</p>
            <div className="image-wrapper margin-top-20">
                <img
                    src={welcomePic}
                    alt="Welcome to License Platform"
                    className="logo-welcome"
                />
            </div>
        </>
    )
}