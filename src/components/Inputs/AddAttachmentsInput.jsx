import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";
const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("");
  // Function to handle adding an option
  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };

  // Function to handle deleting an option
  const handleDeleteOption = (index) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updatedArr);
  };
  return (
    <div>
      {attachments.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-white shadow-sm border border-gray-200 px-3 py-2 rounded-md mb-2"
        >
          <div className="flex items-center gap-2">
            <LuPaperclip className="text-gray-500" />
            <p className="text-sm text-gray-800 break-all">{item}</p>
          </div>
          <button
            className="hover:bg-red-100 rounded-md p-1"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4 ">
        <div className="flex-1 flex items-center gap-3 border border-gray-100 rounded-md px-3">
          <LuPaperclip className="text-gray-400" />
          <input
            type="text"
            placeholder="Add File Link"
            value={option}
            onChange={({ target }) => {
              setOption(target.value);
            }}
            className="w-full text-[13px] text-black outline-none  border border-gray-100 py-3"
          />
        </div>
        <button className="card-btn text-nowrap" onClick={handleAddOption}>
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;
