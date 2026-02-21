import { Vehicle, Trip, MaintenanceRecord, Expense, Driver, KpiData } from "./types";

export const mockVehicles: Vehicle[] = [
  { id: "v1", name: "Titan Hauler", model: "Volvo FH16", licensePlate: "FL-4821-TX", capacity: 25, capacityUnit: "tons", odometerKm: 142500, status: "active", year: 2022, fuelType: "Diesel", lastServiceDate: "2026-01-15", nextServiceDate: "2026-04-15", assignedDriver: "d1" },
  { id: "v2", name: "Swift Runner", model: "Mercedes Actros", licensePlate: "FL-7733-CA", capacity: 18, capacityUnit: "tons", odometerKm: 98200, status: "active", year: 2023, fuelType: "Diesel", lastServiceDate: "2026-02-01", nextServiceDate: "2026-05-01", assignedDriver: "d2" },
  { id: "v3", name: "Northern Star", model: "Scania R500", licensePlate: "FL-1199-NY", capacity: 22, capacityUnit: "tons", odometerKm: 210800, status: "maintenance", year: 2021, fuelType: "Diesel", lastServiceDate: "2026-02-10", nextServiceDate: "2026-02-28" },
  { id: "v4", name: "Cargo Express", model: "DAF XF", licensePlate: "FL-5501-IL", capacity: 20, capacityUnit: "tons", odometerKm: 175300, status: "active", year: 2022, fuelType: "Diesel", lastServiceDate: "2025-12-20", nextServiceDate: "2026-03-20", assignedDriver: "d3" },
  { id: "v5", name: "Blue Thunder", model: "MAN TGX", licensePlate: "FL-8842-FL", capacity: 24, capacityUnit: "tons", odometerKm: 89400, status: "active", year: 2024, fuelType: "Diesel", lastServiceDate: "2026-01-28", nextServiceDate: "2026-04-28", assignedDriver: "d4" },
  { id: "v6", name: "Iron Duke", model: "Kenworth T680", licensePlate: "FL-3367-WA", capacity: 30, capacityUnit: "tons", odometerKm: 312000, status: "inactive", year: 2019, fuelType: "Diesel", lastServiceDate: "2025-11-05", nextServiceDate: "2026-02-05" },
  { id: "v7", name: "Road Warrior", model: "Peterbilt 579", licensePlate: "FL-6654-AZ", capacity: 28, capacityUnit: "tons", odometerKm: 156700, status: "active", year: 2023, fuelType: "Diesel", lastServiceDate: "2026-02-05", nextServiceDate: "2026-05-05", assignedDriver: "d5" },
  { id: "v8", name: "Silver Bullet", model: "Freightliner Cascadia", licensePlate: "FL-2218-OR", capacity: 26, capacityUnit: "tons", odometerKm: 201500, status: "active", year: 2022, fuelType: "Diesel", lastServiceDate: "2026-01-10", nextServiceDate: "2026-04-10", assignedDriver: "d6" },
  { id: "v9", name: "Hawk Eye", model: "Iveco S-Way", licensePlate: "FL-9901-NV", capacity: 19, capacityUnit: "tons", odometerKm: 67800, status: "active", year: 2024, fuelType: "LNG", lastServiceDate: "2026-02-12", nextServiceDate: "2026-05-12", assignedDriver: "d7" },
  { id: "v10", name: "Desert Fox", model: "Volvo VNL", licensePlate: "FL-4456-CO", capacity: 23, capacityUnit: "tons", odometerKm: 278900, status: "retired", year: 2018, fuelType: "Diesel", lastServiceDate: "2025-09-20", nextServiceDate: "—" },
];

export const mockDrivers: Driver[] = [
  { id: "d1", name: "Marcus Chen", licenseNumber: "CDL-88421", licenseExpiry: "2027-03-15", phone: "+1-555-0101", status: "active", safetyScore: 94, totalTrips: 287, totalKm: 145200, joinDate: "2021-06-01" },
  { id: "d2", name: "Sarah Mitchell", licenseNumber: "CDL-77230", licenseExpiry: "2026-08-22", phone: "+1-555-0102", status: "active", safetyScore: 98, totalTrips: 342, totalKm: 178400, joinDate: "2020-09-15" },
  { id: "d3", name: "Jake Morrison", licenseNumber: "CDL-65119", licenseExpiry: "2026-04-10", phone: "+1-555-0103", status: "active", safetyScore: 87, totalTrips: 198, totalKm: 98700, joinDate: "2022-03-20" },
  { id: "d4", name: "Elena Rodriguez", licenseNumber: "CDL-91847", licenseExpiry: "2027-11-30", phone: "+1-555-0104", status: "active", safetyScore: 96, totalTrips: 412, totalKm: 215600, joinDate: "2019-11-01" },
  { id: "d5", name: "Tommy Okafor", licenseNumber: "CDL-33892", licenseExpiry: "2026-03-05", phone: "+1-555-0105", status: "active", safetyScore: 91, totalTrips: 156, totalKm: 87200, joinDate: "2023-01-10" },
  { id: "d6", name: "Raj Patel", licenseNumber: "CDL-54210", licenseExpiry: "2028-01-18", phone: "+1-555-0106", status: "active", safetyScore: 89, totalTrips: 223, totalKm: 112800, joinDate: "2021-08-12" },
  { id: "d7", name: "Lisa Nguyen", licenseNumber: "CDL-72003", licenseExpiry: "2027-06-25", phone: "+1-555-0107", status: "active", safetyScore: 97, totalTrips: 301, totalKm: 167300, joinDate: "2020-04-05" },
  { id: "d8", name: "Carlos Mendez", licenseNumber: "CDL-48156", licenseExpiry: "2026-02-28", phone: "+1-555-0108", status: "suspended", safetyScore: 72, totalTrips: 145, totalKm: 76400, joinDate: "2022-07-18" },
];

export const mockTrips: Trip[] = [
  { id: "t1", tripCode: "TRP-2601", vehicleId: "v1", vehicleName: "Titan Hauler", driverId: "d1", driverName: "Marcus Chen", origin: "Dallas, TX", destination: "Houston, TX", status: "completed", distanceKm: 385, estimatedDuration: "4h 30m", departureDate: "2026-02-18", arrivalDate: "2026-02-18", cargo: "Electronics", cargoWeight: 18.5 },
  { id: "t2", tripCode: "TRP-2602", vehicleId: "v2", vehicleName: "Swift Runner", driverId: "d2", driverName: "Sarah Mitchell", origin: "Los Angeles, CA", destination: "San Francisco, CA", status: "in_progress", distanceKm: 615, estimatedDuration: "6h 15m", departureDate: "2026-02-21", cargo: "Perishables", cargoWeight: 12.3 },
  { id: "t3", tripCode: "TRP-2603", vehicleId: "v4", vehicleName: "Cargo Express", driverId: "d3", driverName: "Jake Morrison", origin: "Chicago, IL", destination: "Detroit, MI", status: "dispatched", distanceKm: 452, estimatedDuration: "5h 00m", departureDate: "2026-02-22", cargo: "Auto Parts", cargoWeight: 16.8 },
  { id: "t4", tripCode: "TRP-2604", vehicleId: "v5", vehicleName: "Blue Thunder", driverId: "d4", driverName: "Elena Rodriguez", origin: "Miami, FL", destination: "Atlanta, GA", status: "draft", distanceKm: 1065, estimatedDuration: "10h 30m", departureDate: "2026-02-24", cargo: "Furniture", cargoWeight: 22.1 },
  { id: "t5", tripCode: "TRP-2605", vehicleId: "v7", vehicleName: "Road Warrior", driverId: "d5", driverName: "Tommy Okafor", origin: "Phoenix, AZ", destination: "Las Vegas, NV", status: "completed", distanceKm: 480, estimatedDuration: "4h 45m", departureDate: "2026-02-16", arrivalDate: "2026-02-16", cargo: "Construction Materials", cargoWeight: 25.0 },
  { id: "t6", tripCode: "TRP-2606", vehicleId: "v8", vehicleName: "Silver Bullet", driverId: "d6", driverName: "Raj Patel", origin: "Portland, OR", destination: "Seattle, WA", status: "completed", distanceKm: 280, estimatedDuration: "3h 15m", departureDate: "2026-02-15", arrivalDate: "2026-02-15", cargo: "Textiles", cargoWeight: 14.2 },
  { id: "t7", tripCode: "TRP-2607", vehicleId: "v9", vehicleName: "Hawk Eye", driverId: "d7", driverName: "Lisa Nguyen", origin: "Denver, CO", destination: "Salt Lake City, UT", status: "dispatched", distanceKm: 820, estimatedDuration: "8h 00m", departureDate: "2026-02-22", cargo: "Medical Supplies", cargoWeight: 8.5 },
  { id: "t8", tripCode: "TRP-2608", vehicleId: "v1", vehicleName: "Titan Hauler", driverId: "d1", driverName: "Marcus Chen", origin: "Houston, TX", destination: "New Orleans, LA", status: "draft", distanceKm: 560, estimatedDuration: "5h 45m", departureDate: "2026-02-25", cargo: "Industrial Equipment", cargoWeight: 24.0 },
  { id: "t9", tripCode: "TRP-2609", vehicleId: "v2", vehicleName: "Swift Runner", driverId: "d2", driverName: "Sarah Mitchell", origin: "San Diego, CA", destination: "Phoenix, AZ", status: "cancelled", distanceKm: 570, estimatedDuration: "5h 30m", departureDate: "2026-02-19", cargo: "Food Products", cargoWeight: 15.0 },
];

export const mockMaintenance: MaintenanceRecord[] = [
  { id: "m1", vehicleId: "v3", vehicleName: "Northern Star", type: "repair", description: "Transmission overhaul", date: "2026-02-10", cost: 4850, status: "in_progress", vendor: "TruckPro Services", odometerAtService: 210800 },
  { id: "m2", vehicleId: "v1", vehicleName: "Titan Hauler", type: "routine", description: "Oil change & filter replacement", date: "2026-01-15", cost: 320, status: "completed", vendor: "FleetCare Center", odometerAtService: 141200 },
  { id: "m3", vehicleId: "v5", vehicleName: "Blue Thunder", type: "inspection", description: "Annual DOT inspection", date: "2026-01-28", cost: 150, status: "completed", vendor: "National Inspection Co.", odometerAtService: 88900 },
  { id: "m4", vehicleId: "v7", vehicleName: "Road Warrior", type: "routine", description: "Brake pad replacement", date: "2026-02-05", cost: 680, status: "completed", vendor: "BrakeMaster Inc.", odometerAtService: 155800 },
  { id: "m5", vehicleId: "v4", vehicleName: "Cargo Express", type: "repair", description: "AC compressor replacement", date: "2025-12-20", cost: 1200, status: "completed", vendor: "CoolTech Auto", odometerAtService: 174100 },
  { id: "m6", vehicleId: "v8", vehicleName: "Silver Bullet", type: "routine", description: "Tire rotation & alignment", date: "2026-01-10", cost: 450, status: "completed", vendor: "TireWorld Fleet", odometerAtService: 200100 },
  { id: "m7", vehicleId: "v6", vehicleName: "Iron Duke", type: "emergency", description: "Engine coolant leak repair", date: "2025-11-05", cost: 2100, status: "completed", vendor: "Emergency Fleet Repair", odometerAtService: 311500 },
  { id: "m8", vehicleId: "v2", vehicleName: "Swift Runner", type: "routine", description: "Full service — 100K km", date: "2026-02-01", cost: 890, status: "completed", vendor: "Mercedes Fleet Center", odometerAtService: 98000 },
];

export const mockExpenses: Expense[] = [
  { id: "e1", vehicleId: "v1", vehicleName: "Titan Hauler", category: "fuel", amount: 485.20, currency: "USD", date: "2026-02-18", description: "Full tank — Dallas depot" },
  { id: "e2", vehicleId: "v2", vehicleName: "Swift Runner", category: "fuel", amount: 392.80, currency: "USD", date: "2026-02-20", description: "Full tank — LA terminal" },
  { id: "e3", vehicleId: "v1", vehicleName: "Titan Hauler", category: "tolls", amount: 67.50, currency: "USD", date: "2026-02-18", description: "I-45 tolls Dallas–Houston" },
  { id: "e4", vehicleId: "v3", vehicleName: "Northern Star", category: "maintenance", amount: 4850.00, currency: "USD", date: "2026-02-10", description: "Transmission overhaul" },
  { id: "e5", vehicleId: "v5", vehicleName: "Blue Thunder", category: "insurance", amount: 1250.00, currency: "USD", date: "2026-02-01", description: "Monthly fleet insurance premium" },
  { id: "e6", vehicleId: "v7", vehicleName: "Road Warrior", category: "fuel", amount: 520.40, currency: "USD", date: "2026-02-16", description: "Full tank — Phoenix depot" },
  { id: "e7", vehicleId: "v4", vehicleName: "Cargo Express", category: "fuel", amount: 445.60, currency: "USD", date: "2026-02-19", description: "Full tank — Chicago terminal" },
  { id: "e8", vehicleId: "v8", vehicleName: "Silver Bullet", category: "tolls", amount: 32.00, currency: "USD", date: "2026-02-15", description: "I-5 tolls Portland–Seattle" },
  { id: "e9", vehicleId: "v9", vehicleName: "Hawk Eye", category: "fuel", amount: 380.90, currency: "USD", date: "2026-02-21", description: "LNG refill — Denver station" },
  { id: "e10", vehicleId: "v2", vehicleName: "Swift Runner", category: "other", amount: 85.00, currency: "USD", date: "2026-02-17", description: "Parking — overnight SF lot" },
];

export const dashboardKpis: KpiData[] = [
  { label: "Active Fleet", value: 7, change: 2, changeLabel: "vs last month", icon: "truck" },
  { label: "Maintenance Alerts", value: 3, change: -1, changeLabel: "vs last week", icon: "wrench" },
  { label: "Utilization Rate", value: "78%", change: 5.2, changeLabel: "vs last month", icon: "gauge" },
  { label: "Pending Cargo", value: 4, change: 0, changeLabel: "unchanged", icon: "package" },
];

export const fuelSpendData = [
  { month: "Sep", amount: 8420 },
  { month: "Oct", amount: 9100 },
  { month: "Nov", amount: 8750 },
  { month: "Dec", amount: 7980 },
  { month: "Jan", amount: 9340 },
  { month: "Feb", amount: 8650 },
];

export const utilizationData = [
  { month: "Sep", rate: 72 },
  { month: "Oct", rate: 75 },
  { month: "Nov", rate: 68 },
  { month: "Dec", rate: 71 },
  { month: "Jan", rate: 80 },
  { month: "Feb", rate: 78 },
];

export const costBreakdownData = [
  { name: "Fuel", value: 52400, color: "hsl(172, 66%, 50%)" },
  { name: "Maintenance", value: 12640, color: "hsl(38, 92%, 50%)" },
  { name: "Insurance", value: 7500, color: "hsl(262, 60%, 55%)" },
  { name: "Tolls", value: 3200, color: "hsl(152, 69%, 40%)" },
  { name: "Other", value: 1850, color: "hsl(220, 10%, 50%)" },
];
