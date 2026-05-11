import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    sendEmailVerification,
    verifyBeforeUpdateEmail,
    EmailAuthProvider,
    linkWithCredential,
    updatePassword
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/client";
import { COLLECTIONS, ROLES } from "../constants";

export const authService = {
    /**
     * Phone Auth Setup
     */
    async setupRecaptcha(containerId) {
        if (!auth || typeof window === 'undefined') {
            console.error("Auth is not initialized or not in window context");
            return null;
        }

        try {
            const container = document.getElementById(containerId);
            if (!container) return null;

            if (window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier.clear();
                    container.innerHTML = '';
                } catch (e) { }
            }

            window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
                size: 'invisible',
                callback: () => {
                    console.log("Recaptcha solved");
                }
            });

            try {
                await window.recaptchaVerifier.render();
            } catch (renderError) {
                console.log("Recaptcha already rendered or rendering skipped");
            }

            return window.recaptchaVerifier;
        } catch (error) {
            console.error("Recaptcha Setup Detailed Error:", error);
            return null;
        }
    },

    async sendOTP(phoneNumber) {
        try {
            const appVerifier = window.recaptchaVerifier;
            if (!appVerifier) throw new Error("Recaptcha not initialized.");

            await appVerifier.render();
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            window.confirmationResult = confirmationResult;
            return confirmationResult;
        } catch (error) {
            console.error("Firebase sendOTP Full Error:", error);
            throw error;
        }
    },

    async verifyOTP(otp) {
        if (!window.confirmationResult) throw new Error("No pending OTP request.");
        const result = await window.confirmationResult.confirm(otp);
        const user = result.user;

        const userDocRef = doc(db, COLLECTIONS.USERS, user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            const userProfile = {
                uid: user.uid,
                name: "New User",
                email: "",
                role: ROLES.USER,
                isActive: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                addresses: [],
                phoneNumber: user.phoneNumber
            };
            await setDoc(userDocRef, userProfile);
            return { user, profile: userProfile };
        }
        return { user, profile: userDoc.data() };
    },

    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

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

    async register({ email, password, name, phoneNumber }) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });

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

    async login(email, password) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    },

    async logout() {
        await signOut(auth);
    },

    async forgotPassword(email) {
        const actionCodeSettings = {
            url: typeof window !== 'undefined' ? `${window.location.origin}/login` : 'https://one-pc-eta.vercel.app/login',
            handleCodeInApp: false,
        };
        await sendPasswordResetEmail(auth, email, actionCodeSettings);
    },

    async setPasswordForPhone(phoneNumber, password) {
        if (!auth.currentUser) throw new Error("No authenticated user.");
        const virtualEmail = `${phoneNumber.replace('+', '')}@onepc.uz`;

        try {
            const credential = EmailAuthProvider.credential(virtualEmail, password);
            try {
                await linkWithCredential(auth.currentUser, credential);
            } catch (linkError) {
                if (linkError.code === 'auth/credential-already-in-use' || linkError.code === 'auth/email-already-in-use') {
                    await updatePassword(auth.currentUser, password);
                } else {
                    throw linkError;
                }
            }

            const userDocRef = doc(db, COLLECTIONS.USERS, auth.currentUser.uid);
            await updateDoc(userDocRef, {
                hasPassword: true,
                virtualEmail: virtualEmail
            });

            return { success: true };
        } catch (error) {
            console.error("Set Password Error:", error);
            throw error;
        }
    },

    async loginWithPhonePassword(phoneNumber, password, linkedEmail = null) {
        const emailToUse = linkedEmail || `${phoneNumber.replace('+', '')}@onepc.uz`;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
            return userCredential.user;
        } catch (error) {
            console.error("Phone Password Login Error:", error);
            throw error;
        }
    },

    async updateEmailWithVerification(newEmail) {
        if (!auth.currentUser) throw new Error("No authenticated user found.");
        try {
            await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
        } catch (error) {
            console.error("Firebase updateEmail Error:", error.code, error.message);
            throw error;
        }
    },

    async completePhoneRegistration(user, name, password) {
        try {
            const phoneNumber = user.phoneNumber;
            const virtualEmail = `${phoneNumber}@onepc.uz`.replace('+', '');

            await updateProfile(user, { displayName: name });

            const { updateEmailAdminAction, updatePasswordAdminAction } = await import("@/lib/actions/user.actions");
            await updateEmailAdminAction(user.uid, virtualEmail);
            await updatePasswordAdminAction(user.uid, password);

            const userRef = doc(db, COLLECTIONS.USERS, user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                email: virtualEmail,
                phoneNumber: phoneNumber,
                fullName: name,
                displayName: name,
                role: 'user',
                hasPassword: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            return true;
        } catch (error) {
            console.error("Phone Registration Completion Error:", error);
            throw error;
        }
    }
};
