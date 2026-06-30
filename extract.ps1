[System.Reflection.Assembly]::LoadWithPartialName("System.IO.Compression.FileSystem") | Out-Null
$zip = [System.IO.Compression.ZipFile]::OpenRead("D:\Portofolio\CV Damar Pratama Ristadias Hariyantooo.docx")
$entry = $zip.Entries | Where-Object { $_.FullName -eq "word/document.xml" }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xmlText = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()

# Extract only <w:t> tags contents to get text correctly
$matches = [regex]::Matches($xmlText, "<w:t[^>]*>(.*?)</w:t>")
$text = ""
foreach ($match in $matches) {
    $text += $match.Groups[1].Value + " "
}

# Clean up whitespaces
$text = [regex]::Replace($text, "\s+", " ")
$text | Out-File -FilePath "D:\Portofolio\cv_text.txt" -Encoding utf8
Write-Host "Success"
