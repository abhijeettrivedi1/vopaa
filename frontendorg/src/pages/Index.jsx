import React, { useContext } from 'react';
import { Usercontext } from '../usercontext';
import axios from 'axios';
import '../css/IndexPage.css';
import { Navigate, NavLink } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';

const IndexPage = () => {
    const { user, setUser, ready } = useContext(Usercontext);

    const logout = async () => {
        try {
            await axios.get("/logoutTeacher");
            setUser(null);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    // Show spinner if the app is not ready (e.g., loading user data)
    if (!ready) {
        return (
            <div className="spinner-container">
                <Oval
                    height={80}
                    width={80}
                    color="#4fa94d"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#4fa94d"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                />
            </div>
        );
    }
    
    // If no user is logged in, navigate to the login page
    if (!user) {
        console.log(ready, user);
        return <Navigate to="/login" />;
    }

    // Main content when the user is logged in
    return (
        <div className="index-page">
            <div className="image-section">
                <img src="/dash.jpeg" alt="Dashboard Image" />
                <div>
                    <h1>Welcome to Your Dashboard</h1>
                    {user && <p>Logged in as: {user.teacherId}</p>}
                    {user && <button onClick={logout}>Logout</button>}
                    <p>Empower your teaching with our innovative platform designed to elevate student success. Access personalized tools, manage classroom activities seamlessly, and connect with a community of educators to inspire and guide your students effectively.</p>
                </div>
            </div>
            <div className="content-section">
                <div>
                    <h1>Manage Your Students</h1>
                    <p>View and manage your students' information.</p>
                    <NavLink to="/students">
                        <button>Students</button>
                    </NavLink>
                    <NavLink to="/createtest">
                        <button>CreateTest</button>
                    </NavLink>
                </div>
                <img src="/student.webp" alt="Student Image" />
            </div>
        </div>
    );
}

export default IndexPage;
