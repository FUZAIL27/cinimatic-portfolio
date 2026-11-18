Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voices = $synth.GetInstalledVoices()
Write-Host "Installed voices count: $($voices.Count)"
foreach ($v in $voices) {
    Write-Host "Voice: $($v.VoiceInfo.Name) | Gender: $($v.VoiceInfo.Gender) | Culture: $($v.VoiceInfo.Culture.Name)"
}

