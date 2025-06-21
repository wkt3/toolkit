import React from "react";
//note never put useclient else it will create hydration error

const EmptyState = () => {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 h-full flex justify-center items-center bg-gray-200">
      <div className="items-center text-center flex flex-col">
        <h3 className="mt-2 text-2xl text-semibold">
          Select a chat or start a new Conversation
        </h3>
      </div>
    </div>
  );
};

export default EmptyState;
