<?php

namespace App\Enums;

enum TripStatus: string
{
    case DRAFT = 'draft';
    case DISPATCHED = 'dispatched';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    public function canTransitionTo(self $next): bool
    {
        return match ($this) {
            self::DRAFT => in_array($next, [self::DISPATCHED, self::CANCELLED]),
            self::DISPATCHED => in_array($next, [self::IN_PROGRESS, self::CANCELLED]),
            self::IN_PROGRESS => in_array($next, [self::COMPLETED, self::CANCELLED]),
            self::COMPLETED, self::CANCELLED => false,
        };
    }
}
