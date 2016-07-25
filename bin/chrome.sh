#!/usr/bin/env bash
{ set +x; } 2>/dev/null

# open/refresh url
[[ $OSTYPE != *darwin* ]] && echo "SKIP: OSX only" && exit 0

[[ $# == 0 ]] && [[ $1 == "--help" ]] && {
  cat <<EOF
usage: ${BASH_SOURCE[0]##*/} [options] url
    -f  Frontmost
    -r  Refresh
EOF
  [[ $1 == "--help" ]]; exit # exit 0 if --help
}

frontmost=false
refresh=false
while getopts "fr:" OPTION; do
    case $OPTION in
        f)
            frontmost=true
            ;;
        r)
            refresh=true
            ;;
    esac
done

osascript <<EOF
tell application "Google Chrome"
  repeat with w in  every window
  set tab_i to 0
    repeat with t in every tab in w
      set tab_i to (tab_i+1)
        if (URL of t) is "$url" then
          if $refresh = true then
            tell t to reload
          end if
          if $frontmost = true then
            set index of w to 1 --activate window
            tell w to set active tab index to tab_i --activate tab
          end if
          return
        end if
      end repeat
  end repeat
  open location "$url"
end tell
EOF