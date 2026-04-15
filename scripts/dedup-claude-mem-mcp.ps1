# Dedup claude-mem MCP server processes.
# Keeps oldest (most likely the one CC is actually talking to), kills rest.
# Invoked by: startup-services.sh AND SessionStart hook (async + delayed).

$mcps = @(Get-CimInstance Win32_Process | Where-Object {
  $_.Name -eq "node.exe" -and $_.CommandLine -like "*claude-mem*mcp-server*"
} | Sort-Object CreationDate)

if ($mcps.Count -gt 1) {
  $killed = 0
  $mcps | Select-Object -Skip 1 | ForEach-Object {
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    $killed++
  }
  Write-Output "[dedup-mcp] killed $killed duplicate claude-mem MCP server(s), kept PID $($mcps[0].ProcessId)"
} else {
  Write-Output "[dedup-mcp] no duplicates ($($mcps.Count) instance(s))"
}
