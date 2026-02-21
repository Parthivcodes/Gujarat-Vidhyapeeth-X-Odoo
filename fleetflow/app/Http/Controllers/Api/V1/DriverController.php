<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\DriverService;
use App\Models\Driver;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DriverController extends Controller
{
    use ApiResponse;

    protected DriverService $driverService;

    public function __construct(DriverService $driverService)
    {
        $this->driverService = $driverService;
    }

    public function index(Request $request)
    {
        $drivers = $this->driverService->list(
            $request->only(['status', 'search', 'license_valid', 'sort_by', 'sort_dir']),
            $request->get('per_page', 15)
        );
        return $this->paginated($drivers, 'Drivers retrieved');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id|unique:drivers,user_id',
            'license_number' => 'required|string|unique:drivers,license_number',
            'license_expiry' => 'required|date|after:today',
            'phone' => 'required|string|max:20',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $driver = $this->driverService->create($validator->validated());
        return $this->success($driver->load('user'), 'Driver created', 201);
    }

    public function show(Driver $driver)
    {
        $driver->load(['user', 'trips', 'performances']);
        return $this->success($driver, 'Driver retrieved');
    }

    public function update(Request $request, Driver $driver)
    {
        $validator = Validator::make($request->all(), [
            'license_number' => 'sometimes|string|unique:drivers,license_number,' . $driver->id,
            'license_expiry' => 'sometimes|date',
            'phone' => 'sometimes|string|max:20',
            'status' => 'sometimes|in:available,on_trip,off_duty,suspended',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $driver = $this->driverService->update($driver, $validator->validated());
        return $this->success($driver->load('user'), 'Driver updated');
    }

    public function destroy(Driver $driver)
    {
        $this->driverService->delete($driver);
        return $this->success(null, 'Driver deleted');
    }

    public function performance(Driver $driver)
    {
        $summary = $this->driverService->getPerformanceSummary($driver);
        return $this->success($summary, 'Driver performance retrieved');
    }
}
