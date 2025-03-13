import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const PanelFix = ({ isOpen, onClose, children }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm" // Puedes cambiar a "md", "lg", etc.
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          padding: 1,
          maxHeight: "85vh",
          width: "calc(100% - 20px)",
          margin: "20px",
        },
      }}
    >
      <DialogContent
        dividers
        sx={{
          padding: "10px 15px", // Aplica el mismo padding que en tu CSS
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={onClose}>
            <CloseOutlinedIcon />
          </IconButton>
        </div>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default PanelFix;
