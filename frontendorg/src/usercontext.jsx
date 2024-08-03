import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const Usercontext = createContext({});
export function Usercontextprovider({ children }) {
    const [user, setUser] = useState(null);
    const [ready,setReady]=useState(false)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get("/profile");
                setReady(true)
                setUser(data);

            } catch (error) {
                console.error("Error fetching user:", error);
                setReady(true)
                // Optionally handle error state or retry mechanism
            }
        };
        
        // Check if user is not already set to prevent unnecessary requests
        if (!user) {
            fetchUser();
             // Set ready to false to prevent rendering until user data is fetched
        }
    }, []); // Add user to dependency array to prevent infinite loop

    return (
        <Usercontext.Provider value={{ user, setUser,ready }}>
            {children}
        </Usercontext.Provider>
    );
}
