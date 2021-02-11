// 線段不同樣式
var lineStrokeSource = new ol.source.Vector();

var lineStrokeStyle, lineStroke;
lineStroke = new ol.style.Stroke({
    color: '#ffcc33',
    width: 3, // 寬度
});
lineStrokeStyle = new ol.style.Style({
    ////虛線、圓點
    stroke: lineStroke
});

lineStyle.onchange = function () {
    //console.log('線類型', lineStyle.value);
    switch (parseInt(lineStyle.value)) {
        case 0: //實線
            lineStrokeStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 3 // 寬度
                })
            });
            break;
        case 1: //虛線
            lineStrokeStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 3,
                    lineDash: [10, 10]
                })
            });
            break;
        case 2: //橫線
            lineStrokeStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 20, // 寬度
                    lineDash: [1, 10],
                    lineCap: 'butt',
                    lineJoin: 'bevel'
                })
            });
            break;
        case 3: // 圓點線
            lineStrokeStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 3,
                    lineDash: [1, 10]
                })
            });
            break;
        case 4: // 雙虛
            lineStrokeStyle = function (feature, resolution) {
                var colors = ['#ffcc33', '', '#ffcc33'];
                var width = 3;
                var styles = [];
                // console.log('resolution', resolution);
                for (var line = 0; line < colors.length; line++) {
                    var dist = width * resolution * (line - (colors.length - 1) / 2);
                    var geom = feature.getGeometry();
                    var coords = [];
                    var counter = 0;
                    // console.log('geom', geom);
                    geom.forEachSegment(function (from, to) {
                        // console.log('geom.forEachSegment', from, to);
                        var angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
                        var newFrom = [
                            Math.sin(angle) * dist + from[0],
                            -Math.cos(angle) * dist + from[1]
                        ];
                        var newTo = [
                            Math.sin(angle) * dist + to[0],
                            -Math.cos(angle) * dist + to[1]
                        ];
                        coords.push(newFrom);
                        coords.push(newTo);
                        if (coords.length > 2) {
                            var intersection = math.intersect(coords[counter], coords[counter + 1], coords[counter + 2], coords[counter + 3]);
                            coords[counter + 1] = (intersection) ? intersection : coords[counter + 1];
                            coords[counter + 2] = (intersection) ? intersection : coords[counter + 2];
                            counter += 2;
                        }
                        // console.log('coords', coords);
                    });

                    if (line == 0 || line == 2) {
                        styles.push(
                            new ol.style.Style({
                                geometry: new ol.geom.LineString(coords),
                                stroke: new ol.style.Stroke({
                                    color: colors[line],
                                    width: width,
                                    lineDash: [10, 10]
                                })
                            })
                        );
                    }
                }
                return styles;
            };
            break;
        case 5: // 一實一虛
            lineStrokeStyle = function (feature, resolution) {
                var colors = ['#ffcc33', '', '#ffcc33'];
                var width = 3;
                var styles = [];
                // console.log('resolution', resolution);
                for (var line = 0; line < colors.length; line++) {
                    var dist = width * resolution * (line - (colors.length - 1) / 2);
                    var geom = feature.getGeometry();
                    var coords = [];
                    var counter = 0;
                    // console.log('geom', geom);
                    geom.forEachSegment(function (from, to) {
                        // console.log('geom.forEachSegment', from, to);
                        var angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
                        var newFrom = [
                            Math.sin(angle) * dist + from[0],
                            -Math.cos(angle) * dist + from[1]
                        ];
                        var newTo = [
                            Math.sin(angle) * dist + to[0],
                            -Math.cos(angle) * dist + to[1]
                        ];
                        coords.push(newFrom);
                        coords.push(newTo);
                        if (coords.length > 2) {
                            var intersection = math.intersect(coords[counter], coords[counter + 1], coords[counter + 2], coords[counter + 3]);
                            coords[counter + 1] = (intersection) ? intersection : coords[counter + 1];
                            coords[counter + 2] = (intersection) ? intersection : coords[counter + 2];
                            counter += 2;
                        }
                        // console.log('coords', coords);
                    });

                    if (line == 2) {
                        styles.push(
                            new ol.style.Style({
                                geometry: new ol.geom.LineString(coords),
                                stroke: new ol.style.Stroke({
                                    color: colors[line],
                                    width: width,
                                })
                            })
                        );
                    }

                    if (line == 0) {
                        styles.push(
                            new ol.style.Style({
                                geometry: new ol.geom.LineString(coords),
                                stroke: new ol.style.Stroke({
                                    color: colors[line],
                                    width: width,
                                    lineDash: [10, 10],
                                })
                            })
                        );
                    }
                }
                return styles;
            };
            break;
        default:
            lineStrokeStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 3 // 寬度
                })
            });
            break;
    }

    lineStrokeVectorLayer.setStyle(lineStrokeStyle);
}

var lineStrokeVectorLayer = new ol.layer.Vector({
    source: lineStrokeSource,
    style: lineStrokeStyle
})