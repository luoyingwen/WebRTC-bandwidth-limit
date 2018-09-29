function setMediaBitrates(sdp) {
    return setMediaBitrate(sdp, "video", 1024, 1024000, 1536)
}

function setMediaBitrate(sdp, media, ASBitrate, TIASBitrate, startBitrate) {
    var lines = sdp.split("\n");
    var line = -1;
    var slideCodeName = "H264";
    var newLinesForBitrate;
    var newLinesForStartBitrate;
    var PTnumber;
    var codecsReorder;
    var codecs = [];
    var priorityCodecs = [];
    var serverUsedCode = [];
    var count = 0;
    var mLineRegex = /^m=video\s[0-9]{1,}\s\w{3,5}(\/\w{3,5})*?\s/;

    for(var i = 0; i < lines.length; i++){
        if(lines[i].indexOf("m="+media) >= 0) {
            line = i;
            line++;
            while (lines[line].indexOf("i=") >= 0 || lines[line].indexOf("c=") >= 0) {
                line++;
            }
            if (lines[line].indexOf("b=") >= 0) {
                lines[line] = "b=AS:" + ASBitrate + "\r\nb=TIAS:" + TIASBitrate;
                return lines.join("\n");
            }

            newLinesForBitrate = lines.slice(0, line);
            newLinesForBitrate.push("b=AS:" + ASBitrate + "\r\nb=TIAS:" + TIASBitrate);
            newLinesForBitrate = newLinesForBitrate.concat(lines.slice(line, lines.length));
            break;
        }
    }

    for(var j = line; j < lines.length; j++){
        if(lines[j].indexOf("a=rtpmap") >= 0){
            line = j;
            line++;
            if(lines[j].indexOf("VP8") >= 0){
                PTnumber = lines[j].substr(9,3);
                line++;
                newLinesForStartBitrate = newLinesForBitrate.slice(0, line);
                newLinesForStartBitrate.push("a=fmtp:" + PTnumber +  " x-google-start-bitrate=" + startBitrate);
                newLinesForBitrate = newLinesForStartBitrate.concat(
                    newLinesForBitrate.slice(line, newLinesForBitrate.length)
                );

                if(slideCodeName == "VP8"){
                    serverUsedCode.push(PTnumber);
                }else {
                    priorityCodecs.push(PTnumber);
                }
                count++;
            }
            else if(lines[j].indexOf("H264") >= 0){
                PTnumber = lines[j].substr(9,3);
                line++;
                line = line + count;
                newLinesForStartBitrate = newLinesForBitrate.slice(0, line);
                newLinesForStartBitrate.push("a=fmtp:" + PTnumber +  " x-google-start-bitrate=" + startBitrate);
                newLinesForBitrate = newLinesForStartBitrate.concat(
                    newLinesForBitrate.slice(line, newLinesForBitrate.length)
                );

                if(slideCodeName == "H264"){
                    serverUsedCode.push(PTnumber);
                }else {
                    priorityCodecs.push(PTnumber);
                }
                count++;
            }
            else {
                codecs.push(lines[j].substr(9,3));
            }
        }
    }

    if(media === "video"){
        codecsReorder = serverUsedCode.concat(priorityCodecs.concat(codecs)).join(" ").replace(/\s+/g, " ");
        for(var k = 0; k < newLinesForBitrate.length; k++){
            if(newLinesForBitrate[k].indexOf("m="+media) === 0) {
                newLinesForBitrate[k] = newLinesForBitrate[k].match(mLineRegex)[0] + codecsReorder;
            }
        }
    }

    return newLinesForBitrate.join("\n");
}
