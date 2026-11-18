Add-Type -AssemblyName System.Drawing

for ($i = 1; $i -le 5; $i++) {
    $path = "E:\series\newport\src\assets\images\fuzail-style-$i.jpg"
    $bmp = [System.Drawing.Bitmap]::FromFile($path)
    $midX = [int]($bmp.Width / 2)
    Write-Host "Style $i : W=$($bmp.Width) H=$($bmp.Height) midX=$midX"
    for ($step = 0; $step -le 12; $step++) {
        $y = $step * 25
        $c = $bmp.GetPixel($midX, $y)
        Write-Host "   Y=$y R=$($c.R) G=$($c.G) B=$($c.B)"
    }
    $bmp.Dispose()
}

