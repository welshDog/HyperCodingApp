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
    Write-Host ("An error occurred while stopping the emulators: {0}" -f $_.Exception.Message) -ForegroundColor Red
}

# Check if any containers are still running
try {
    $runningContainers = docker ps --filter "name=firebase-emulators" --format "{{.Names}}" 2>$null
    if ($runningContainers) {
        Write-Host "The following containers are still running:" -ForegroundColor Yellow
        $runningContainers | ForEach-Object { Write-Host ("- {0}" -f $_) }
        Write-Host ("You can stop them manually using: docker stop {0}" -f ($runningContainers -join ' ')) -ForegroundColor Yellow
    }
} catch {
    Write-Host ("Warning: Could not check for running containers: {0}" -f $_.Exception.Message) -ForegroundColor Yellow
}
