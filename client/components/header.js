import Link from "next/link";

const Header = ({ currentuser }) => {
    const links = [
        !currentuser && { label: "Sign Up", href: "auth/signup" },
        !currentuser && { label: "Sign In", href: "auth/signin" },
        currentuser && { label: "Sell Tickets", href: "/tickets/new" },
        currentuser && { label: "My Orders", href: "/orders" },
        currentuser && { label: "Sign Out", href: "auth/signout" },
    ]
        .filter((c) => c)
        .map(({ label, href }) => {
            return (
                <li className="nav-item" key={href}>
                    <Link className="nav-link" href={href}>
                        {label}
                    </Link>
                </li>
            );
        });

    return (
        <nav
            style={{ paddingLeft: "4em", paddingRight: "4em" }}
            className="navbar navbar-light bg-light"
        >
            <Link className="navbar-brand" href="/">
                GitTix
            </Link>

            <div className="d-flex justfiy-content-end">
                <ul className="nav d-flex align-items-center">{links}</ul>
            </div>
        </nav>
    );
};

export default Header;
