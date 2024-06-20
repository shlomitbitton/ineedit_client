import {NeedingEvent} from "./needing-event";

export interface NeedyEventsMap {
  [vendor: string]: NeedingEvent[];
}
