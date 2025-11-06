Write-Host "Stopping Firebase Emulators..." -ForegroundColor Yellow

try {
    $output = docker-compose down 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Firebase Emulators stopped successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to stop emulators:" -ForegroundColor Red
        Write-Host $output -ForegroundColor Red
    }
} catch {
    Write-Host "An error occurred while stopping the emulators: $_" -ForegroundColor Red
}

# Check if any containers are still running
$runningContainers = docker ps --filter "name=firebase-emulators" --format "{{.Names}}"
if ($runningContainers) {
    Write-Host "The following containers are still running:" -ForegroundColor Yellow
    $runningContainers | ForEach-Object { Write-Host "- $_" }
    Write-Host "You can stop them manually using: docker stop $($runningContainers -join ' ')" -ForegroundColor Yellow
}
