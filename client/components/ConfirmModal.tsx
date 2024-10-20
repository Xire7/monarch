import Link from "next/link";
import React from "react";

const ConfirmModal = (props: { isOpen: any; onClose: any }) => {
  return (
    <div className="absolute animate-fadeup bg-white justify-center items-center drop-shadow-lg p-8 flex flex-col space-y-8 border-2 border-neutral-400 rounded-lg">
      <p className="text-xl">Are you sure you want to leave?</p>
      <div className="flex flex-row space-x-8 justify-center items-center ">
        <button
          onClick={props.onClose}
          className="bg-orange-400 hover:bg-orange-300 text-white font-medium border-b-4 border-orange-600 hover:border-orange-400 rounded-xl hover:scale-125 transition-transform duration-300"
        >
          <Link href={"/"}>
            <p className="text-md font-medium px-4 py-2">Leave</p>
          </Link>
        </button>
        <button
          onClick={props.onClose}
          className="bg-neutral-100 hover:bg-neutral-200 text-black font-medium border-b-4 border-neutral-400 hover:border-neutral-400 rounded-xl hover:scale-125 transition-transform duration-300"
        >
          <p className="text-md font-medium px-4 py-2">Cancel</p>
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
