import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/client";
import { COLLECTIONS, ROLES } from "../constants";

export const authService = {
    /**
     * Login with Google
     */
    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

        // Check if user already exists in Firestore
        const userDocRef = doc(db, COLLECTIONS.USERS, user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            const userProfile = {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                role: ROLES.USER,
                isActive: true,
                avatar: user.photoURL,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                addresses: [],
                phoneNumber: ""
            };
            await setDoc(userDocRef, userProfile);
            return userProfile;
        }
        return userDoc.data();
    },

    /**
     * Register a new user and create a Firestore profile
     */
    async register({ email, password, name, phoneNumber }) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Set display name in Auth
        await updateProfile(user, { displayName: name });

        // Create user profile in Firestore
        const userProfile = {
            uid: user.uid,
            name,
            email,
            role: ROLES.USER,
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            addresses: [],
            phoneNumber: phoneNumber || ""
        };

        await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userProfile);
        return userProfile;
    },

    /**
     * Login with email and password
     */
    async login(email, password) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    },

    /**
     * Logout the current user
     */
    async logout() {
        await signOut(auth);
    },

    /**
     * Send password reset link
     */
    async forgotPassword(email) {
        await sendPasswordResetEmail(auth, email);
    }
};
