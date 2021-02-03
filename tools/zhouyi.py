import os
import os
import re
import shutil

os.chdir("/Users/taowu/study/gitee/luban7")
curPath = os.getcwd()
print(curPath)

shutil.rmtree(curPath + "/zhou_yi", ignore_errors=True)
os.rename(curPath + "/web-mobile", curPath + "/zhou_yi")