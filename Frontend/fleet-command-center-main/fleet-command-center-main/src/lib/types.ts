export type UserRole = "fleet_manager" | "dispatcher" | "safety_officer" | "financial_analyst";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type VehicleStatus = "active" | "maintenance" | "inactive" | "retired";

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  licensePlate: string;
  capacity: number;
  capacityUnit: string;
  odometerKm: number;
  status: VehicleStatus;
  year: number;
  fuelType: string;
  lastServiceDate: string;
  nextServiceDate: string;
  assignedDriver?: string;
}

export type TripStatus = "draft" | "dispatched" | "in_progress" | "completed" | "cancelled";

export interface Trip {
  id: string;
  tripCode: string;
  vehicleId: string;
  vehicleName: string;
  driverId: string;
  driverName: string;
  origin: string;
  destination: string;
  status: TripStatus;
  distanceKm: number;
  estimatedDuration: string;
  departureDate: string;
  arrivalDate?: string;
  cargo: string;
  cargoWeight: number;
}

export type MaintenanceType = "routine" | "repair" | "inspection" | "emergency";

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: MaintenanceType;
  description: string;
  date: string;
  cost: number;
  status: "scheduled" | "in_progress" | "completed";
  vendor: string;
  odometerAtService: number;
}

export interface Expense {
  id: string;
  vehicleId: string;
  vehicleName: string;
  category: "fuel" | "maintenance" | "insurance" | "tolls" | "other";
  amount: number;
  currency: string;
  date: string;
  description: string;
  receiptRef?: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseExpiry: string;
  phone: string;
  status: "active" | "inactive" | "suspended";
  safetyScore: number;
  totalTrips: number;
  totalKm: number;
  joinDate: string;
}

export interface KpiData {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
  badge?: string;
}
