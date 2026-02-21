<?php

namespace App\Enums;

enum VehicleStatus: string
{
    case AVAILABLE = 'available';
    case ON_TRIP = 'on_trip';
    case IN_MAINTENANCE = 'in_maintenance';
    case RETIRED = 'retired';
}
