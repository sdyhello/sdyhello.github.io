#! /bin/sh

CURRENT_PATH=`dirname $0`
SCRIPT_PATH=$CURRENT_PATH
RESOURCE_PATH=$CURRENT_PATH/../ccb
CCB_PATH=$CURRENT_PATH/../ccb/Resources
TEMP_OUT=$CURRENT_PATH/out
OUT=$CURRENT_PATH/../res

if [ -d $OUT ];then
    echo "Clean old files..."
    rm -rf $OUT/*.ccbi
else
    echo "Not found out folder and create it!"
    mkdir $OUT
fi

echo "Publish .ccbis files..."

mkdir $TEMP_OUT

for i in $CCB_PATH/* 
do
    fileName=`basename $i`
    if [[ $fileName =~ [a-zA-Z]+\.ccb ]]
    then
        echo "--- publish >>$fileName<<"
        fileNameWithoutExt=${fileName%\.ccb}
        $CURRENT_PATH/ccbpublish -o $TEMP_OUT/$fileNameWithoutExt".ccbi" $i
    fi
done

echo "Move .ccbis files..."
mv $TEMP_OUT/*.ccbi $OUT/
echo "Copy other res"
cp -r -f $RESOURCE_PATH/Resources/ccbResources $OUT
rm -rf $TEMP_OUT

echo "All done!"