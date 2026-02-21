<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\MaintenanceService;
use App\Models\MaintenanceLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MaintenanceController extends Controller
{
    use ApiResponse;

    protected MaintenanceService $maintenanceService;

    public function __construct(MaintenanceService $maintenanceService)
    {
        $this->maintenanceService = $maintenanceService;
    }

    public function index(Request $request)
    {
        $logs = $this->maintenanceService->list(
            $request->only(['vehicle_id', 'status', 'type', 'date_from', 'date_to', 'sort_by', 'sort_dir']),
            $request->get('per_page', 15)
        );
        return $this->paginated($logs, 'Maintenance logs retrieved');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'required|exists:vehicles,id',
            'type' => 'required|in:preventive,corrective,inspection,emergency',
            'description' => 'required|string|max:255',
            'cost' => 'nullable|numeric|min:0',
            'odometer_at_service' => 'nullable|numeric|min:0',
            'scheduled_date' => 'required|date',
            'status' => 'nullable|in:scheduled,in_progress',
            'service_provider' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $log = $this->maintenanceService->create($validator->validated());
        return $this->success($log->load('vehicle'), 'Maintenance log created', 201);
    }

    public function show(MaintenanceLog $maintenance)
    {
        $maintenance->load('vehicle');
        return $this->success($maintenance, 'Maintenance log retrieved');
    }

    public function update(Request $request, MaintenanceLog $maintenance)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'sometimes|in:preventive,corrective,inspection,emergency',
            'description' => 'sometimes|string|max:255',
            'cost' => 'sometimes|numeric|min:0',
            'odometer_at_service' => 'nullable|numeric|min:0',
            'scheduled_date' => 'sometimes|date',
            'status' => 'sometimes|in:scheduled,in_progress,completed,cancelled',
            'service_provider' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $log = $this->maintenanceService->update($maintenance, $validator->validated());
        return $this->success($log, 'Maintenance log updated');
    }

    public function complete(MaintenanceLog $maintenance)
    {
        $log = $this->maintenanceService->complete($maintenance);
        return $this->success($log, 'Maintenance completed, vehicle status updated');
    }

    public function destroy(MaintenanceLog $maintenance)
    {
        $this->maintenanceService->delete($maintenance);
        return $this->success(null, 'Maintenance log deleted');
    }
}
