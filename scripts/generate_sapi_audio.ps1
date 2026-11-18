Add-Type -AssemblyName System.Speech

$lines = @(
    "Hey there! Welcome to my portfolio.",
    "I'm Fuzail Ahmed, a Software Developer from Chennai, India.",
    "I'm a Full Stack Developer, MERN Stack Developer, and Java Full Stack Developer.",
    "I love building modern web applications, exploring new technologies, and turning creative ideas into real-world projects.",
    "Feel free to explore my work, projects, and skills.",
    "Let's build something amazing together!"
)

$fullScript = $lines -join "`n`n"

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice('Microsoft David Desktop')
$synth.Rate = 0
$synth.Volume = 100

$outDir = "E:\series\newport\public\audio\fuzail-voice"

# 1. Spiderman Intro (Full continuous)
$spideyPath = Join-Path $outDir "spiderman-intro.wav"
$synth.SetOutputToWaveFile($spideyPath)
$synth.Speak($fullScript)

# 2. Robot Intro (Full continuous)
$robotPath = Join-Path $outDir "robot-intro.wav"
$synth.SetOutputToWaveFile($robotPath)
$synth.Speak($fullScript)

# 3. Full Speech
$fullPath = Join-Path $outDir "fuzail-full-speech.wav"
$synth.SetOutputToWaveFile($fullPath)
$synth.Speak($fullScript)

# 4. Individual lines for Robot Dialogue sequence
for ($i = 0; $i -lt $lines.Length; $i++) {
    $linePath = Join-Path $outDir ("robot-" + ($i + 1) + ".wav")
    $synth.SetOutputToWaveFile($linePath)
    $synth.Speak($lines[$i])
}

$synth.Dispose()

Write-Host "Generated all WAV files successfully!"
