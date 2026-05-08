$DateStr = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupDir = "E:\backups\accrual"
$BackupFile = "$BackupDir\accrual_$DateStr.backup"

$env:PGPASSWORD="godzilla2026"
& "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" -U postgres -h localhost -p 5432 -F c -d accrual -f $BackupFile

if ($LASTEXITCODE -eq 0) {
    Write-Output "Backup exitoso en $BackupFile"
} else {
    Write-Error "El backup falló."
    exit 1
}
