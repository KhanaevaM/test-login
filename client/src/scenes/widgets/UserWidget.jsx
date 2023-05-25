import { Box, Typography, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const UserWidget = ({ user }) => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;

  const getAge = (birthday) => {
    var birthdayDate = new Date(birthday);
    var ageDifMs = Date.now() - birthdayDate;
    var ageDate = new Date(ageDifMs); // miliseconds from epoch

    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <WidgetWrapper margin="1rem">
      <FlexBetween gap="0.5rem">
        <FlexBetween gap="1rem">
          <UserImage image={user.picturePath} />

          <Box
            paddingLeft="1rem"
            sx={{ borderLeft: 1, borderColor: palette.primary.main }}
          >
            <Typography variant="h4" color={dark} fontWeight="500">
              {user.firstName} {user.lastName}
            </Typography>
            <Box display="flex" alignItems="center" gap="1rem">
              <Typography color={medium}>Age: </Typography>
              <Typography color={medium}>{getAge(user.birthday)}</Typography>
            </Box>
          </Box>
        </FlexBetween>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default UserWidget;
