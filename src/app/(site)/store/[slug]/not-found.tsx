"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconBuildingStore } from "@tabler/icons-react";

export default function StoreNotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                    <IconBuildingStore className="h-10 w-10 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Store Not Found</h1>
                <p className="text-muted-foreground mb-6 max-w-md">
                    The store you&apos;re looking for doesn&apos;t exist or may have been removed.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <Link href="/stores">
                        <Button variant="outline" className="gap-2">
                            <IconArrowLeft className="h-4 w-4" />
                            Browse Stores
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button>Go Home</Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
