Add-Type -AssemblyName System.Drawing

$sourcePath = "E:\series\newport\src\assets\images\fuzail-about.jpg"
$outputDir = "E:\series\newport\src\assets\images"

$bmp = [System.Drawing.Bitmap]::FromFile($sourcePath)
$totalW = $bmp.Width
$totalH = $bmp.Height

Write-Host "Source Image size: $totalW x $totalH"

# We have 5 portrait columns. Let's find exact or equal 5 slices.
$colW = [Math]::Floor($totalW / 5)

for ($i = 0; $i -lt 5; $i++) {
    $x = $i * $colW
    $w = if ($i -eq 4) { $totalW - $x } else { $colW }
    $rect = New-Object System.Drawing.Rectangle($x, 0, $w, $totalH)
    $cropped = $bmp.Clone($rect, $bmp.PixelFormat)
    $destPath = Join-Path $outputDir "fuzail-style-$($i + 1).jpg"
    $cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $cropped.Dispose()
    Write-Host "Saved: $destPath ($w x $totalH)"
}

$bmp.Dispose()
Write-Host "All 5 portraits cropped successfully!"

