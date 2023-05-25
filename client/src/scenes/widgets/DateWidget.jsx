import { Typography } from "@mui/material";

const DateWidget = ({ birthday }) => {
  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleString().split(",")[0];
    return formattedDate;
  };

  return <Typography>{formatDate(birthday)}</Typography>;
};

export default DateWidget;
