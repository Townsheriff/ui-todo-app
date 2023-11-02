import { Fab } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));
