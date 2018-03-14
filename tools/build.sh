browserify -t coffeeify ./src/main.coffee --debug > ./main.js
cocos compile -p web -m release
python -m SimpleHTTPServer