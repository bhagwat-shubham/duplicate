import React from "react";

const Upload = () => {
  return (
    <div>
      <div className="grid md:grid-cols-2  gap-10">
        <div className="p-4  md:w-auto h-96 border-gray-400 border rounded border-4 border-opacity-3">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            <svg
              className="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20">
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            <span>Upload File</span>
          </button>
        </div>
        <div className="p-4 md:w-auto border-gray-400 border rounded border-4 border-opacity-3">
          {" "}
        </div>
      </div>
    </div>
  );
};
export { Upload };
