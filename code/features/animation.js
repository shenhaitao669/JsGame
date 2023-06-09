const Animation = function(width, height, resFrameWidth, resFrameHeight, ...resources) {
    const objAttr = {
        frameBuffer: document.createElement("canvas"),
        frameCount: 0,
        frameStart: 0,
        frameEnd: 0,
        frameDuration: 1000,
        frameIdx: 0,
        frameTimestamp: 0,
        frameWidth: width,
        frameHeight: height,
        frameLoop: -1,
        onLoaded: () => {},
        onEnded: () => {},
        onLoopEndend: () => {}
    };

    const obj = {
        onLoaded(callback) {
            objAttr.onLoaded = callback;
            return this;
        },

        onEnded(callback) {
            objAttr.onEnded = callback;
            return this;
        },

        onLoopEnded(callback) {
            objAttr.onLoopEndend = callback;
            return this;
        },

        getFrameCount() {
            return objAttr.frameCount;
        },

        getFrameRange() {
            return [objAttr.frameStart, objAttr.frameEnd];
        },

        setFrameRange(...range) {
            const [start, end] = range;
            objAttr.frameIdx = start;
            objAttr.frameStart = start;
            objAttr.frameEnd = end;
            return this;
        },

        getPlayDuration() {
            return objAttr.frameDuration;
        },

        setPlayDuration(duration) {
            objAttr.frameDuration = duration;
            return this;
        },

        loop(loopCount = -1) {
            objAttr.frameLoop = loopCount;
            objAttr.frameIdx = objAttr.frameStart;
            objAttr.frameTimestamp = 0;
            return this;
        },

        reset() {
            objAttr.frameIdx = objAttr.frameStart;
            objAttr.frameTimestamp = 0;
            return this;
        },

        play(pen, x, y) {
            if (objAttr.frameEnd - objAttr.frameStart <= 0) {
                return;
            }

            if (objAttr.frameLoop != 0) {
                const date = new Date();
                if ((date.getTime() - objAttr.frameTimestamp) > (objAttr.frameDuration / (objAttr.frameEnd - objAttr.frameStart))) {
                    if (objAttr.frameTimestamp > 0) {
                        if (++objAttr.frameIdx >= objAttr.frameEnd) {
                            if (objAttr.frameLoop > 0) {
                                objAttr.frameLoop--;
                            }

                            objAttr.onEnded();
                            if (objAttr.frameLoop == 0) {
                                objAttr.frameIdx = objAttr.frameEnd - 1;
                                objAttr.frameTimestamp = 0;
                                objAttr.onLoopEndend();
                            } else {
                                objAttr.frameIdx = objAttr.frameStart;
                                objAttr.frameTimestamp = date.getTime();
                            }
                        } else {
                            objAttr.frameTimestamp = date.getTime();
                        }
                    } else {
                        objAttr.frameTimestamp = date.getTime();
                    }
                }
            }

            pen.drawImage(objAttr.frameBuffer, objAttr.frameIdx * objAttr.frameWidth, 0, objAttr.frameWidth, objAttr.frameHeight,
                x, y, objAttr.frameWidth, objAttr.frameHeight);
        }
    };

    const createFrameSequence = (...images) => {
        images.forEach(image => objAttr.frameCount += (image.width / resFrameWidth) * (image.height / resFrameHeight));
        
        objAttr.frameIdx = 0;
        objAttr.frameStart = 0;
        objAttr.frameEnd = objAttr.frameCount;

        objAttr.frameBuffer.width =  objAttr.frameCount * objAttr.frameWidth;
        objAttr.frameBuffer.height = objAttr.frameHeight;

        let linearX = 0;
        let pen = objAttr.frameBuffer.getContext("2d");
        images.forEach(image => {
            for (let y = 0; y < image.height; y += resFrameHeight) {
                for (let x = 0; x < image.width; x += resFrameWidth) {
                    pen.drawImage(image, x, y, resFrameWidth, resFrameHeight, 
                        linearX, 0, objAttr.frameWidth, objAttr.frameHeight);
                    linearX += objAttr.frameWidth;
                }
            }
        });

        objAttr.onLoaded();
    };

    const loadFrames = (...resources) => {
        const images = [];
        let loadingCount = 0;
        resources.forEach((resource, idx) => {
            if (typeof resource == 'string') {
                loadingCount++;
                images[idx] = new Image();
                images[idx].src = resource;
                images[idx].addEventListener("load", () => {
                    if (--loadingCount == 0) {
                        createFrameSequence(...images);
                    }
                });
            } else {
                images[idx] = resource;
            }
        });

        if (loadingCount == 0) {
            createFrameSequence(...images);
        }
    };

    loadFrames(...resources);

    return obj;
};