<?php

namespace App\Enums;

enum DriverStatus: string
{
    case AVAILABLE = 'available';
    case ON_TRIP = 'on_trip';
    case OFF_DUTY = 'off_duty';
    case SUSPENDED = 'suspended';
}
