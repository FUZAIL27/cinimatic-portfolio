Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
foreach ($v in $synth.GetInstalledVoices()) {
    $info = $v.VoiceInfo
    Write-Host "$($info.Name) | $($info.Gender) | $($info.Culture.Name)"
}

