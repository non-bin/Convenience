# run the js protion to select an action,
# then if it exits 0, execute the requested
# command from the temp file

if node ~/repos/Convenience/convenience/index.js
then
    chmod +x /tmp/convenience.sh
    /tmp/convenience.sh
fi
