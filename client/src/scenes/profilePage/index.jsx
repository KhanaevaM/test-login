import { Box, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "scenes/navbar";
import EditProfileWidget from "scenes/widgets/EditProfileWidget";
import { setLogout, updateProfile } from "state";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${user._id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();

      dispatch(
        updateProfile({
          user: data,
        })
      );
    } else {
      dispatch(setLogout());
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) return null;

  return (
    <Box>
      <Navbar userId={user._id} picturePath={user.picturePath} />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <EditProfileWidget user={user} />
        {/* <Box flexBasis={isNonMobileScreens ? "50%" : undefined}>
          <EditProfileWidget user={user} />
        </Box> */}
      </Box>
    </Box>
  );
};

export default ProfilePage;
