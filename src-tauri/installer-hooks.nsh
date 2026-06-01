; Kill app/runtime helpers before install/uninstall so executables are not
; locked while the updater overwrites the application directory.
!macro NSIS_HOOK_PREINSTALL
  nsExec::Exec 'taskkill /F /IM desk-dashboard.exe /T'
  nsExec::Exec 'taskkill /F /IM Sideglass.exe /T'
  nsExec::Exec 'taskkill /F /IM LibreHardwareMonitor.exe /T'
  Sleep 1000
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  nsExec::Exec 'taskkill /F /IM desk-dashboard.exe /T'
  nsExec::Exec 'taskkill /F /IM Sideglass.exe /T'
  nsExec::Exec 'taskkill /F /IM LibreHardwareMonitor.exe /T'
  Sleep 1000
!macroend

; Install PawnIO driver during setup (installer already runs elevated).
!macro NSIS_HOOK_POSTINSTALL
  IfFileExists "$INSTDIR\resources\bin\PawnIO_setup.exe" 0 pawnio_done
  nsExec::ExecToLog '"$INSTDIR\resources\bin\PawnIO_setup.exe" -install -silent'
  Sleep 2000
  pawnio_done:
!macroend
