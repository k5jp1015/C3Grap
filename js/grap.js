const kelvin = 273.15;

// 小数点n位までを残す関数
// number=対象の数値
// n=残したい小数点以下の桁数
function floatFormat( number, n ) {
	const _pow = Math.pow( 10 , n ) ;

	return Math.round( number * _pow ) / _pow ;
}

class Temperature {

  constructor(current,max,min) {
    this.current = current;
    this.max = max;
    this.min = min;
  }

  getCurrent(){
    return floatFormat(Number(this.current) - kelvin,1);
  }

  getMax(){
    return floatFormat(Number(this.max) - kelvin,1);
  }

  getMin(){
    return floatFormat(Number(this.min) - kelvin,1);
  }

}


$(document).ready(function() {
    //テキストのスタイル変更
    changeTextStyle();
    // c3でグラフを生成
    //c3Generate();

    $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/weather?q=Tokyo,jp&APPID=26242bc33168b7fd0ce0021a3b962569',
            type: 'GET',
            dataType: 'jsonp',
            cache: false
            // data: {
            //     param1: 'value1'
            // }
        })
        .done(function(data) {
            console.log("success");
            console.log(data);

            const temp = new Temperature(data.main.temp,data.main.temp_max,data.main.temp_min);

            console.log(temp.getCurrent());
            console.log(temp.getMax());
            console.log(temp.getMin());

            tempChart(temp);

        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });





});

function changeTextStyle() {
    $("#myDiv").css({
        "color": "red",
        fontWeight: "bolder"
    });
}

function tempChart(temp){
  c3.generate({
    data: {
        x:'x',
        columns: [
            ['x','Tokyo'],
            ['current', temp.getCurrent()],
            ['max',temp.getMax()],
            ['min',temp.getMin()]
        ],
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
            ratio: 0.1 // this makes bar width 50% of length between ticks
        }
        // or
        //width: 100 // this makes bar width 100px
    }
});
}

function c3Generate() {
  c3.generate({
    data: {
        columns: [
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 130, 100, 140, 200, 150, 50]
        ],
        type: 'bar'
    },
    bar: {
        width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
        // or
        //width: 100 // this makes bar width 100px
    }
});


    // c3.generate({
    //     bindto: '#chart',
    //     data: {
    //         columns: [
    //             ['data1', 30, 200, 100, 400, 150, 250],
    //             ['data2', 50, 20, 10, 40, 15, 25]
    //         ],
    //         axes: {
    //             data2: 'y2'
    //         }
    //     },
    //     axis: {
    //         y2: {
    //             show: true
    //         }
    //     }
    // });
    //
    // c3.generate({
    //     bindto: '#pie_chart',
    //     data: {
    //         columns: [
    //             ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
    //             ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
    //             ["virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8]
    //         ],
    //         type: 'pie',
    //         onmouseover: function(d, i) {
    //             console.log("onmouseover", d, i);
    //         },
    //         onmouseout: function(d, i) {
    //             console.log("onmouseout", d, i);
    //         }
    //     }
    // });

}
