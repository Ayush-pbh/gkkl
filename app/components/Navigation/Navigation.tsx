"use client";

import React from "react";
import styles from "./Navigation.module.css";
import Link from "next/link";
import medialLogo from "../../../public/medial-black.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navigation = () => {
    const pathname = usePathname();
    console.log(pathname);

    return (
        <>
            <div className={styles.navHolder}>
                <Link
                    href="/"
                    className={`${styles.navLink} ${
                        pathname === "/" ? styles.active : ""
                    }`}
                >
                    ALL POSTS
                </Link>

                <Link
                    href="/new"
                    className={`${styles.navLink} ${
                        pathname === "/new" ? styles.active : ""
                    }`}
                >
                    NEW POST
                </Link>
            </div>
            <div className={styles.medialLogoHolder}>
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
