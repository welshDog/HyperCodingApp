# Simple script to start Firebase emulators with Docker

# Check if Docker is running
$dockerCheck = docker info 2>&1
if (-not $?) {
    Write-Host "Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

# Create directory for emulator data if it doesn't exist
$emulatorDataPath = "./emulator-data"
if (-not (Test-Path $emulatorDataPath)) {
    New-Item -ItemType Directory -Path $emulatorDataPath -Force | Out-Null
    Write-Host "Created emulator data directory at $emulatorDataPath" -ForegroundColor Green
}

Write-Host "Starting Firebase Emulators with Docker..." -ForegroundColor Cyan

# Start the containers
docker-compose up -d

# Wait for emulators to start
Start-Sleep -Seconds 5

# Check if containers are running
$containers = docker ps --filter "name=firebase-emulators" --format "{{.Status}}"

if ($containers -match "Up") {
    Write-Host ""
    Write-Host "SUCCESS: Firebase Emulators are running!" -ForegroundColor Green
    Write-Host "Emulator UI: http://localhost:4000"
    Write-Host ""
    Write-Host "Available Emulators:" -ForegroundColor Yellow
    Write-Host "- Firestore: localhost:5001"
    Write-Host "- Authentication: localhost:9099"
    Write-Host "- Hosting: localhost:5000"
    Write-Host "- Emulator UI: http://localhost:4000"
    Write-Host ""
    Write-Host "To stop the emulators, run: npm run emulators:down" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "ERROR: Failed to start emulators. Check Docker logs for details." -ForegroundColor Red
    Write-Host "Try running 'docker-compose logs' to see the error messages."
    exit 1
}
