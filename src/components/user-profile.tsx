"use client";

import { AnimatePresence, motion } from "@/components/motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
    IconDashboard,
    IconLogout,
    IconMoon,
    IconSettings,
    IconShieldCheck,
    IconSun,
    IconUserCircle,
} from "@tabler/icons-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { logoutAction } from "../actions/auth.actions";
import { useUser } from "../hooks/useUser";

interface UserProfileProps {
    variant?: "sidebar" | "header";
    isCollapsed?: boolean;
}

export function UserProfile({
    variant = "sidebar",
    isCollapsed = false,
}: UserProfileProps) {
    const { user } = useUser();
    const { theme, setTheme } = useTheme();

    // Derive the next theme in the cycle: light → dark → system → light
    const nextTheme =
        theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

    const userName = user?.first_name || "Guest User";
    const userEmail = user?.email || "guest@example.com";
    const userRole = (user?.role || "USER").toLowerCase();
    const userId = user?.id || "GUEST";

    const isAdmin = userRole === "admin";
    const isModerator = userRole === "moderator";
    const showDashboard = isAdmin || isModerator;

    const handleSignOut = async () => {
        await logoutAction();
    };

    const isHeader = variant === "header";

    // Determines which icon to show for the theme toggle
    const ThemeIcon = theme === "dark" ? IconSun : IconMoon;
    const themeLabel =
        nextTheme === "light"
            ? "Light mode"
            : nextTheme === "dark"
                ? "Dark mode"
                : "System";

    return (
        <div
            className={cn(
                "transition-all duration-300",
                isHeader ? "flex items-center" : isCollapsed ? "p-2" : "p-4"
            )}
        >
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className={cn(
                            "group flex items-center rounded-xl border border-transparent outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/30",
                            isHeader
                                ? "p-0.5 hover:opacity-80"
                                : "w-full gap-3 p-2 hover:bg-accent/50 hover:border-border/50",
                            !isHeader && isCollapsed && "justify-center px-0"
                        )}
                    >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div
                                className={cn(
                                    "flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 ring-1 ring-border group-hover:ring-primary/50 shadow-sm transition-all",
                                    isHeader ? "h-8 w-8" : "h-9 w-9"
                                )}
                            >
                                <span className="text-xs font-medium text-foreground/80">
                                    {userName.charAt(0).toUpperCase()}
                                </span>
                            </div>

                            {/* Online indicator */}
                            <div className="absolute -right-0.5 -bottom-0.5 flex items-center justify-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0.5 }}
                                    animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeOut",
                                    }}
                                    className="absolute h-2.5 w-2.5 rounded-full bg-emerald-500"
                                />
                                <div className="relative z-10 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
                            </div>
                        </div>
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className="w-72 rounded-2xl border border-border/50 bg-background p-2 shadow-xl backdrop-blur-md"
                    side={isHeader ? "bottom" : isCollapsed ? "right" : "top"}
                    align={isHeader ? "end" : "center"}
                    sideOffset={12}
                >
                    {/* User info header */}
                    <DropdownMenuLabel className="p-3">
                        <div className="flex flex-col gap-1">
                            <p className="text-[11px] font-medium uppercase tracking-tighter text-muted-foreground">
                                Signed in as
                            </p>
                            <p className="truncate text-sm font-semibold text-foreground">
                                {userEmail}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <IconShieldCheck className="h-3 w-3" />
                                    {userRole}
                                </span>
                                <span>•</span>
                                <span>ID: {userId}</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        {showDashboard && (
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/dashboard"
                                    className="group flex cursor-pointer items-center gap-3 rounded-lg p-2.5 focus:bg-primary/10 focus:text-primary"
                                >
                                    <IconDashboard
                                        size={16}
                                        className="text-muted-foreground group-focus:text-primary"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">Dashboard</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            Manage your platform
                                        </span>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuItem asChild>
                            <Link
                                href="/account"
                                className="group flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5 focus:bg-primary/10 focus:text-primary"
                            >
                                <IconUserCircle
                                    size={16}
                                    className="text-muted-foreground group-focus:text-primary"
                                />
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-medium">My Profile</span>
                                    <span className="text-[10px] text-muted-foreground">
                                        Work & Personal details
                                    </span>
                                </div>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <button className="group flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5 focus:bg-primary/10 focus:text-primary">
                                <IconSettings
                                    size={16}
                                    className="text-muted-foreground group-focus:text-primary"
                                />
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-medium">Preferences</span>
                                    <span className="text-[10px] text-muted-foreground">
                                        System settings
                                    </span>
                                </div>
                            </button>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <button
                                onClick={() => setTheme(nextTheme)}
                                className="group flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5 focus:bg-primary/10 focus:text-primary"
                            >
                                <ThemeIcon
                                    size={16}
                                    className="text-muted-foreground group-focus:text-primary"
                                />
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-medium">Switch Theme</span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {themeLabel}
                                    </span>
                                </div>
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                        <button
                            onClick={handleSignOut}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                            <IconLogout size={16} />
                            <span className="text-sm font-medium">Sign out</span>
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div >
    );
}
