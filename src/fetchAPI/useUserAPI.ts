"use client"
import { auth } from "@/lib/firbase";
import { setUser } from "@/redux/userSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";


const useUserAPI = () => {
    const dispatch = useDispatch()

    const updateSession = useCallback(async () => {
        try {
            const response = await fetch('/api/user/update-session')

            const data = await response.json()

            if (!response.ok) {
                return { message: data.message };
            }
            
            dispatch(setUser(data.user));


        } catch (error) {
            console.error('Error updating session:', error);
        }
    }, [dispatch]);

    const getUser = async (userId: string) => {
        try {
            console.log(userId)
            const response = await fetch(`/api/user/get-user/${userId}`);
            const data = await response.json();

            if (!response.ok) {
                return { message: data.message };
            }

            return data.user;
        } catch (error) {
            return { message: "An error occurred while logging in. Please try again.", error };
        }
    }



    const signUpWithOAuth = async () => {

        const user = auth.currentUser;
        const screenName = (user as any).reloadUserInfo?.screenName;
        const res = await fetch('/api/user/signup-oauth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user, screenName }),
        });

        const data = await res.json()
        dispatch(setUser(data.newUser))
        return data.newUser
    }

    const loginWithOAuth = async () => {

        const user = auth.currentUser;
        const uid = user?.uid;
        const res = await fetch('/api/user/login-oauth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid }),
        });

        const data = await res.json()
        dispatch(setUser(data.user))
        return data.user
    }

    const logout = async () => {
        try {
            const response = await fetch('/api/user/logout');

            const data = await response.json();

            if (!response.ok) {
                return { message: data.message };
            }
            dispatch(setUser(null))
            return { message: data.message };

        } catch (error) {
            return { message: "An error occurred while logging out. Please try again.", error };
        }
    };

    const updateUser = async (competitivePlatforms: any, userId: string) => {
        
        try {
            const response = await fetch(`/api/user/update-user/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({competitivePlatforms}),
            });

            const data = await response.json();
            if (!response.ok) {
                return { message: data.message };
            }
            dispatch(setUser(data.updatedUser))
            return data

        } catch (error) {
            return { message: "An error occurred while updating user. Please try again.", error };
        }
    };


    const deleteUser = async (userId: string) => {
        try {
            const response = await fetch(`/api/user/delete-user/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return { message: data.message };
            } else {
                return { message: data.message };
            }
        } catch (error) {
            return { message: "An error occurred while deleting the user. Please try again.", error };
        }
    }


    return {
        updateSession,
        getUser,
        signUpWithOAuth,
        loginWithOAuth,
        updateUser,
        logout,
        deleteUser,
    }
};

export default useUserAPI;