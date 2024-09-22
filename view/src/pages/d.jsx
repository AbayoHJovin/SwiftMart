import React from "react";

export const D = () => {
  function handleDiv() {
    console.log("This is the div");
  }

  function handleButton(event) {
    event.stopPropagation(); // Stop the event from bubbling up to the div
    console.log("This is the button");
  }

  return (
    <div>
      <div onClick={handleDiv} className="w-full h-screen border bg-red-500">
        <button onClick={handleButton} className="bg-blue-500 p-2">
          This is the button
        </button>
      </div>
    </div>
  );
};
