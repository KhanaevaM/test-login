import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputBase,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const registerSchema = yup.object().shape({
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
  email: yup
    .string()
    .email("invalid email")
    .required("required")
    .min(2, "Must be longer then 2 letters")
    .max(50, "Must be shorter then 50 letters"),
  password: yup
    .string()
    .required("required")
    .min(5, "Must be longer then 5 letters")
    .max(20, "Must be shorter then 20 letters"),
  birthday: yup
    .date()
    .typeError("The value must be a date (DD.MM.YYYY)")
    .required("required")
    .max(new Date(), "You can't be born in the future!"),
  gender: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  birthday: undefined,
  gender: undefined,
  picture: "",
};

const Form = ({ handleSubmit, pageType, error, setPageType }) => {
  const { palette } = useTheme();
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  return (
    <Formik
      enableReinitialize
      validateOnMount
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
        isValid,
      }) => (
        <form onSubmit={handleSubmit} name="authForm">
          <Box display="flex" flexDirection="column" gap="2rem">
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                />

                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Birthday"
                    onBlur={handleBlur}
                    onChange={(value) => setFieldValue("birthday", value, true)}
                    value={undefined}
                    name="birthday"
                    format="DD.MM.YYYY"
                    slotProps={{
                      textField: {
                        error:
                          Boolean(touched.birthday) && Boolean(errors.birthday),
                        helperText: touched.birthday && errors.birthday,
                      },
                    }}
                  />
                </LocalizationProvider>
                <FormControl variant="standard" value={values.gender}>
                  <Select
                    onBlur={handleBlur}
                    onChange={handleChange}
                    defaultValue=""
                    value={undefined}
                    name="gender"
                    sx={{
                      backgroundColor: palette.neutral.light,
                      width: "150px",
                      borderRadius: "0.25rem",
                      p: "0.25rem 1rem",
                      "& .MuiSvgIcon-root": {
                        pr: "0.25rem",
                        width: "3rem",
                      },
                      "& .MuiSelect-select:focus": {
                        backgroundColor: palette.neutral.light,
                      },
                    }}
                    input={<InputBase />}
                  >
                    <MenuItem value="Male">
                      <Typography>Male</Typography>
                    </MenuItem>
                    <MenuItem value="Female">
                      <Typography>Female</Typography>
                    </MenuItem>
                    <MenuItem value="Other">
                      <Typography>Other</Typography>
                    </MenuItem>
                  </Select>
                </FormControl>
                <Box
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                    name="picture"
                    error={Boolean(touched.picture) && Boolean(errors.picture)}
                    helperText={touched.picture && errors.picture}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />
          </Box>

          {error && (
            <Typography
              mt="1rem"
              sx={{
                color: palette.warning.main,
              }}
            >
              {error}
            </Typography>
          )}

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              disabled={
                !isValid ||
                (Object.keys(touched).length === 0 &&
                  touched.constructor === Object)
              }
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
                "&:disabled": {
                  backgroundColor: palette.background.alt,
                },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
