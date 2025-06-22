#!/bin/bash

TARGET_DIR=$1

function copyProject(){
  cp .eslintrc.cjs .gitignore .prettierrc.json $TARGET_DIR
  cp -R `ls .| grep -v copyProject.sh | grep -v node_modules` $TARGET_DIR
  # find . -maxdepth 1 -type f -name 'copyProject.sh' -o -type d -name 'node_modules' -prune -o -exec cp -R {} "$TARGET_DIR" \;
}

if [[ -z "$TARGET_DIR" ]]; then
  echo "DO THIS"
  echo ">>     sh copyProject.sh  {YOUR_PROJECT_PATH}"
else
  if [[ -d "$TARGET_DIR" ]]; then
    echo "file already exist. copy project"
    copyProject
  else
    echo "Make folder and copy project"
    mkdir $TARGET_DIR && copyProject
  fi
fi
