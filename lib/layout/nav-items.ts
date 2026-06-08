import { Home, Users, UtensilsCrossed, User, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/meals", label: "Refeições", icon: UtensilsCrossed },
  { href: "/friends", label: "Amigos", icon: Users },
  { href: "/profile", label: "Perfil", icon: User },
];

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/friends") {
    return pathname === "/friends" || pathname.startsWith("/friends/");
  }
  return pathname.startsWith(href);
}
