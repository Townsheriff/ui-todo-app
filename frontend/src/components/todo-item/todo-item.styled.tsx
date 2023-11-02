import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledTextField = styled(TextField)(() => ({
  width: "100%",
}));

export const DeleteButton = styled(Button)(({ theme }) => ({
  marginLeft: "auto",
  backgroundColor: theme.palette.warning.dark,
}));
