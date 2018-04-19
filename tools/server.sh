echo "start server ......"

if [ "$1" == "release" ]
then
    cd publish/jump
fi

pid=$(ps -ef | grep "python" | grep -v grep | awk '{print $2}')

if ps -p $pid > /dev/null
then
   echo "$pid python is running"
   kill $pid
fi

python -m SimpleHTTPServer
