# Code Analysis Script
Write-Host "Starting Code Analysis..." -ForegroundColor Green

# Check for TypeScript errors
Write-Host "`nChecking TypeScript errors..." -ForegroundColor Yellow
npx tsc --noEmit

# Check for ESLint issues
Write-Host "`nRunning ESLint analysis..." -ForegroundColor Yellow
npx eslint . --ext .ts,.tsx --max-warnings=0

# Check for security vulnerabilities
Write-Host "`nChecking for security vulnerabilities..." -ForegroundColor Yellow
npm audit

# Check for outdated dependencies
Write-Host "`nChecking for outdated dependencies..." -ForegroundColor Yellow
npm outdated

# Run tests
Write-Host "`nRunning tests..." -ForegroundColor Yellow
npm test

# Check for build errors
Write-Host "`nChecking for build errors..." -ForegroundColor Yellow
npm run build

# Check for unused dependencies
Write-Host "`nChecking for unused dependencies..." -ForegroundColor Yellow
npx depcheck

# Check for duplicate dependencies
Write-Host "`nChecking for duplicate dependencies..." -ForegroundColor Yellow
npx npm-check-duplicates

# Check for performance issues
Write-Host "`nChecking for performance issues..." -ForegroundColor Yellow
npx next build --profile

Write-Host "`nAnalysis complete! Review the output above for issues." -ForegroundColor Green 