Add-Type -AssemblyName System.Drawing

for ($i = 1; $i -le 5; $i++) {
    $bmp = [System.Drawing.Bitmap]::FromFile("E:\series\newport\src\assets\images\fuzail-style-$i.jpg")
    Write-Host "--- Style $i ---"
    Write-Host "Width: $($bmp.Width), Height: $($bmp.Height)"
    
    # Sample brightness down the center column to find head/hair/face
    $centerX = [Math]::Floor($bmp.Width / 2)
    # Check top 250 pixels
    for ($y = 10; $y -lt 250; $y += 20) {
        $c = $bmp.GetPixel($centerX, $y)
        # Write-Host "y=$y : R=$($c.R) G=$($c.G) B=$($c.B)"
    }
    $bmp.Dispose()
}

