const kelvin = 273.15;

// chartの編集用変数
var c3Gene;

// 小数点n位までを残す関数
// number=対象の数値
// n=残したい小数点以下の桁数
function floatFormat(number, n) {
    const _pow = Math.pow(10, n);

    return Math.round(number * _pow) / _pow;
}

// 都市と温度のインスタンスクラス
// class Temperature {
//
//     constructor(current, max, min, cityName) {
//         // 現在温度
//         this.current = current;
//         // 最高温度
//         this.max = max;
//         // 最低温度
//         this.min = min;
//         // 都市名
//         this.cityName = cityName;
//     }
//
//     // 以下、各メンバ変数のゲッター
//     getCurrent() {
//         return Number(this.current) - kelvin, 1);
//     }
//
//     getMax() {
//         return Number(this.max) - kelvin, 1);
//     }
//
//     getMin() {
//         return Number(this.min) - kelvin, 1);
//     }
//
//     getCityName() {
//         return this.cityName;
//     }
//
//     // 以下、各メンバ変数のセッター
//     setCurrent(current){
//       this.current = current;
//     }
//
//     setMax(max){
//       this.max = max;
//     }
//
//     setMin(min){
//       this.min = min;
//     }
//
// }


var current = [];
var max = [];
var min = [];

let currntK;
let maxK;
let minK;

// cityNameのindexに紐づくcitycode
const cityCode = ['1850147', '1853909', '1856057', '2128295', '1863958'];

$(document).ready(function() {

    //検出する都市名の配列
    const cityName = ['Tokyo', 'Osaka', 'Nagoya', 'Sapporo', 'Hakata'];


    $.each(cityCode, function(index, val) {
        console.log(val);
    });

    //テキストのスタイル変更
    changeTextStyle();

    $.when(callWhetherAPI(cityCode))
      .done(function(){
        setTimeout(generateTempChart(current, max, min, cityName),5000);
      });


    // .fail(function() {
    //     console.log("callAPI Error");
    // });

    // c3でグラフを生成
    //c3Generate();

    // const tempTokyo = new Temperature(0, 0, 0, cityName[0]);
    // const tempOsaka = new Temperature(0, 0, 0, cityName[1]);
    // const tempNagoya = new Temperature(0, 0, 0, cityName[2]);
    // const tempSapporo = new Temperature(0, 0, 0, cityName[3]);
    // const tempHakata = new Temperature(0, 0, 0, cityName[4]);}
});


function callWhetherAPI(cityCode) {

    var dfd = new $.Deferred;

    $.each(cityCode, function(index, val) {
        $.ajax({
                url: 'http://api.openweathermap.org/data/2.5/weather?id=' + cityCode[index] + '&APPID=26242bc33168b7fd0ce0021a3b962569',
                type: 'GET',
                // クロスドメイン対策
                dataType: 'jsonp',
                //キャッシュをOFFにする
                cache: false
                    // data: {
                    //     param1: 'value1'
                    // }
            })
            .done(function(data) {

                console.log(data);
                console.log("done" + index);

                current[index] = data.main.temp;
                max[index] = data.main.temp_max;
                min[index] = data.main.temp_min;


                // current[index] = data.main.temp;
                // max[index] = data.main.temp_max;
                // min[index] = data.main.temp_min;


                // if (index == 0) {
                //     generateTempChart(temp);
                // } else {
                //   setTimeout(addTempChart(temp), 5000);
                // }

            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
                console.log("cityCode.length:" + cityCode.length);
                if (index == cityCode.length - 1) {
                    console.log("before return.promise")
                }
            });

    });

}


function changeTextStyle() {
    $("#myDiv").css({
        "color": "red",
        fontWeight: "bolder"
    });
}

function generateTempChart(current, max, min, cityName) {

    c3Gene = c3.generate({
        data: {
            x: 'x',
            columns: [
                ['x', cityName[0], cityName[1], cityName[2], cityName[3], cityName[4]],
                ['current', current[0], current[1], current[2], current[3], current[4]],
                ['max', max[0], max[1], max[2], max[3], max[4]],
                ['min', min[0], min[1], min[2], min[3], min[4]]
            ],
            colors: {
                current: 'rgba(219, 255, 0, 0.37)',
                max: 'rgba(255, 0, 0, 0.44)',
                min: 'rgba(0, 0, 255, 0.39)'
            },
            type: 'bar'
        },
        axis: {
            x: {
                type: 'category',
                tick: {
                    rotate: 75,
                    multiline: false
                },
                height: 60
            }
        },
        bar: {
            width: {
                ratio: 0.2 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
        }
    });
}

// function addTempChart(temp) {
//     c3Gene.load({
//         columns: [
//             ['x', temp.getCityName()],
//             ['current', temp.getCurrent()],
//             ['max', temp.getMax()],
//             ['min', temp.getMin()]
//         ]
//     });
//
//     console.log('addTempChart');
// }
