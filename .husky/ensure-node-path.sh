# Git Bash on Windows often omits nvm-windows from PATH in Husky hooks.
if command -v npx >/dev/null 2>&1; then
  return 0 2>/dev/null || exit 0
fi

if [ -n "$NVM_SYMLINK" ] && [ -d "$NVM_SYMLINK" ]; then
  export PATH="$NVM_SYMLINK:$PATH"
fi

if [ -d "$HOME/AppData/Local/nvm" ]; then
  latest="$(ls -d "$HOME/AppData/Local/nvm"/v* 2>/dev/null | sort -V | tail -1)"
  if [ -n "$latest" ]; then
    export PATH="$latest:$PATH"
  fi
fi

if [ -d "/c/nvm4w/nodejs" ]; then
  export PATH="/c/nvm4w/nodejs:$PATH"
fi
