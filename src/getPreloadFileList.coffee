fs      			= require 'fs'

fs.readdir("../res/zz1000_json",
(err, files)->
   for fileName in files
      console.log("\"res/zz1000_json/#{fileName}\",")
)