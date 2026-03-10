param(
  [string]$Root = ".",
  [string]$OutFile = "fr-accent-audit.txt"
)

$ErrorActionPreference = "Stop"

$includeExt = @("*.ts","*.tsx","*.js","*.jsx","*.hbs","*.md")
$excludePattern = "node_modules|\\.next\\|\\dist\\|\\.git\\"

# Focus on UI/content text, not identifiers.
$patterns = @(
  @{ Name = "acces"; Regex = "\bAcces\b|\bacces\b"; Suggestion = "Accès" },
  @{ Name = "reinitial"; Regex = "\bReinitial\w*\b|\breinitial\w*\b"; Suggestion = "Réinitial..." },
  @{ Name = "cree"; Regex = "\bCree\w*\b|\bcree\w*\b"; Suggestion = "Crée / créée" },
  @{ Name = "desactive"; Regex = "\bDesactive\w*\b|\bdesactive\w*\b"; Suggestion = "Désactive / désactivée" },
  @{ Name = "depasse"; Regex = "\bdepasse\b|\bDepasse\b"; Suggestion = "dépassé" },
  @{ Name = "supportees"; Regex = "\bsupportees\b|\bSupportees\b"; Suggestion = "supportées" },
  @{ Name = "trouvee"; Regex = "\btrouvee\b|\btrouvees\b|\bTrouvee\b|\bTrouvees\b"; Suggestion = "trouvée / trouvées" },
  @{ Name = "derniere"; Regex = "\bDerniere\b|\bderniere\b"; Suggestion = "Dernière" },
  @{ Name = "frequence"; Regex = "\bfrequence\b|\bFrequence\b"; Suggestion = "fréquence" },
  @{ Name = "marche"; Regex = "\bMarche\b|\bmarche\b"; Suggestion = "Marché (selon contexte)" },
  @{ Name = "requete"; Regex = "\bRequete\b|\brequete\b|\bRequetes\b|\brequetes\b"; Suggestion = "Requête(s)" },
  @{ Name = "generer_fr"; Regex = "\bGenerer\b|\bgenerer\b|\bGenerez\b|\bgenerez\b|\bgeneree\b|\bgeneree\b"; Suggestion = "Générer / Générez / générée" }
)

$mojibakeRegex = "Ã|Â|â"

$files = Get-ChildItem -Path $Root -Recurse -File -Include $includeExt |
  Where-Object { $_.FullName -notmatch $excludePattern }

$findings = New-Object System.Collections.Generic.List[object]

foreach ($file in $files) {
  $lineNo = 0
  Get-Content -LiteralPath $file.FullName | ForEach-Object {
    $lineNo++
    $line = $_

    # Scan only quoted string literals to reduce false positives.
    $quotedMatches = [regex]::Matches($line, "'([^'\\]|\\.)*'|\"([^\"\\]|\\.)*\"")
    foreach ($m in $quotedMatches) {
      $text = $m.Value.Trim("'\"")

      if ($text -match $mojibakeRegex) {
        $findings.Add([pscustomobject]@{
          Type = "mojibake"
          Pattern = "encoding"
          Suggestion = "Corriger encodage UTF-8"
          File = $file.FullName
          Line = $lineNo
          Text = $text
        })
      }

      foreach ($p in $patterns) {
        if ($text -match $p.Regex) {
          $findings.Add([pscustomobject]@{
            Type = "accent"
            Pattern = $p.Name
            Suggestion = $p.Suggestion
            File = $file.FullName
            Line = $lineNo
            Text = $text
          })
        }
      }
    }
  }
}

$summary = @()
$summary += "Audit FR accents - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$summary += "Root: $(Resolve-Path $Root)"
$summary += "Total files scanned: $($files.Count)"
$summary += "Total suspect occurrences: $($findings.Count)"
$summary += ""

if ($findings.Count -gt 0) {
  $byType = $findings | Group-Object Type | Sort-Object Count -Descending
  $summary += "By type:"
  foreach ($g in $byType) {
    $summary += "- $($g.Name): $($g.Count)"
  }
  $summary += ""

  $byPattern = $findings | Where-Object { $_.Type -eq 'accent' } | Group-Object Pattern | Sort-Object Count -Descending
  if ($byPattern.Count -gt 0) {
    $summary += "By pattern:"
    foreach ($g in $byPattern) {
      $summary += "- $($g.Name): $($g.Count)"
    }
    $summary += ""
  }

  $summary += "Details:"
  foreach ($f in $findings | Sort-Object File, Line) {
    $summary += "[$($f.Type)/$($f.Pattern)] $($f.File):$($f.Line) | $($f.Suggestion)"
    $summary += "  -> $($f.Text)"
  }
} else {
  $summary += "No suspect occurrence found."
}

$summary -join "`r`n" | Set-Content -Path $OutFile -Encoding utf8
Write-Output "Report written: $OutFile"
Write-Output "Findings: $($findings.Count)"