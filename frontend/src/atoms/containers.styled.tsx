import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const VBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const HBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(2),
}));

export const HWrapBox = styled(Box)(({ theme }) => ({
  margin: theme.spacing(4),
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "flexStart",
  gap: theme.spacing(4),
}));
