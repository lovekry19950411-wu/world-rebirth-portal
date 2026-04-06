# Copy slide images to assets\deck. Searches Desktop and Desktop\PPT寶石.
# Run: powershell -ExecutionPolicy Bypass -File .\copy-ppt-images.ps1
# Optional: -Source "C:\Users\YOU\Desktop"

param([string] $Source = "")

$Dest = Join-Path $PSScriptRoot "assets\deck"
$roots = [System.Collections.Generic.List[string]]::new()
if (-not [string]::IsNullOrWhiteSpace($Source)) {
    [void]$roots.Add($Source.TrimEnd('\'))
}

$pathsToTry = @(
    (Join-Path $env:USERPROFILE "Desktop\PPT寶石"),
    (Join-Path $env:USERPROFILE "Desktop"),
    (Join-Path $env:USERPROFILE "OneDrive\Desktop\PPT寶石"),
    (Join-Path $env:USERPROFILE "OneDrive\Desktop"),
    "D:\PPT寶石"
)

foreach ($p in $pathsToTry) {
    if ([string]::IsNullOrWhiteSpace($p)) { continue }
    if (Test-Path -LiteralPath $p) {
        $x = (Resolve-Path -LiteralPath $p).Path
        if (-not $roots.Contains($x)) {
            [void]$roots.Add($x)
        }
    }
}

if ($roots.Count -eq 0) {
    Write-Host "ERROR: No folder found (Desktop or PPT寶石)." -ForegroundColor Red
    exit 1
}

Write-Host "Search order:" -ForegroundColor Cyan
$roots | ForEach-Object { Write-Host "  $_" }

New-Item -ItemType Directory -Force -Path $Dest | Out-Null

function Find-Copy {
    param(
        [string[]] $PossibleNames,
        [string] $ToName
    )
    foreach ($root in $roots) {
        foreach ($name in $PossibleNames) {
            $variants = @(
                $name,
                ($name -replace '\.jpg$', '.JPG'),
                ($name -replace '\.png$', '.PNG')
            )
            foreach ($n in $variants) {
                $full = Join-Path $root $n
                if (Test-Path -LiteralPath $full) {
                    $out = Join-Path $Dest $ToName
                    Copy-Item -LiteralPath $full -Destination $out -Force
                    Write-Host "OK  $n -> $ToName" -ForegroundColor Green
                    return
                }
            }
        }
    }
    $first = $PossibleNames[0]
    Write-Host "SKIP (not found): $first" -ForegroundColor DarkYellow
}

Find-Copy @("3011023.jpg", "35090.jpg") "cover.jpg"
Find-Copy @("3011023.jpg", "35090.jpg") "gem.jpg"
Find-Copy @("3011027.jpg") "mine.jpg"
Find-Copy @("3011028.jpg", "3011029.jpg") "mine2.jpg"
Find-Copy @("35092_0.jpg", "35093_0.jpg", "35098_0.jpg", "35099_0.jpg") "ring.jpg"
Find-Copy @("3011026.jpg") "finance.jpg"

$csrPng = $null
foreach ($root in $roots) {
    $csrPng = Get-ChildItem -LiteralPath $root -File -Filter "*.png" -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match '^\{' } |
        Sort-Object Name |
        Select-Object -First 1
    if ($csrPng) { break }
    $csrPng = Get-ChildItem -LiteralPath $root -File -Filter "*.png" -ErrorAction SilentlyContinue |
        Sort-Object Name |
        Select-Object -First 1
    if ($csrPng) { break }
}

if ($csrPng) {
    $csrOut = Join-Path $Dest "csr.png"
    Copy-Item -LiteralPath $csrPng.FullName -Destination $csrOut -Force
    Write-Host "OK  csr.png" -ForegroundColor Green
}

Write-Host ""
Write-Host "Done. Images in: $Dest" -ForegroundColor Green
Write-Host "Next: py -3.13 scripts\build_haris_pptx.py" -ForegroundColor Green
