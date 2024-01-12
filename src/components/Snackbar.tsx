import { useState, forwardRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import { MdDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";

export type CountdownHandle = {
  show: () => void;
};

type SnackbarProps = {
  type: "success" | "error" | "info";
  message: string;
};

const Snackbar = forwardRef<CountdownHandle, SnackbarProps>(
  ({ message, type }, ref) => {
    const [showSnackbar, setShowSnackbar] = useState(false);

    useImperativeHandle(ref, () => ({
      show() {
        setShowSnackbar(true);
        setTimeout(() => {
          setShowSnackbar(false);
        }, 3000);
      },
    }));

    return createPortal(
      <div
        className="snackbar z-50 shadow-lg"
        id={showSnackbar ? "show" : "hide"}
        style={{
          backgroundColor: type === "success" ? "#00F593" : "#FF0033",
          color: type === "success" ? "black" : "white",
        }}
      >
        <div className="symbol">
          {type === "success" ? <MdDone /> : <VscError />}
        </div>
        <div className="message">{message}</div>
      </div>,
      document.getElementById("modal")!,
    );
  },
);

export default Snackbar;
