fs      			= require 'fs'

fs.readdir("../res/zz500_json",
(err, files)->
   for fileName in files
      console.log("\"res/zz500_json/#{fileName}\",")
)