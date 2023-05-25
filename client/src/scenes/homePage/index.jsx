import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import {} from "state";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const [users, setUsers] = useState(null);
  const token = useSelector((state) => state.token);

  const updateUsers = async () => {
    const response = await fetch(`http://localhost:3001/users/users/${_id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };

  useEffect(() => {
    updateUsers();
  }, []);

  if (!users) return null;

  return (
    <Box>
      <Navbar userId={_id} picturePath={picturePath} />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
      >
        {users.map((item, index) => (
          <UserWidget key={index} user={item} />
        ))}
      </Box>
    </Box>
  );
};

export default HomePage;
