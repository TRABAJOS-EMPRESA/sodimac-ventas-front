import { ColumnConfig } from "@/constants/column-config.constant";

export interface GetSettingsTable {

    userId: string;
    settings: ColumnConfig[];
}