import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserSessionPersistence } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signup = useCallback(async (email, password, fullName) => {
        const userCredential = await createUserWithEmailAndPassword(
            auth, email, password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            fullName: fullName,
            createdAt: serverTimestamp(),
        });

        return userCredential;
    }, []);

    const login = useCallback(async (email, password) => {
        await setPersistence(auth, browserSessionPersistence);
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        return userCredential;
    }, []);

    const logout = useCallback(async () => {
        await signOut(auth);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        console.log("Fetched user data from Firestore:", userData);
                        setCurrentUser({
                            ...user,
                            fullName: userData.fullName,
                        });
                        console.log("Current user after merge:", { ...user, fullName: userData.fullName });
                    } else {
                        setCurrentUser(user);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setCurrentUser(user);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = useMemo(() => ({
        currentUser, loading, signup, login, logout,
    }), [currentUser, loading, signup, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
