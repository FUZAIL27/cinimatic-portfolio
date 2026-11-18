Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\FUZAIL AHMED\.gemini\antigravity\brain\d5dab180-27ea-4d29-b606-e0995f72e72b\fuzail_robot_welcoming_1794725819600.jpg"
$dstPath = "e:\series\newport\src\assets\images\fuzail-robot-welcome.png"
$publicDstPath = "e:\series\newport\public\images\fuzail-robot-welcome.png"

$srcImg = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $srcImg.Width
$height = $srcImg.Height

$dstBmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$srcData = $srcImg.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$dstData = $dstBmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$srcScan = $srcData.Scan0
$dstScan = $dstData.Scan0

$srcStride = [Math]::Abs($srcData.Stride)
$dstStride = [Math]::Abs($dstData.Stride)

$srcBytes = New-Object byte[] ($srcStride * $height)
$dstBytes = New-Object byte[] ($dstStride * $height)

[System.Runtime.InteropServices.Marshal]::Copy($srcScan, $srcBytes, 0, $srcBytes.Length)

for ($y = 0; $y -lt $height; $y++) {
    $srcRow = $y * $srcStride
    $dstRow = $y * $dstStride
    for ($x = 0; $x -lt $width; $x++) {
        $si = $srcRow + ($x * 3)
        $di = $dstRow + ($x * 4)
        $dstBytes[$di] = $srcBytes[$si]
        $dstBytes[$di + 1] = $srcBytes[$si + 1]
        $dstBytes[$di + 2] = $srcBytes[$si + 2]
        $dstBytes[$di + 3] = 255
    }
}

$visited = New-Object "bool[]" ($width * $height)
$queue = New-Object System.Collections.Generic.Queue[int]

# Enqueue top row (y = 0)
for ($x = 0; $x -lt $width; $x++) {
    $queue.Enqueue($x)
    $visited[$x] = $true
}

# Enqueue left and right borders down to 75% height
$maxY = [int]($height * 0.75)
for ($y = 1; $y -lt $maxY; $y++) {
    $lIdx = $y * $width
    $queue.Enqueue($lIdx)
    $visited[$lIdx] = $true

    $rIdx = $y * $width + ($width - 1)
    $queue.Enqueue($rIdx)
    $visited[$rIdx] = $true
}

# Also seed interior arm gap pockets
$seedPoints = @(
    @{x = 300; y = 460},
    @{x = 280; y = 450},
    @{x = 320; y = 480},
    @{x = 260; y = 580},
    @{x = 720; y = 620}
)

foreach ($pt in $seedPoints) {
    if ($pt.x -ge 0 -and $pt.x -lt $width -and $pt.y -ge 0 -and $pt.y -lt $height) {
        $sIdx = ($pt.y * $srcStride) + ($pt.x * 3)
        $sb = $srcBytes[$sIdx]
        $sg = $srcBytes[$sIdx + 1]
        $sr = $srcBytes[$sIdx + 2]
        $sMax = [Math]::Max($sr, [Math]::Max($sg, $sb))
        if ($sMax -lt 25) {
            $pIdx = $pt.y * $width + $pt.x
            if (-not $visited[$pIdx]) {
                $visited[$pIdx] = $true
                $queue.Enqueue($pIdx)
            }
        }
    }
}

$threshold = 20

while ($queue.Count -gt 0) {
    $idx = $queue.Dequeue()
    $px = $idx % $width
    $py = [Math]::Floor($idx / $width)

    $si = ($py * $srcStride) + ($px * 3)
    $b = $srcBytes[$si]
    $g = $srcBytes[$si + 1]
    $r = $srcBytes[$si + 2]
    $maxVal = [Math]::Max($r, [Math]::Max($g, $b))

    if ($maxVal -lt $threshold) {
        $di = ($py * $dstStride) + ($px * 4)
        $dstBytes[$di + 3] = 0

        # Check 4 neighbors
        if ($py -gt 0) {
            $nIdx = ($py - 1) * $width + $px
            if (-not $visited[$nIdx]) {
                $visited[$nIdx] = $true
                $queue.Enqueue($nIdx)
            }
        }
        if ($py -lt $maxY) {
            $nIdx = ($py + 1) * $width + $px
            if (-not $visited[$nIdx]) {
                $visited[$nIdx] = $true
                $queue.Enqueue($nIdx)
            }
        }
        if ($px -gt 0) {
            $nIdx = $py * $width + ($px - 1)
            if (-not $visited[$nIdx]) {
                $visited[$nIdx] = $true
                $queue.Enqueue($nIdx)
            }
        }
        if ($px -lt ($width - 1)) {
            $nIdx = $py * $width + ($px + 1)
            if (-not $visited[$nIdx]) {
                $visited[$nIdx] = $true
                $queue.Enqueue($nIdx)
            }
        }
    } elseif ($maxVal -lt 40) {
        $di = ($py * $dstStride) + ($px * 4)
        $fade = [byte](($maxVal - $threshold) * (255 / (40 - $threshold)))
        $dstBytes[$di + 3] = $fade
    }
}

# Soft bottom fade out between 70% and 92% height
$fadeStartY = [int]($height * 0.70)
$fadeEndY = [int]($height * 0.92)
for ($y = $fadeStartY; $y -lt $height; $y++) {
    $dstRow = $y * $dstStride
    $factor = 1.0 - ([Math]::Min(1.0, ($y - $fadeStartY) / ($fadeEndY - $fadeStartY)))
    for ($x = 0; $x -lt $width; $x++) {
        $di = $dstRow + ($x * 4)
        $curAlpha = $dstBytes[$di + 3]
        $dstBytes[$di + 3] = [byte]($curAlpha * $factor)
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($dstBytes, 0, $dstScan, $dstBytes.Length)

$srcImg.UnlockBits($srcData)
$dstBmp.UnlockBits($dstData)
$srcImg.Dispose()

$dstBmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
$dstBmp.Save($publicDstPath, [System.Drawing.Imaging.ImageFormat]::Png)
$dstBmp.Dispose()

Write-Host "Perfect transparent welcoming robot PNG generated successfully!"
