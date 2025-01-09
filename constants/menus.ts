import { LeftSideBarMenu } from "@/interfaces/navigation/left-sidebar-menu.interface";
import {
  getAlignLeftSVG,
  getBriefCaseSVG,
  getLogoSmallSVG,
  getWalletsSVG,
} from "@/utils/icons-svg-data";
import ROUTES_EXECUTIVE from "./routes";

export const leftSideBarMenuExecutive: LeftSideBarMenu[] = [
  {
    title: "Escritorio Ejecutivo",
    icon: () => getLogoSmallSVG(),
    href: ROUTES_EXECUTIVE.DESK_EXECUTIVE,
  },
  {
    title: "Oportunidades Padre",
    icon: () => getBriefCaseSVG(),
    href: ROUTES_EXECUTIVE.OPORTUNITIES_FATHER,
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
