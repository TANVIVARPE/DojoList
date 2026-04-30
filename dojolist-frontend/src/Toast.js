// Toast.js
import React from "react";
import "./Toast.css"; // we'll style it next

function Toast({ message }) {
  return (
    <div className="toast">
      {message}
    </div>
  );
}

export default Toast;
