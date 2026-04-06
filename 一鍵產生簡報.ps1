# 一鍵：複製「桌面\PPT寶石」→ 產生 haris-deck.pptx
# 在檔案總管對本檔「右鍵 → 使用 PowerShell 執行」，或在 PowerShell 執行：
#   cd d:\world-official\my-app
#   powershell -ExecutionPolicy Bypass -File .\一鍵產生簡報.ps1

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
Set-Location $root

# 若自動找不到，改成你的路徑（範例，注意單引號包住整段）：
# $pptFolder = 'C:\Users\SEIN PING\Desktop\PPT寶石'
$pptFolder = Join-Path $env:USERPROFILE "Desktop\PPT寶石"
if (-not (Test-Path -LiteralPath $pptFolder)) {
    $pptFolder = Join-Path $env:USERPROFILE "OneDrive\Desktop\PPT寶石"
}

Write-Host "=== 1/2 複製圖片 ===" -ForegroundColor Cyan
if (Test-Path -LiteralPath $pptFolder) {
    & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $root "copy-ppt-images.ps1") -Source $pptFolder
} else {
    & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $root "copy-ppt-images.ps1")
}
if ($LASTEXITCODE -ne 0) {
    Write-Host "複製失敗。請用記事本打開本檔，設定 `$pptFolder 為你的 PPT寶石 完整路徑。" -ForegroundColor Red
    Read-Host "按 Enter 結束"
    exit $LASTEXITCODE
}

Write-Host "=== 2/2 產生簡報 ===" -ForegroundColor Cyan
$script = Join-Path $root "scripts\build_haris_pptx.py"
$built = $false
& py -3.13 $script
if ($LASTEXITCODE -eq 0) { $built = $true }
if (-not $built) {
    & py -3 $script
    if ($LASTEXITCODE -eq 0) { $built = $true }
}
if (-not $built) {
    Write-Host "請手動執行： py -3.13 scripts\build_haris_pptx.py" -ForegroundColor Yellow
}

$out = Join-Path $root "haris-deck.pptx"
if (Test-Path -LiteralPath $out) {
    Write-Host "完成：$out" -ForegroundColor Green
    explorer.exe "/select,`"$out`""
} else {
    Write-Host "未找到輸出檔，請檢查是否已安裝 Python 與 python-pptx。" -ForegroundColor Yellow
}
Read-Host "按 Enter 關閉"
