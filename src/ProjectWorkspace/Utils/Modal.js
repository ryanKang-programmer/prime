import React from "react";

const modal = {
  position: "fixed",
  zIndex: 1,
  left: 0,
  top: 0,
  width: "100vw",
  height: "100vh",
  overflow: "auto",
  backgroundColor: "rgba(192,192,192,0.5)",
  display: "flex",
  alignItems: "center"
}; 

const close = {
  position: "absolute",
  top: "11vh",
  right: "27vw",
  color: "#000000",
  fontSize: 40,
  fontWeight: "bold",
  cursor: "pointer"
};

const modalContent = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "50%",
  height: "80%",
  margin: "auto",
  backgroundColor: "white"
  // border: "2px solid #000000"
};

export const Modal = ({ onOpen, children }) => {
  console.log(children)
  return <div onClick={onOpen}> {children}</div>;
};

export const ModalContent = ({ onClose, children }) => {
  return (
    <div style={modal}>
      <div style={modalContent}>
        <span style={close} onClick={onClose}>
          &times;
        </span>
        {children}</div>
    </div>
  );
};
