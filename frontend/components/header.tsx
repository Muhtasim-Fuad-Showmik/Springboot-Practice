"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const navItems = [{ href: "/employees", label: "Employees" }]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-3">
        <NavigationMenu>
          <NavigationMenuList>
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <NavigationMenuItem
                  key={item.href}
                  className={cn(
                    "rounded-lg px-4 py-2 hover:bg-accent-foreground/10",
                    isActive && "bg-accent-foreground/10 font-medium"
                  )}
                >
                  <Link href={item.href} className="text-foreground">
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
