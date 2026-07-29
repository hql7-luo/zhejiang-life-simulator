import { achievements } from "@/data/regions/zhejiang/achievements";
import { familyBackgrounds } from "@/data/regions/zhejiang/birth-profiles";
import { cities } from "@/data/regions/zhejiang/cities";
import { endings } from "@/data/regions/zhejiang/endings";
import { allEvents } from "@/data/regions/zhejiang/events";
import type { RegionPack } from "@/types";

export const zhejiangPack: RegionPack = {
  id: "zhejiang",
  name: "浙江",
  cities,
  familyBackgrounds,
  events: allEvents,
  achievements,
  endings,
};

export { achievements, cities, endings, allEvents, familyBackgrounds };
