Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
foreach ($v in $synth.GetInstalledVoices()) {
    Write-Host "Voice: " $v.VoiceInfo.Name ", Gender: " $v.VoiceInfo.Gender
}

