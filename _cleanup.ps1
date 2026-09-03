$filePath = Join-Path $PSScriptRoot "App.jsx"
$lines = [System.IO.File]::ReadAllLines($filePath)
$keep = New-Object System.Collections.ArrayList

$replacement = @(
    "      {/* --- ASIGNATURA DETALLE (NOTEBOOK VIEW) --- */}"
    "      {view === 'subjectDetail' && selectedSubject && ("
    "        <>"
    "          <NotebookView"
    "            selectedSubject={selectedSubject}"
    "            setView={setView}"
    "            activeTheme={activeTheme}"
    "            showToast={showToast}"
    "            allSubjects={filteredSubjects.length > 0 ? filteredSubjects : allSubjects}"
    "            setSelectedSubject={setSelectedSubject}"
    "          />"
    "          <Navbar view={view} setView={setView} activeTheme={activeTheme} t={t} />"
    "        </>"
    "      )}"
)

for ($i = 0; $i -lt $lines.Count; $i++) {
    # Lines 3222-3315 are 0-indexed 3221-3314
    if ($i -eq 3221) {
        # Insert replacement lines at this position
        foreach ($rLine in $replacement) {
            [void]$keep.Add($rLine)
        }
    }
    if ($i -ge 3221 -and $i -le 3314) {
        continue
    }
    [void]$keep.Add($lines[$i])
}

[System.IO.File]::WriteAllLines($filePath, $keep.ToArray())
Write-Host "Replaced subjectDetail view block (lines 3222-3315). New line count: $($keep.Count)"
