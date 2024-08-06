"use client";

import React from "react";
import "./Navigation.css";
import Link from "next/link";
import medialLogo from "../../../public/medial-black.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navigation = () => {
    const pathname = usePathname();
    console.log(pathname);

    return (
        <>
            <div className="nav_holder">
                <Link
                    href="/"
                    className={`nav_link ${pathname === "/" ? "active" : ""}`}
                >
                    ALL POSTS
                </Link>

                <Link
                    href="/new"
                    className={`nav_link ${
                        pathname === "/post/new" ? "active" : ""
                    }`}
                >
                    NEW POST
                </Link>
            </div>
            <div className="media-logo-holder">
                <a href="https://medial.app" target="_blank">
                    <Image
                        src={medialLogo}
                        alt="Media Logo"
                        height={60}
                        width={60}
                    />
                </a>
            </div>
        </>
    );
};

export default Navigation;
