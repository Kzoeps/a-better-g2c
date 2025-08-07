import Link from "next/link";
import React from "react";

const Footer = () => {
    return (
        <footer className="w-full py-4 mt-8 fixed bottom-0 bg-white">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
                <p>
                    Made with ❤️ by{" "}
                    <Link
                        className="underline"
                        href={"kzoeps.com"}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        kzoeps
                    </Link>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
