import {ResultSummaryDto} from "./ResultSummaryDto";

export interface AvailableItem{
  itemId: number,
  userEmail: string,
  itemName: string,
  fileLocation:string,
  street: string,
  city: string,
  zipcode: string,
  state: string,
  resultSummary: ResultSummaryDto
}
