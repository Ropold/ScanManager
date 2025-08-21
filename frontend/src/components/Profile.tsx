
type ProfileProps = {
    user: string;
    userDetails: UserDetails | null;
}


export default function Profile(props: Readonly<ProfileProps>){
    return (
        <>
        <h2>Profile</h2>
        <p>{props.user}</p>
        </>
    )
}