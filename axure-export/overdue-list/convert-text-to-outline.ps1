Add-Type -AssemblyName System.Drawing

$inputPath = 'axure-export/overdue-list/overdue-list-axure-editable-v2.svg'
$outputPath = 'axure-export/overdue-list/overdue-list-axure-editable-v3-text-outline.svg'
[xml]$doc = Get-Content -Raw -Path $inputPath -Encoding UTF8
$ns = New-Object System.Xml.XmlNamespaceManager($doc.NameTable)
$ns.AddNamespace('svg', 'http://www.w3.org/2000/svg')
$fontFamily = New-Object System.Drawing.FontFamily('Microsoft YaHei')

function Get-Attr($node, $name, $fallback = $null) {
  if ($node.HasAttribute($name)) { return $node.GetAttribute($name) }
  return $fallback
}

function To-Float($value, $fallback = 0) {
  if ($null -eq $value -or $value -eq '') { return [float]$fallback }
  return [float]::Parse(($value -replace 'px',''), [Globalization.CultureInfo]::InvariantCulture)
}

function PathDataToSvg($pathData) {
  $pts = $pathData.Points
  $types = $pathData.Types
  $parts = New-Object System.Collections.Generic.List[string]
  $i = 0
  while ($i -lt $pts.Length) {
    $kind = $types[$i] -band 0x07
    $closed = ($types[$i] -band 0x80) -ne 0
    $x = [Math]::Round($pts[$i].X, 2).ToString([Globalization.CultureInfo]::InvariantCulture)
    $y = [Math]::Round($pts[$i].Y, 2).ToString([Globalization.CultureInfo]::InvariantCulture)
    if ($kind -eq 0) {
      $parts.Add("M$x $y")
      if ($closed) { $parts.Add('Z') }
      $i++
    } elseif ($kind -eq 1) {
      $parts.Add("L$x $y")
      if ($closed) { $parts.Add('Z') }
      $i++
    } elseif ($kind -eq 3 -and $i + 2 -lt $pts.Length) {
      $x1 = [Math]::Round($pts[$i].X, 2).ToString([Globalization.CultureInfo]::InvariantCulture)
      $y1 = [Math]::Round($pts[$i].Y, 2).ToString([Globalization.CultureInfo]::InvariantCulture)
      $x2 = [Math]::Round($pts[$i+1].X, 2).ToString([Globalization.CultureInfo]::InvariantCulture)
      $y2 = [Math]::Round($pts[$i+1].Y, 2).ToString([Globalization.CultureInfo]::InvariantCulture)
      $x3 = [Math]::Round($pts[$i+2].X, 2).ToString([Globalization.CultureInfo]::InvariantCulture)
      $y3 = [Math]::Round($pts[$i+2].Y, 2).ToString([Globalization.CultureInfo]::InvariantCulture)
      $parts.Add("C$x1 $y1 $x2 $y2 $x3 $y3")
      $closed3 = ($types[$i+2] -band 0x80) -ne 0
      if ($closed3) { $parts.Add('Z') }
      $i += 3
    } else {
      $i++
    }
  }
  return [string]::Join(' ', $parts)
}

$textNodes = @($doc.SelectNodes('//svg:text', $ns))
foreach ($textNode in $textNodes) {
  $text = $textNode.InnerText
  if ([string]::IsNullOrWhiteSpace($text)) { continue }
  $x = To-Float (Get-Attr $textNode 'x' '0')
  $y = To-Float (Get-Attr $textNode 'y' '0')
  $fontSize = To-Float (Get-Attr $textNode 'font-size' '12')
  $fill = Get-Attr $textNode 'fill' '#20242b'
  $anchor = Get-Attr $textNode 'text-anchor' 'start'
  $weight = Get-Attr $textNode 'font-weight' '400'
  $style = [System.Drawing.FontStyle]::Regular
  if ($weight -match 'bold|800|900|700') { $style = [System.Drawing.FontStyle]::Bold }

  $probe = New-Object System.Drawing.Drawing2D.GraphicsPath
  $probe.AddString($text, $fontFamily, [int]$style, $fontSize, [System.Drawing.PointF]::new(0,0), [System.Drawing.StringFormat]::GenericTypographic)
  $bounds = $probe.GetBounds()
  $left = $x
  if ($anchor -eq 'middle') { $left = $x - ($bounds.Width / 2) }
  elseif ($anchor -eq 'end') { $left = $x - $bounds.Width }
  $top = $y - ($fontSize * 0.88)

  $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
  $gp.AddString($text, $fontFamily, [int]$style, $fontSize, [System.Drawing.PointF]::new($left, $top), [System.Drawing.StringFormat]::GenericTypographic)
  $d = PathDataToSvg $gp.PathData

  $pathNode = $doc.CreateElement('path', 'http://www.w3.org/2000/svg')
  $pathNode.SetAttribute('d', $d)
  $pathNode.SetAttribute('fill', $fill)
  $textNode.ParentNode.ReplaceChild($pathNode, $textNode) | Out-Null
}

$settings = New-Object System.Xml.XmlWriterSettings
$settings.Indent = $true
$settings.Encoding = New-Object System.Text.UTF8Encoding($false)
$fullOutputPath = Join-Path (Get-Location) $outputPath
$doc.Save($fullOutputPath)
Write-Output "converted $($textNodes.Count) text nodes to outlines: $outputPath"

