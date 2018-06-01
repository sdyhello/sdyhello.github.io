fs = require("fs")

dir = "./zz500/"

cutFile = (filePath)->
   fileSize = 0
   fs.stat(filePath,  (err, stats)->
      if (err) 
          return console.log("file:#{filePath}", "err:#{err}")
      fileSize = stats.size
   )

   fs.open(filePath, 'r+', (err, fd)->
      if (err) 
          return console.log("file:#{filePath}", "err:#{err}")

      # // 截取文件
      fs.ftruncate(fd, fileSize - 2, (err)->
         if (err)
            return console.log("file:#{filePath}", "err:#{err}")
         
         # // 关闭文件
         fs.close(fd, (err)->
            if (err)
               return console.log("file:#{filePath}", "err:#{err}")
            console.log("#{filePath},#{fd}文件关闭成功！")
         )
      )
   )

fs.readdir(dir,
(err, files)->
   for fileName in files
      if fileName.indexOf("zcfzb") isnt -1
         # console.log(dir + fileName)
         cutFile(dir + fileName)

)