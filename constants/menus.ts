import { LeftSideBarMenu } from "@/interfaces/navigation/left-sidebar-menu.interface";
import {
  getAlignLeftSVG,
  getBriefCaseSVG,
  getHomeSVG,
  getWalletsSVG,
} from "@/utils/icons-svg-data";
import ROUTES_EXECUTIVE from "./routes";

export const leftSideBarMenuExecutive: LeftSideBarMenu[] = [
  {
    title: "home",
    icon: () => getHomeSVG(),
    href: ROUTES_EXECUTIVE.DESK_EXECUTIVE,
  },
  {
    title: "Tareas",
    icon: () => getBriefCaseSVG(),
    href: ROUTES_EXECUTIVE.TASKS,
  },
  {
    title: "Oportunidades Hija",
    icon: () => getWalletsSVG(),
    href: ROUTES_EXECUTIVE.OPORTUNITIES_CHILD,
  },
  {
    title: "Estadísticas",
    icon: () => getAlignLeftSVG(),
    href: ROUTES_EXECUTIVE.STATISTICS,
  },
];
