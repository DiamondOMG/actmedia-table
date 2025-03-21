// src/types/campaigns.ts

export interface Campaign {
  sequenceId: string;
  label: string;
  version: string;
  createdMillis: string;
  modifiedMillis: string;
  itemId: string;
  labelItems: string;
  durationMillis: string;
  startMillis: string;
  endMillis: string;
  thumbnail: string;
  [key: string]: any; // For additional fields that might be added later
}