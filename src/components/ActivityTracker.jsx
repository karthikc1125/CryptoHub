import React, { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useActivity } from "../context/ActivityContext";

const ActivityTracker = () => {
    const location = useLocation();
    const { addActivity } = useActivity();
    const trackedPathsRef = useRef(new Set());

    const trackActivity = useCallback((path) => {
        const pathKey = path;

        if (trackedPathsRef.current.has(pathKey)) {
            return;
        }

        let activity = null;

        if (path === "/") {
            activity = {
                icon: "🏠",
                title: "Viewed Market",
                description: "Explored cryptocurrency market overview",
                type: "info",
            };
        } else if (path === "/pricing") {
            activity = {
                icon: "💎",
                title: "Checked Pricing",
                description: "Viewed pricing plans",
                type: "info",
            };
        } else if (path === "/blog") {
            activity = {
                icon: "📰",
                title: "Read Blog",
                description: "Browsed blog articles",
                type: "info",
            };
        } else if (path === "/features") {
            activity = {
                icon: "✨",
                title: "Explored Features",
                description: "Viewed platform features",
                type: "info",
            };
        } else if (path.startsWith("/coin/")) {
            const coinId = path.split("/")[2];
            activity = {
                icon: "🪙",
                title: "Viewed Coin",
                description: `Checked ${coinId.toUpperCase()} details`,
                type: "info",
            };
        } else if (path.startsWith("/blog/")) {
            activity = {
                icon: "📄",
                title: "Read Article",
                description: "Read a blog post",
                type: "info",
            };
        }

        if (activity && !["/dashboard", "/login", "/signup"].includes(path)) {
            trackedPathsRef.current.add(pathKey);
            addActivity(activity);
        }
    }, [addActivity]);

    useEffect(() => {
        trackActivity(location.pathname);
    }, [location.pathname, trackActivity]);

    return null;
};

export default ActivityTracker;
