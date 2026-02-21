<?php
// FleetFlow API Integration Test
echo str_repeat('=', 60) . "\n";
echo "  FLEETFLOW API TEST SUITE\n";
echo str_repeat('=', 60) . "\n\n";

$base = 'http://127.0.0.1:8000/api/v1';
$passed = 0;
$failed = 0;

function api($method, $url, $body = null, $token = null)
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $headers = ['Content-Type: application/json', 'Accept: application/json'];
    if ($token)
        $headers[] = "Authorization: Bearer $token";
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($body)
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    elseif ($method === 'PATCH') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        if ($body)
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $httpCode, 'body' => json_decode($response, true)];
}

function check($name, $r, $expectCode, &$p, &$f)
{
    $success = isset($r['body']['success']) ? $r['body']['success'] : false;
    $ok = ($r['code'] === $expectCode) && $success;
    echo($ok ? "[PASS]" : "[FAIL]") . " $name (HTTP {$r['code']})\n";
    $ok ? $p++ : $f++;
    if (!$ok && isset($r['body']['message']))
        echo "       Error: {$r['body']['message']}\n";
    return $r;
}

function checkFail($name, $r, $expectCode, &$p, &$f)
{
    $ok = $r['code'] === $expectCode;
    echo($ok ? "[PASS]" : "[FAIL]") . " $name (HTTP {$r['code']})\n";
    $ok ? $p++ : $f++;
}

// ─── 1. AUTH ────────────────────────────────────────
echo "--- AUTH MODULE ---\n";

$r = check('Login (Fleet Manager)', api('POST', "$base/auth/login", ['email' => 'manager@fleetflow.com', 'password' => 'password123']), 200, $passed, $failed);
$token = $r['body']['data']['access_token'] ?? '';
echo "       Token: " . substr($token, 0, 40) . "...\n";
echo "       User: {$r['body']['data']['user']['name']} ({$r['body']['data']['user']['role']})\n";

checkFail('Login wrong password rejected', api('POST', "$base/auth/login", ['email' => 'manager@fleetflow.com', 'password' => 'wrong']), 401, $passed, $failed);

checkFail('Unauthenticated access rejected', api('GET', "$base/vehicles"), 401, $passed, $failed);

$r = check('Get Profile (/auth/me)', api('GET', "$base/auth/me", null, $token), 200, $passed, $failed);
if (isset($r['body']['data'])) {
    $perms = $r['body']['data']['permissions'] ?? [];
    echo "       Role: {$r['body']['data']['role']} | Permissions: " . count($perms) . "\n";
}
echo "\n";

// ─── 2. DASHBOARD ──────────────────────────────────
echo "--- DASHBOARD ---\n";
$r = check('Dashboard KPIs', api('GET', "$base/dashboard/kpis", null, $token), 200, $passed, $failed);
if (isset($r['body']['data'])) {
    $k = $r['body']['data'];
    echo "       Fleet: {$k['fleet_size']} | Available: {$k['available_vehicles']} | Drivers: {$k['total_drivers']} | Active Trips: {$k['active_trips']}\n";
}
echo "\n";

// ─── 3. VEHICLES ───────────────────────────────────
echo "--- VEHICLES ---\n";
$r = check('List Vehicles', api('GET', "$base/vehicles", null, $token), 200, $passed, $failed);
if (isset($r['body']['meta']))
    echo "       Total: {$r['body']['meta']['total']} vehicles\n";
if (isset($r['body']['data'])) {
    foreach ($r['body']['data'] as $v) {
        echo "       [{$v['license_plate']}] {$v['make']} {$v['model']} - {$v['status']}\n";
    }
}

check('Get Vehicle #1', api('GET', "$base/vehicles/1", null, $token), 200, $passed, $failed);

$r = check('Vehicle ROI', api('GET', "$base/vehicles/1/roi", null, $token), 200, $passed, $failed);
if (isset($r['body']['data'])) {
    $roi = $r['body']['data'];
    echo "       Revenue: \${$roi['total_revenue']} | Cost: \${$roi['total_cost']} | ROI: {$roi['roi_percentage']}%\n";
}
echo "\n";

// ─── 4. DRIVERS ────────────────────────────────────
echo "--- DRIVERS ---\n";
$r = check('List Drivers', api('GET', "$base/drivers", null, $token), 200, $passed, $failed);
if (isset($r['body']['meta']))
    echo "       Total: {$r['body']['meta']['total']} drivers\n";

$r = check('Driver Performance', api('GET', "$base/drivers/1/performance", null, $token), 200, $passed, $failed);
if (isset($r['body']['data'])) {
    $p2 = $r['body']['data'];
    echo "       Trips: {$p2['total_trips']} | Distance: {$p2['total_distance_km']}km | Safety: {$p2['safety_score']}\n";
}
echo "\n";

// ─── 5. TRIPS ──────────────────────────────────────
echo "--- TRIPS ---\n";
$r = check('List Trips', api('GET', "$base/trips", null, $token), 200, $passed, $failed);
if (isset($r['body']['meta']))
    echo "       Total: {$r['body']['meta']['total']} trips\n";

$r = check('Trip Cost Breakdown', api('GET', "$base/trips/1/cost-breakdown", null, $token), 200, $passed, $failed);
if (isset($r['body']['data'])) {
    $cb = $r['body']['data'];
    echo "       Fuel: \${$cb['fuel_cost']} | Revenue: \${$cb['revenue']} | Profit: \${$cb['profit']}\n";
}
echo "\n";

// ─── 6. MAINTENANCE ────────────────────────────────
echo "--- MAINTENANCE ---\n";
$r = check('List Maintenance', api('GET', "$base/maintenance", null, $token), 200, $passed, $failed);
if (isset($r['body']['meta']))
    echo "       Total: {$r['body']['meta']['total']} records\n";
echo "\n";

// ─── 7. FUEL LOGS ──────────────────────────────────
echo "--- FUEL LOGS ---\n";
$r = check('List Fuel Logs', api('GET', "$base/fuel-logs", null, $token), 200, $passed, $failed);
if (isset($r['body']['meta']))
    echo "       Total: {$r['body']['meta']['total']} records\n";
echo "\n";

// ─── 8. EXPENSES ───────────────────────────────────
echo "--- EXPENSES ---\n";
$r = check('List Expenses', api('GET', "$base/expenses", null, $token), 200, $passed, $failed);
if (isset($r['body']['meta']))
    echo "       Total: {$r['body']['meta']['total']} records\n";
echo "\n";

// ─── 9. COMPLIANCE ─────────────────────────────────
echo "--- COMPLIANCE ---\n";
$r = check('List Compliance', api('GET', "$base/compliance", null, $token), 200, $passed, $failed);
if (isset($r['body']['meta']))
    echo "       Total: {$r['body']['meta']['total']} records\n";
echo "\n";

// ─── 10. ANALYTICS ─────────────────────────────────
echo "--- ANALYTICS ---\n";
$r = check('Fleet Performance', api('GET', "$base/analytics/fleet-performance?period=month", null, $token), 200, $passed, $failed);
if (isset($r['body']['data'])) {
    $fp = $r['body']['data'];
    echo "       Trips: {$fp['total_trips']} | Revenue: \${$fp['total_revenue']} | Profit: \${$fp['net_profit']}\n";
}

$r = check('Financial Report', api('GET', "$base/analytics/financial-report?period=month", null, $token), 200, $passed, $failed);
if (isset($r['body']['data'])) {
    echo "       Profit Margin: {$r['body']['data']['profit_margin']}%\n";
}

$r = check('Driver Rankings', api('GET', "$base/analytics/driver-rankings", null, $token), 200, $passed, $failed);
if (isset($r['body']['data']))
    echo "       Ranked: " . count($r['body']['data']) . " drivers\n";
echo "\n";

// ─── 11. MULTI-ROLE TEST ───────────────────────────
echo "--- ROLE-BASED ACCESS ---\n";
$r = check('Login (Dispatcher)', api('POST', "$base/auth/login", ['email' => 'dispatcher@fleetflow.com', 'password' => 'password123']), 200, $passed, $failed);
$dt = $r['body']['data']['access_token'] ?? '';
$r = check('Dispatcher Profile', api('GET', "$base/auth/me", null, $dt), 200, $passed, $failed);
if (isset($r['body']['data'])) {
    $dp = $r['body']['data']['permissions'] ?? [];
    echo "       Role: {$r['body']['data']['role']} | Permissions: " . count($dp) . "\n";
}

$r = check('Login (Analyst)', api('POST', "$base/auth/login", ['email' => 'analyst@fleetflow.com', 'password' => 'password123']), 200, $passed, $failed);
echo "\n";

// ─── SUMMARY ───────────────────────────────────────
$total = $passed + $failed;
echo str_repeat('=', 60) . "\n";
echo "  RESULTS: $passed PASSED / $failed FAILED / $total TOTAL\n";
echo str_repeat('=', 60) . "\n";
