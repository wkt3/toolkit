"use client";
import React from "react";
import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill,
} from "react-icons/gi";
import { MdOutlineVilla } from "react-icons/md";
import { FaSkiing } from "react-icons/fa";
import { BsSnow } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";
import Container from "../Container";
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";


export const categories = [
  {
    label: "Beach",
    icon: TbBeach,
    description: "This property is close to Beach",
  },
  {
    label: "WindMills",
    icon: GiWindmill,
    description: "This property has windmills ",
  },
  {
    label: "Modern",
    icon: MdOutlineVilla,
    description: "This property has windmills ",
  },
  {
    label: "Castles",
    icon: GiCastle,
    description: "This property in a castle ",
  },
  {
    label: "CountrySide",
    icon: TbMountain,
    description: "This property has Country side Mountains",
  },
  {
    label: "Pools",
    icon: TbPool,
    description: "This property has a Swimming Pool",
  },
  {
    label: "Islands",
    icon: GiIsland,
    description: "This property has a Swimming Pool",
  },
  {
    label: "Lake",
    icon: GiBoatFishing,
    description: "This property close to Lake",
  },
  {
    label: "Skiing",
    icon: FaSkiing,
    description: "This property has skiing activities",
  },
  {
    label: "Camping",
    icon: GiForestCamp,
    description: "This property has Camping activities",
  },
  {
    label: "Arctic",
    icon: BsSnow,
    description: "This property in Arctic",
  },
  {
    label: "Cave",
    icon: GiCaveEntrance,
    description: "This property in a  Cave ",
  },
  {
    label: "Desert",
    icon: GiCactus,
    description: "This property in Desert ",
  },
  {
    label: "Barns",
    icon: GiBarn,
    description: "This property in Desert ",
  },
  {
    label: "Lux",
    icon: IoDiamond,
    description: "This property in Desert ",
  },
];

function Categories() {
  const params = useSearchParams()
  const category=params.get("category")
  
  const pathname = usePathname()
  const isMainPage = pathname === "/main"
  
  if (!isMainPage) {
    return null
  }
  return (
    <Container>
      <div
        className="
        border-t-2
        border-gray-300
        border-b-2
        flex
        flex-row
        items-center
        justify-between
        overflow-x-auto
        pt-4
        "
        >
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            selected={category ===item.label}
            icon={item.icon}
          />
        ))}
      </div>
    </Container>
  );
}
export default Categories;