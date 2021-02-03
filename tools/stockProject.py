import os
import os
import re
import shutil

os.chdir("/Users/taowu/study/gitee/sdyhello.github.io")
curPath = os.getcwd()
print(curPath)

leftFilePath = "/stock_tool/index.html"
rightFilePath = "/web-mobile/index.html"

shutil.copy(curPath + leftFilePath, curPath + rightFilePath)
shutil.rmtree(curPath + "/stock_tool", ignore_errors=True)
os.rename(curPath + "/web-mobile", curPath + "/stock_tool")