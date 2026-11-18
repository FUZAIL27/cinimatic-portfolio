[Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media, ContentType = WindowsRuntime] | Out-Null

$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$raviVoice = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | Where-Object { $_.DisplayName -like "*Ravi*" -and $_.Gender -eq "Male" }

if (-not $raviVoice) {
    Write-Error "Ravi male voice not found!"
    exit 1
}

$synth.Voice = $raviVoice
Write-Host "Selected Voice: $($synth.Voice.DisplayName), Gender: $($synth.Voice.Gender), Lang: $($synth.Voice.Language)"

$asyncOp = $synth.SynthesizeTextToStreamAsync("Hello, I am Fuzail Ahmed, a Software Developer from Chennai, India.")
while ($asyncOp.Status -eq "Started") {
    Start-Sleep -Milliseconds 50
}
$stream = $asyncOp.GetResults()

$reader = New-Object Windows.Storage.Streams.DataReader($stream)
$loadOp = $reader.LoadAsync($stream.Size)
while ($loadOp.Status -eq "Started") {
    Start-Sleep -Milliseconds 50
}

$bytes = New-Object byte[] $stream.Size
$reader.ReadBytes($bytes)

$outPath = "public\audio\fuzail-voice\test_ravi.wav"
[System.IO.File]::WriteAllBytes($outPath, $bytes)

Write-Host "Saved test file to $outPath ($($bytes.Length) bytes)"
