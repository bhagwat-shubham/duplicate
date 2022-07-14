import React from "react";
import Button from "react-bootstrap/Button";
import { useUser } from "../firebase/useUser";

const ButtonLogout = () => {
  const { logout } = useUser();

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <Button
        onClick={() => logout()}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded inline-flex items-center mt-8">
        Log Out
      </Button>
    </div>
  );
};

export { ButtonLogout };
