import React from 'react'
import { BiSearch } from 'react-icons/bi'

const Search = () => {
  return (
    <div
      className="border-[1px]
    w-full
    md:w-auto
    rounded-full
    shadow-sm
    hover:shadow-md
    transition
    cursor-pointer
    dark:text-black
    "
    >
      <div
        className="
      flex
      flex-row
      items-center
      justify-between
      dark:text-black
      "
      >
        <div
          className="
        text-sm
        font-semibold
        px-6
        dark:text-black
        "
        >
          Anywhere
        </div>
        <div
          className="
        hidden
        sm:block
        text-sm
        font-semibold
        px-6
        border-x-[1px]
        flex-1
        text-center
        dark:text-black
        "
        >
          AnyWeek
        </div>
        <div
          className="
        text-sm
        pl-6
        pr-2
        flex
        flex=row
        items-center
        gap-3
        dark:text-black
        "
        >
          <div className="hidden sm:block dark:text-black">Add Guests</div>
          <div className="p-2 bg-orange-500 rounded-full dark:text-black">
            <BiSearch size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Search