#检查python进程是否存在，若不存在，则创建
echo "copy file to main folder......"
mv "publish/html5" "publish/jump"
rm -rf ../ArkadGame/Game/jump
cp -R publish/jump ../ArkadGame/game
