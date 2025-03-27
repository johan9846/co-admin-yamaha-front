import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const PanelFix = ({ isOpen, onClose, children }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="xs" // Puedes cambiar a "md", "lg", etc.
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          padding: "0px 0.5% 20px 0.5%",
          maxHeight: "85vh",
          width: "calc(100% - 20px)",
          margin: "20px",
        },
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={onClose} sx={{margin:"8px 5px 0px 0px"}}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
      <DialogContent
    /*     dividers */
        sx={{
          padding: "1px 15px", // Aplica el mismo padding que en tu CSS
        }}
      >
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default PanelFix;
