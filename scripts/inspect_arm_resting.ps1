Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile("e:\series\newport\src\assets\images\fuzail-robot-transparent.png")
$width = $img.Width
$height = $img.Height

$minX = 9999
$maxX = 0
$minY = 9999
$maxY = 0

for ($y = [int]($height * 0.25); $y -lt [int]($height * 0.8); $y += 4) {
    for ($x = 0; $x -lt [int]($width * 0.4); $x += 4) {
        $p = $img.GetPixel($x, $y)
        if ($p.A -gt 30) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Resting arm bounding box: X: $minX to $maxX, Y: $minY to $maxY"
$img.Dispose()

