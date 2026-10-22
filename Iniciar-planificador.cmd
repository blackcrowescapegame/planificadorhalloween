@echo off
setlocal
cd /d "%~dp0"
set "PLANNER_NODE="
for /f "delims=" %%N in ('where node 2^>nul') do if not defined PLANNER_NODE set "PLANNER_NODE=%%N"
if not defined PLANNER_NODE if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" set "PLANNER_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not defined PLANNER_NODE (
  echo Node.js no esta disponible. Instala Node.js desde https://nodejs.org y vuelve a abrir este archivo.
  pause
  exit /b 1
)
set "PLANNER_ROOT=%~dp0"
powershell -NoProfile -Command "$taskArgs = [char]34 + $env:PLANNER_ROOT + 'server.cjs' + [char]34 + ' --open'; Start-Process -FilePath $env:PLANNER_NODE -ArgumentList $taskArgs -WorkingDirectory $env:PLANNER_ROOT -WindowStyle Hidden"
