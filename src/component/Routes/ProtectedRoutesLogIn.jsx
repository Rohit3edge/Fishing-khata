import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { CheckProfile } from "../../store/slices/auth"; 
import Loader from "../../common/Loader";  // Assuming you have a Loader component

// Function to fetch profile and check access
const fetchCheckProfile = async (dispatch, id) => {
  try {
    const data = await dispatch(CheckProfile({ profile_id: id })).unwrap();
    return data?.user?.status;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const ProtectedRoutesLogIn = () => {
  const [auth, setAuth] = useState(null);  // Initialize auth as null
  const [loading, setLoading] = useState(true);  // Track loading state
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthorization = async () => {
      const user = Cookies.get("user");

      if (user) {
        try {
          const userData = JSON.parse(user);  // Safely parse the cookie
          const profileId = userData?.id;
          
          if (profileId) {
            const isAuthorized = await fetchCheckProfile(dispatch, profileId);
            setAuth(isAuthorized);
          } else {
            setAuth(false);  // If no profileId, user is not authorized
          }
        } catch (error) {
          console.error("Error parsing user cookie:", error);
          setAuth(false);  // Navigate to login if parsing fails
        }
      } else {
        setAuth(false);  // If no user cookie, set as not authorized
      }

      setLoading(false);  // Stop loading once the check is done
    };

    checkAuthorization();
  }, [dispatch]);

  // Show a loader while checking authorization
  if (loading) {
    return <Loader />;  // Display a loader component while loading
  }

  // Redirect unauthorized users to /adduserdetails
  if (auth === false) {
    return <Navigate to="/adduserdetails" />;
  }

  // If authorized, allow access to routes except /adduserdetails, /companydocuments, /addsettings
  return <Outlet />;
};

export default ProtectedRoutesLogIn;
