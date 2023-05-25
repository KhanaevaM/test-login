import EditIcon from "@mui/icons-material/Edit";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Divider,
  IconButton,
} from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { Fragment, useRef, useState } from "react";
import DateWidget from "./DateWidget";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { updateProfile } from "state";
import FlexBetween from "components/FlexBetween";

const nameSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("required")
    .min(2, "Must be longer then 2 letters")
    .max(50, "Must be shorter then 50 letters"),
  lastName: yup
    .string()
    .required("required")
    .min(2, "Must be longer then 2 letters")
    .max(50, "Must be shorter then 50 letters"),
});

const passwordSchema = yup.object().shape({
  prevPassword: yup.string().required("required"),
  newPassword: yup
    .string()
    .required("required")
    .min(5, "Must be longer then 5 letters")
    .max(20, "Must be shorter then 20 letters"),

  repeatPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("required")
    .min(5, "Must be longer then 5 letters")
    .max(20, "Must be shorter then 20 letters"),
});

const initialValues = {
  prevPassword: "",
  newPassword: "",
  repeatPassword: "",
};

const EditProfileWidget = ({ user }) => {
  const [nameChange, setNameChange] = useState(false);
  const [passwordChange, setPasswordChange] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const { palette } = useTheme();
  const dispatch = useDispatch();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const ref = useRef();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const light = palette.neutral.light;

  const nameValues = {
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const update = async (values) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }

    if (values.picture) {
      formData.append("picturePath", values.picture.name);
    }

    formData.append("email", user.email);

    const savedUserResponse = await fetch("http://localhost:3001/auth/update", {
      method: "POST",
      body: formData,
    });
    const savedUser = await savedUserResponse.json();
    dispatch(
      updateProfile({
        user: savedUser,
      })
    );
  };

  const handleNameSubmit = async (values) => {
    setNameChange(false);
    await update(values);
  };

  const handlePasswordSubmit = async (values, onSubmitProps) => {
    var raw = `{"password": "${values.prevPassword}","newPassword": "${values.newPassword}","email": "${user.email}"}`;

    const passwordResponse = await fetch(
      "http://localhost:3001/auth/password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw,
      }
    );

    if (passwordResponse.ok) {
      onSubmitProps.resetForm();
      setPasswordSuccess(true);
    } else {
      setPasswordError("Wrong password");
    }
  };

  const changeHandler = async (event) => {
    const picture = event.target.files[0];
    const values = { picture: picture };
    await update(values);
  };

  const selectPicture = (e) => {
    ref.current.click();
  };

  return (
    <WidgetWrapper margin="1rem">
      {/* FIRST ROW */}
      <FlexBetween gap="0.5rem" pb="1.1rem">
        <Box
          display="flex"
          width="100%"
          flexDirection={isNonMobileScreens ? "row" : "column"}
          alignItems="center"
          gap="1rem"
        >
          <input
            ref={ref}
            type="file"
            accept=".jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={changeHandler}
          />
          <IconButton
            sx={{
              width: "80px",
              height: "80px",
              padding: "0",
            }}
            style={{ borderRadius: "50%" }}
            position="relative"
            onClick={selectPicture}
          >
            <img
              style={{
                objectFit: "cover",
                borderRadius: "50%",
                "&:hover": {
                  color: palette.primary.main,
                  backgroundColor: palette.primary.main,
                },
              }}
              width="100%"
              height="100%"
              alt={user.firstName + " " + user.lastName}
              src={`http://localhost:3001/assets/${user.picturePath}`}
            />
            <Box
              width="100%"
              height="100%"
              sx={{
                position: "absolute",
                borderRadius: "50%",
                opacity: 0,
                "&:hover": {
                  opacity: 0.9,
                },
                transition: "opacity 0.3s",
                backgroundColor: light,
              }}
              textAlign="center"
            >
              <CameraAltIcon
                fontSize="large"
                sx={{
                  position: "absolute",
                  left: "0",
                  right: "0",
                  top: "0",
                  bottom: "0",
                  margin: "auto",
                  color: medium,
                }}
              />
            </Box>
          </IconButton>

          <Box
            paddingLeft="1rem"
            sx={{
              borderLeft: isNonMobileScreens ? 1 : 0,
              borderColor: palette.primary.main,
            }}
            display="flex"
            alignItems="center"
            gap="1rem"
          >
            {nameChange ? (
              <Formik
                enableReinitialize
                onSubmit={handleNameSubmit}
                initialValues={nameValues}
                validationSchema={nameSchema}
              >
                {({
                  values,
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      label="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      name="firstName"
                      error={Boolean(errors.firstName)}
                      helperText={errors.firstName}
                      sx={{
                        marginRight: "1rem",
                      }}
                    />
                    <TextField
                      label="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      name="lastName"
                      error={Boolean(errors.lastName)}
                      helperText={errors.lastName}
                      sx={{
                        marginRight: "1rem",
                      }}
                    />
                    <IconButton type="submit" sx={{ mt: "0.5rem" }}>
                      <CheckBoxIcon fontSize="medium" sx={{ color: medium }} />
                    </IconButton>
                  </form>
                )}
              </Formik>
            ) : (
              <Fragment>
                <Typography variant="h4" color={dark} fontWeight="500">
                  {user.firstName} {user.lastName}
                </Typography>
                <IconButton onClick={() => setNameChange(true)}>
                  <EditIcon fontSize="medium" sx={{ color: medium }} />
                </IconButton>
              </Fragment>
            )}
          </Box>
        </Box>
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <Typography color={medium}>Birthday: </Typography>
          <DateWidget birthday={user.birthday} />
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <Typography color={medium}>Gender: </Typography>
          <Typography>{user.gender}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box pt="0.5rem">
        {passwordChange ? (
          <Formik
            enableReinitialize
            validateOnMount
            onSubmit={handlePasswordSubmit}
            validationSchema={passwordSchema}
            initialValues={initialValues}
          >
            {({
              values,
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              touched,
              setFieldValue,
              isValid,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="1rem"
                  mt="0.5rem"
                >
                  <TextField
                    label="Enter previous password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      setPasswordError("");
                      setFieldValue("prevPassword", e.target.value);
                    }}
                    value={values.prevPassword}
                    name="prevPassword"
                    error={
                      Boolean(passwordError) ||
                      (Boolean(touched.prevPassword) &&
                        Boolean(errors.prevPassword))
                    }
                    helperText={
                      touched.prevPassword &&
                      (passwordError || errors.prevPassword)
                    }
                    sx={{
                      marginRight: "1rem",
                    }}
                  />
                  <TextField
                    label="Enter new password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.newPassword}
                    name="newPassword"
                    error={
                      Boolean(touched.newPassword) &&
                      Boolean(errors.newPassword)
                    }
                    helperText={touched.newPassword && errors.newPassword}
                    sx={{
                      marginRight: "1rem",
                    }}
                  />
                  <TextField
                    label="Repeat new password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.repeatPassword}
                    name="repeatPassword"
                    error={
                      Boolean(touched.repeatPassword) &&
                      Boolean(errors.repeatPassword)
                    }
                    helperText={touched.repeatPassword && errors.repeatPassword}
                    sx={{
                      marginRight: "1rem",
                    }}
                  />
                  {passwordSuccess ? (
                    <Button
                      fullWidth
                      sx={{
                        m: "1rem 0",
                        p: "1rem",
                        backgroundColor: palette.primary.main,
                        color: palette.background.alt,
                        "&:hover": { color: palette.primary.main },
                      }}
                      onClick={() => {
                        setPasswordChange(false);
                        setPasswordSuccess(false);
                      }}
                    >
                      Success
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      type="submit"
                      disabled={
                        !isValid ||
                        (Object.keys(touched).length === 0 &&
                          touched.constructor === Object)
                      }
                      sx={{
                        m: "1rem 0",
                        p: "1rem",
                        backgroundColor: palette.primary.main,
                        color: palette.background.alt,
                        "&:hover": { color: palette.primary.main },
                        "&:disabled": {
                          backgroundColor: palette.background.alt,
                        },
                      }}
                    >
                      Change password
                    </Button>
                  )}
                </Box>
              </form>
            )}
          </Formik>
        ) : (
          <Fragment>
            <Box display="flex" alignItems="center" gap="1rem">
              <Typography color={medium}>Password: </Typography>
              <IconButton onClick={() => setPasswordChange(true)}>
                <EditIcon fontSize="medium" sx={{ color: medium }} />
              </IconButton>
            </Box>
          </Fragment>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default EditProfileWidget;
