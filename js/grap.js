// cityNameのindexに紐づくcitycode
const cityCode = ['1850147', '1853909', '1856057', '2128295', '1863958'];
//検出する都市名の配列
const cityName = ['Tokyo', 'Osaka', 'Nagoya', 'Sapporo', 'Hakata'];

// ケルビン定数
const kelvin = 273.15;

// chartの編集用変数
var c3Gene;


// Arrayの拡張でflattenメソッドを設定
// http://qiita.com/shuhei/items/5a3d3a779b64a81b8c8d
Array.prototype.flatten = function() {
    return Array.prototype.concat.apply([], this);
};


// 小数点n位までを残す関数
// number=対象の数値
// n=残したい小数点以下の桁数
function floatFormat(number, n) {
    const _pow = Math.pow(10, n);

    return Math.round(number * _pow) / _pow;
}

// 都市温度のオブジェクトクラス
class Temperature {

    constructor() {
        // 現在温度を格納するArray型変数
        this.current = [];
        // 最高温度を格納するArray型変数
        this.max = [];
        // 最低温度を格納するArray型変数
        this.min = [];
    }

    // 以下、各メンバ変数のゲッター
    getCurrent() {
        return this.current;
    }

    getMax() {
        return this.max;
    }

    getMin() {
        return this.min;
    }

    // 以下、各メンバ変数のセッター
    setCurrent(current) {
        this.current.push(floatFormat(Number(current) - kelvin, 1));
    }

    setMax(max) {
        this.max.push(floatFormat(Number(max) - kelvin, 1));
    }

    setMin(min) {
        this.min.push(floatFormat(Number(min) - kelvin, 1));
    }

}

// HTMLが読み込まれたら実行する無名関数
$(document).ready(function() {

    //テキストのスタイル変更メソッド呼び出し
    changeTextStyle();

    // 非同期処理でも処理順序を担保するために、
    // ajaxでAPIから取ってきたデータを格納するための配列
    let jqXHRList = [];

    // 配列cityCodeの要素数分だけajax通信によってデータを取得する。
    $.each(cityCode, function(index, el) {
        jqXHRList.push(
            $.ajax({
                url: 'http://api.openweathermap.org/data/2.5/weather?id=' + cityCode[index] + '&APPID=26242bc33168b7fd0ce0021a3b962569',
                type: 'GET',
                // クロスドメイン対策
                dataType: 'jsonp',
                //キャッシュをOFFにする
                cache: false
            }));
    });

    //$.when関数を利用する
    //$.whenは可変長引数を取るので、apllyメソッドを利用して配列で渡せるようにする。
    //$.whenのコンテキスト(applyの第一引数)はjQueryである必要があるので$を渡す
    $.when.apply($, jqXHRList).done(function() {
        let tempResult = [];
        let statuses = [];
        let jqTempDataResult = [];

        // console.table(jqXHRList);
        // console.table(arguments);

        //結果は仮引数に可変長で入る**順番は保証されている**
        //取り出すにはargumentsから取り出す
        //更にそれぞれには[data,textStatus,jqXHR]
        for (var i = 0; i < arguments.length; i++) {
            var result = arguments[i];
            tempResult.push(result[0]);
            statuses.push(result[1]);
            jqTempDataResult.push(result[3]);

            //console.table(tempResult[i]);

        }

        // Temperatureクラスのインスタンスを生成
        let temp = new Temperature();

        // APIからのデータを繰り返し処理によって、クラスのメンバ変数にセットする
        for (var i = 0; i < tempResult.length; i++) {
            temp.setCurrent(tempResult[i].main.temp);
            temp.setMax(tempResult[i].main.temp_max);
            temp.setMin(tempResult[i].main.temp_min);
        }

        // c3でのグラフの描写メソッド呼び出し
        generateTempChart(temp);

    });

});

// テキストのレイアウト変更用メソッド
function changeTextStyle() {
    $("#myDiv").css({
        "color": "red",
        fontWeight: "bolder"
    });
}

// C3のグラフ描写のためのメソッド
function generateTempChart(temp) {

    // 始めはグラフ軸と現在の気温を描写する
    c3Gene = c3.generate({
        data: {
            bindto: '#chart',
            x: 'x',
            columns: [
                // flattenメソッドを用いることによって、
                // cityNameやクラス変数の要素数を意識することなく利用が可能。
                ['x', cityName].flatten(), ['current', temp.getCurrent()].flatten(),
            ],
            colors: {
                current: 'rgba(0, 255, 3, 0.3)',
                max: 'rgba(255, 0, 0, 0.44)',
                min: 'rgba(0, 0, 255, 0.39)'
            },
            type: 'bar'
        },
        axis: {
            x: {
                type: 'category',
                tick: {
                    rotate: 50,
                    multiline: false
                },
                height: 60
            }
        },
        bar: {
            width: {
                ratio: 0.35 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
        }
    });

    // 1秒後に最高気温を追加
    setTimeout(function() {
        c3Gene.load({
            columns: [
                ['max', temp.getMax()].flatten(),
            ]
        });
    }, 1000);

    // 2秒後に最低気温を追加
    setTimeout(function() {
        c3Gene.load({
            columns: [
                ['min', temp.getMin()].flatten()
            ]
        });
    }, 2000);
}
