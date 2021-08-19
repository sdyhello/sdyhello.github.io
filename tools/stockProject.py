import os
import os
import re
import shutil

os.chdir("/Users/taowu/study/gitee/sdyhello.github.io")
curPath = os.getcwd()
print(curPath)

leftFilePath = "/stock_tool/index.html"
rightFilePath = "/web-mobile/index.html"

leftCssFile = "/stock_tool/style-mobile.css"
rightCssFile = "/web-mobile/style-mobile.css"

leftPng = "/stock_tool/splash.png"
rightPng = "/web-mobile/splash.png"

shutil.copy(curPath + leftFilePath, curPath + rightFilePath)
shutil.copy(curPath + leftCssFile, curPath + rightCssFile)
shutil.copy(curPath + leftPng, curPath + rightPng)


shutil.rmtree(curPath + "/stock_tool", ignore_errors=True)
os.rename(curPath + "/web-mobile", curPath + "/stock_tool")