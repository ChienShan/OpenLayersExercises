/**
 * 面-所有型式
 * 面狀圖層資料來源
*/
var faceSource = new ol.source.Vector();
/**
 * 面-所有型式
 * 畫布
 */
var canvas = document.createElement('canvas');
/**
 * 面-所有型式
 * 畫布內容
 */
var context = canvas.getContext('2d');

/** 
 * 面-所有型式
 * 面上有圖示
*/
var graphic = new ol.layer.Image();

/** 
 * 面-所有型式
 * 面上圖示來源
*/
var imageTest = document.getElementById('imgSource');

/**
 * 畫素
 */
var pixelRatio = ol.has.DEVICE_PIXEL_RATIO;

/**
 *取得樣式
 *
 * @returns
 */
function getPat() {
    let pat = {
        width: 5,
        height: 5,
        lines: [[0, 2.5, 5, 2.5]],
        stroke: 1,
        angle: 45,
        spacing: 12,
        offset: 9
    }

    if (parseInt(faceStyle.value) == 5) {
        pat.width = 7;
        pat.height = 7;
        pat.lines = [[0, 3, 10, 3], [3, 0, 3, 10]];
    }

    var a = Math.round(((pat.angle || 0) - 90) % 360);
    var d = Math.round(pat.spacing) || 10;
    if (a > 180) a -= 360;
    a *= Math.PI / 180;
    var cos = Math.cos(a);
    var sin = Math.sin(a);
    if (Math.abs(sin) < 0.0001) {
        pat.width = pat.height = d;
        pat.lines = [[0, 0.5, d, 0.5]];
        pat.repeat = [[0, 0], [0, d]];
    }
    else if (Math.abs(cos) < 0.0001) {
        pat.width = pat.height = d;
        pat.lines = [[0.5, 0, 0.5, d]];
        pat.repeat = [[0, 0], [d, 0]];
        if (parseInt(faceStyle.value) == 5) {
            pat.lines.push([0, 0.5, d, 0.5]);
            pat.repeat.push([0, d]);
        }
    }
    else {
        var w = pat.width = Math.round(Math.abs(d / sin)) || 1;
        var h = pat.height = Math.round(Math.abs(d / cos)) || 1;
        if (parseInt(faceStyle.value) == 5) {
            pat.lines = [[-w, -h, 2 * w, 2 * h], [2 * w, -h, -w, 2 * h]];
            pat.repeat = [[0, 0]];
        }
        else if (cos * sin > 0) {
            pat.lines = [[-w, -h, 2 * w, 2 * h]];
            pat.repeat = [[0, 0], [w, 0], [0, h]];
        }
        else {
            pat.lines = [[2 * w, -h, -w, 2 * h]];
            pat.repeat = [[0, 0], [-w, 0], [0, h]];
        }

    }
    pat.stroke = 4;

    return pat;
}

/**
 *面上斜線填充 顏色飽和
 *Generate a canvasPattern with two circles on white background
 * @returns
 */
function pattern() {
    let pat = getPat();
    canvas.width = Math.round(pat.width * pixelRatio);
    canvas.height = Math.round(pat.height * pixelRatio);
    // canvas.width = 8 * pixelRatio;
    // canvas.height = 8 * pixelRatio;
    context.globalAlpha = 0.5; //透明度
    context.fillStyle = 'white'; //填滿顏色
    context.fillRect(0, 0, canvas.width, canvas.height); //畫布大小
    context.scale(pixelRatio, pixelRatio); //比例
    context.lineCap = "round";//設定線條結尾的樣式
    context.lineWidth = pat.stroke || 1; //線寬

    context.beginPath();
    if (!pat.repeat) pat.repeat = [[0, 0]];
    // console.log('pat.lines.length', pat.lines, pat.lines.length);
    // console.log('pat.repeat.length', pat.repeat, pat.repeat.length);
    for (i = 0; i < pat.lines.length; i++) {
        for (var r = 0; r < pat.repeat.length; r++) {
            var li = pat.lines[i];
            // console.log('pat.lines[i]', i, li);
            context.beginPath();
            context.moveTo(li[0] + pat.repeat[r][0], li[1] + pat.repeat[r][1]);
            // console.log('moveTo', li[0] + pat.repeat[r][0], li[1] + pat.repeat[r][1]);
            for (var k = 2; k < li.length; k += 2) {
                context.lineTo(li[k] + pat.repeat[r][0], li[k + 1] + pat.repeat[r][1]);
                // console.log('lineTo', li[k] + pat.repeat[r][0], li[k + 1] + pat.repeat[r][1]);
            }

            context.stroke();
            context.fill();
            context.save()
            context.restore()
        }
    }
    return context.createPattern(canvas, 'repeat');
}

/**
 * 面狀填充色
 */
var faceFill = new ol.style.Fill({
    color: 'rgba(0, 255, 0, 0.2)'
});

/**面狀造型 */
var style = new ol.style.Style({
    //面邊框
    stroke: new ol.style.Stroke({
        color: '#000000',
        width: 3,
    }),
    //面顏色設定
    fill: faceFill,
});


/**
 * 取得面狀造型
 */
var getStackedStyle = function () {
    let patternColor = pattern();
    faceFill.setColor(patternColor);
    return style;
};

/**
 * 面狀圖層
 */
var faceVectorLayer = new ol.layer.Vector({
    source: faceSource,
    style: parseInt(faceStyle.value) == 4 || parseInt(faceStyle.value) == 5 ? getStackedStyle : style
})

/**
 * 面類型選單切換
 */
faceStyle.onchange = function () {
    switch (parseInt(faceStyle.value)) {
        case 0: //一般 origin
            style = new ol.style.Style({
                //面顏色設定
                fill: new ol.style.Fill({
                    color: 'rgba(0, 255, 0, 0.2)'
                }),
                //面邊框
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 3,
                }),
            });
            faceVectorLayer.setStyle(style);
            break;
        case 1: //邊框 border
            style = new ol.style.Style({
                //面邊框
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 3,
                }),
            });
            faceVectorLayer.setStyle(style);
            break;
        case 2: //無邊框 without border
            style = new ol.style.Style({
                //面顏色設定
                fill: new ol.style.Fill({
                    color: 'rgba(0, 255, 0, 0.2)'
                }),
            });
            faceVectorLayer.setStyle(style);
            break;
        case 3: //填滿顏色 filling color
            faceFill.setColor('#ffcc33');
            style = new ol.style.Style({
                //面顏色設定
                fill: faceFill,
                //面邊框
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 3,
                }),
            });
            faceVectorLayer.setStyle(style);
            break;
        case 4: //斜線 filling slash
            faceVectorLayer.setStyle(getStackedStyle);
            break;
        case 5: //網格 filling grid
            faceVectorLayer.setStyle(getStackedStyle);
            break;
        case 6: //面上有圖示 a image on the face
            style = [new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'black',
                    width: 1,
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0, 255, 0, 0.2)'
                })
            }),
                // 面上加 icon ，但 icon 會隨地圖縮放
                // new ol.style.Style({
                //     geometry: function (feature) {
                //         let geometry = feature.getGeometry();
                //         let geometryType = geometry.getType();
                //         // console.log('feature.getGeometry()', feature.getGeometry());
                //         // console.log('geometry.getInteriorPoint()', geometry.getInteriorPoint());
                //         // console.log('olExtent.getCenter(this.lineVector.getSource().getExtent())', ol.extent.getCenter(faceVectorLayer.getSource().getExtent()));
                //         return (
                //             geometryType == 'Polygon' ? geometry.getInteriorPoint() : geometry
                //             // geometryType == 'MultiPolygon' ? geometry.getInteriorPoints() :
                //             //     geometry
                //         );
                //     },
                //     image: new ol.style.Icon({
                //         anchor: [0, 0],
                //         anchorXUnits: 'pixels',
                //         anchorYUnits: 'pixels',
                //         // the real size of your icon
                //         size: [200, 200],
                //         // the scale factor
                //         scale: 0.2,
                //         src: 'https://img.icons8.com/plasticine/2x/user-location.png',
                //     }),
                // })
            ];
            faceVectorLayer.setStyle(style);
            break;
        default:
            break;
    }
}