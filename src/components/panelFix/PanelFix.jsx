import { Col, Row } from "react-bootstrap";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import "./PanelFix.css";

const PanelFix = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // No renderizar nada si el modal no está abierto

  return (
    <div className="container-panel-fix">
      <Row
        style={{  width: "100%" }}
        className="d-flex justify-content-center"
      >
        <Col xs={11} sm={10} md={8} lg={8} xl={5} xxl={5} className="modal-fix">
   
        <div className="modal-scroll">
          <div className="icon-close">
            <CloseOutlinedIcon
              onClick={onClose}
              style={{ cursor: "pointer" }}
            />
          </div>

          <div className="mt-2">{children}</div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PanelFix;
