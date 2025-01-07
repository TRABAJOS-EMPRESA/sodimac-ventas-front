import { JSX } from "react";

export interface LeftSideBarMenu {
  title: string;
  icon: () => JSX.Element;
  href: string;
}
