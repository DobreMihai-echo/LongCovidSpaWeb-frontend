export interface HealthData {
  id: number;
  heartRateVariability: number | null;
  spo2: number | null;
  steps: number | null;
  respirationsPerMinute: number | null;
  distance: number | null;
  calories: number | null;
  bodyBattery: number | null;
  receivedDate: string; // ISO
}