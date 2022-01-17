LAT=22
LONG=22

# Basic while loop
while [ true ]
    do
        echo 'starting...'
        DEVICENAME="Box1"
        TRACKERNAME="taggtodayTracker"
        TIME=$(date +%s)


        UPDATE="DeviceId=$DEVICENAME,Position=$LAT,$LONG,SampleTime=$TIME"

        echo "$UPDATE"

        aws location \
            batch-update-device-position \
            --tracker-name $TRACKERNAME \
            --updates $UPDATE

        let LAT+=1
        let LONG+=1
        sleep 30
    done

echo All done
