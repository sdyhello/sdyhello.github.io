#编译cocos
echo "del files"
rm -rf ./publish
echo "compile file......"
browserify -t coffeeify ./src/main.coffee --debug > ./main.js
cocos compile -p web -m release


