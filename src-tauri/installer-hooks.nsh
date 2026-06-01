; Kill LibreHardwareMonitor before install/uninstall so its executable is not
; locked while the updater overwrites the application directory.
!macro NSIS_HOOK_PREINSTALL
  nsExec::Exec 'taskkill /F /IM LibreHardwareMonitor.exe /T'
  Sleep 500
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  nsExec::Exec 'taskkill /F /IM LibreHardwareMonitor.exe /T'
  Sleep 500
!macroend
