# Check if Docker is running
try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Docker is not installed. Please install Docker Desktop from https://www.docker.com/products/docker-desktop" -ForegroundColor Red
    exit 1
}

# Create directory for emulator data if it doesn't exist
$emulatorDataPath = "./emulator-data"
if (-not (Test-Path $emulatorDataPath)) {
    New-Item -ItemType Directory -Path $emulatorDataPath | Out-Null
    Write-Host "Created emulator data directory at $emulatorDataPath" -ForegroundColor Green
}

# Start the emulators using Docker Compose
Write-Host "Starting Firebase Emulators with Docker..." -ForegroundColor Cyan

try {
    # Run docker-compose up in detached mode
    docker-compose up -d
    
    # Wait for emulators to start
    Start-Sleep -Seconds 5
    
    # Check if containers are running
    $containers = docker ps --filter "name=firebase-emulators" --format "{{.Status}}"
    
    if ($containers -match "Up") {
        Write-Host "✅ Firebase Emulators are running successfully!" -ForegroundColor Green
        Write-Host "🔗 Emulator UI: http://localhost:4000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Available Emulators:" -ForegroundColor Yellow
        Write-Host "- Firestore: localhost:5001"
        Write-Host "- Authentication: localhost:9099"
        Write-Host "- Hosting: localhost:5000"
        Write-Host "- Emulator UI: http://localhost:4000"
        Write-Host ""
        Write-Host "To stop the emulators, run: docker-compose down" -ForegroundColor Yellow
    } else {
        Write-Host "Failed to start emulators. Check Docker logs for details." -ForegroundColor Red
    }
} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
}
