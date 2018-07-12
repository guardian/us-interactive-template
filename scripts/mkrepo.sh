#!/usr/bin/env bash
# filename: hello.sh

echo "What's your github repo name?"
read name
echo "Alright, making https://github.com/guardian/"$name".git"
cd ../
git clone https://github.com/guardian/$name.git
cp us-interactive-template/src $name/
cp us-interactive-template/scripts $name/
cp us-interactive-template/package.json $name/
cd $name/
npm install
