import { commonEvents } from "@/data/regions/zhejiang/events/common";
import { hangzhouEvents } from "@/data/regions/zhejiang/events/hangzhou";
import { hiddenEvents } from "@/data/regions/zhejiang/events/hidden";
import { jinhuaEvents } from "@/data/regions/zhejiang/events/jinhua";
import { ningboEvents } from "@/data/regions/zhejiang/events/ningbo";
import { otherCityEvents } from "@/data/regions/zhejiang/events/other-cities";
import { taizhouEvents } from "@/data/regions/zhejiang/events/taizhou";
import { wenzhouEvents } from "@/data/regions/zhejiang/events/wenzhou";

export {
  commonEvents,
  hangzhouEvents,
  ningboEvents,
  wenzhouEvents,
  jinhuaEvents,
  taizhouEvents,
  otherCityEvents,
  hiddenEvents,
};

export const allEvents = [
  ...commonEvents,
  ...hangzhouEvents,
  ...ningboEvents,
  ...wenzhouEvents,
  ...jinhuaEvents,
  ...taizhouEvents,
  ...otherCityEvents,
  ...hiddenEvents,
];

export const eventCounts = {
  common: commonEvents.length,
  hangzhou: hangzhouEvents.length,
  ningbo: ningboEvents.length,
  wenzhou: wenzhouEvents.length,
  jinhua: jinhuaEvents.length,
  taizhou: taizhouEvents.length,
  otherCities: otherCityEvents.length,
  hidden: hiddenEvents.length,
  total: allEvents.length,
};
