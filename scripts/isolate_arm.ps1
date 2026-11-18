Add-Type -AssemblyName System.Drawing

$srcPath = "e:\series\newport\src\assets\images\fuzail-robot-welcome.png"
$dstPath = "e:\series\newport\src\assets\images\fuzail-robot-raised-arm.png"
$publicDstPath = "e:\series\newport\public\images\fuzail-robot-raised-arm.png"

$srcImg = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $srcImg.Width
$height = $srcImg.Height

$dstBmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $p = $srcImg.GetPixel($x, $y)
        
        # Raised arm and hand region:
        # Fingers & Palm: Y: 140..420, X: 60..310 (excludes helmet antenna at X > 320)
        # Forearm & Elbow & Shoulder: Y: 420..820, X: 60..380
        $isArm = $false
        if ($y -ge 120 -and $y -lt 300 -and $x -le 310) {
            $isArm = $true
        } elseif ($y -ge 300 -and $y -le 850 -and $x -le 380) {
            $isArm = $true
        }

        if ($isArm) {
            $alpha = $p.A
            # Soft feather near chest seam (X: 320..380, Y: 350..550)
            if ($x -gt 310 -and $y -gt 340) {
                $feather = 1.0 - ([Math]::Min(1.0, ($x - 310) / 70.0))
                $alpha = [byte]($alpha * $feather)
            }
            $dstBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
        } else {
            $dstBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$srcImg.Dispose()

$dstBmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
$dstBmp.Save($publicDstPath, [System.Drawing.Imaging.ImageFormat]::Png)
$dstBmp.Dispose()

Write-Host "Clean raised arm PNG generated successfully!"
