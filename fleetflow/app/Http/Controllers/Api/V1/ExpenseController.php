<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ExpenseLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExpenseController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = ExpenseLog::with(['vehicle', 'trip']);

        if ($request->category)
            $query->where('category', $request->category);
        if ($request->vehicle_id)
            $query->where('vehicle_id', $request->vehicle_id);
        if ($request->date_from)
            $query->where('expense_date', '>=', $request->date_from);
        if ($request->date_to)
            $query->where('expense_date', '<=', $request->date_to);
        if ($request->search)
            $query->where('description', 'like', "%{$request->search}%");

        $sortBy = $request->get('sort_by', 'expense_date');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        return $this->paginated($query->paginate($request->get('per_page', 15)), 'Expenses retrieved');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category' => 'required|in:fuel,maintenance,insurance,toll,parking,fine,salary,other',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'trip_id' => 'nullable|exists:trips,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string|max:255',
            'receipt_path' => 'nullable|string',
            'expense_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $expense = ExpenseLog::create($validator->validated());
        return $this->success($expense, 'Expense recorded', 201);
    }

    public function show(ExpenseLog $expense)
    {
        $expense->load(['vehicle', 'trip']);
        return $this->success($expense, 'Expense retrieved');
    }

    public function update(Request $request, ExpenseLog $expense)
    {
        $validator = Validator::make($request->all(), [
            'category' => 'sometimes|in:fuel,maintenance,insurance,toll,parking,fine,salary,other',
            'amount' => 'sometimes|numeric|min:0',
            'description' => 'sometimes|string|max:255',
            'receipt_path' => 'nullable|string',
            'expense_date' => 'sometimes|date',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $expense->update($validator->validated());
        return $this->success($expense->fresh(), 'Expense updated');
    }

    public function destroy(ExpenseLog $expense)
    {
        $expense->delete();
        return $this->success(null, 'Expense deleted');
    }
}
