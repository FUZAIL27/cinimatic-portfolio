Add-Type -AssemblyName System.Drawing

for ($i = 1; $i -le 5; $i++) {
    $path = "E:\series\newport\src\assets\images\fuzail-style-$i.jpg"
    $bmp = [System.Drawing.Bitmap]::FromFile($path)
    $aspect = [Math]::Round($bmp.Height / $bmp.Width, 2)
    Write-Host "Style $i -> Width: $($bmp.Width), Height: $($bmp.Height), Aspect: $aspect"
    $bmp.Dispose()
}

