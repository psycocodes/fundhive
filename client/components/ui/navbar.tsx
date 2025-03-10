"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { ConnectButton } from "thirdweb/react";
import  client  from "@/app/client"
const NavBar = () => {
  const links = [
    { name: "Explore", href: "/explore", searchHref: "/explore" },
    { name: "Create", href: "/create", searchHref: "/create" },
  ];
  const currentPath = usePathname();
  const isActive = (itemLink: string) => {
    // Exact match for root, starts with for other paths
    return itemLink === "/"
      ? currentPath === itemLink
      : currentPath.startsWith(itemLink) || currentPath === itemLink;
  };

  return (
    <>{[""].includes(currentPath) || (<header className="border-grid sticky top-0 z-[60] w-full border-b border-dashed bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center gap-2 justify-between px-5 ">
          <a href="/">
            <img src="logo.png" className="w-6 h-7" alt="Logo" />
          </a>
          <nav className="flex items-center gap-7">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                scroll={false}
                className={`
              text-l font-light
              ${
                isActive(item.searchHref)
                  ? "text-stone-100"
                  : "text-stone-400 hover:text-stone-200"
              }
            `}
              >
                {item.name}
              </Link>
            ))}
          <div className="">
            <ConnectButton
              client={client}
              appMetadata={{
                name: "Fundhive",
                url: "https://github.com/psycocode/Fundhive",
              }}
            />
          </div>
          </nav>
        </div>
      </div>
    </header>)}
    </>
    
  );
};

export default NavBar;
