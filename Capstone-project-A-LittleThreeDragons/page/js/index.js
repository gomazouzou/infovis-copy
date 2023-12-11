const getData = async () => {
    const data_0 = await d3.csv("./data/playerdata_1.csv");
    const data_1 = await d3.csv("./data/playerdata_2.csv");
    const data_2 = await d3.csv("./data/playerdata_3.csv");
    const data_raw = [data_0, data_1, data_2];
    const ignore_column = ["記録対戦数", "記録点数", "流局率", "飛び率", "安定段位", "点数期待", "立直流局率", "最高段位", "最高点数", "最大連荘", "痛い親かぶり率", "痛い親かぶり平均", "局収支", "平均順位", "立直放銃A", "立直放銃B", "立直収支", "立直流局", "振聴率", "立直多面", "総計局数", "調整打点効率", "ダマ率", "ツモ率", "追っかけられ率"];
    const rating_idx = { "士": 0, "傑": 1, "豪": 2, "聖": 4, "魂": 8 };
    const data = [];
    const label = {};

    for (let i = 0; i < 3; i++) {
        data_raw[i].forEach(function (dat) {
            let playerdata = [];
            let j = 0;
            playerdata.push("anonymous");
            label["name"] = j;
            j++;
            playerdata.push(String(1 << i));
            label["rank"] = j;
            j++;
            for (let key in dat) {
                let ok = 1;
                for (let _ in ignore_column) {
                    if (key == ignore_column[_]) {
                        ok = 0;
                    }
                }
                if (!ok) continue;
                if (key == "記録段位") {
                    let rating = String(rating_idx[dat[key].substr(0, 1)]);
                    let pt = dat[key].substr(1);
                    playerdata.push(rating);
                    label["rating"] = j;
                    j++;
                    playerdata.push(pt);
                    label["point"] = j;
                    j++;
                }
                else {
                    playerdata.push(dat[key]);
                    label[key] = j;
                    j++;
                }
            }
            data.push(playerdata);
        });
    }
    return { data, label };
};

const createSite = (data, data_label, data_rank_ave, data_rating_ave, data_rank_std, data_rating_std) => {
    const width = 600;
    const height = 600;
    const offset_x = 60;
    const offset_y = 20;

    const label_idx = data_label;
    const idx_label = [];
    for (key in label_idx) {
        idx_label.push(key);
    }

    const pos_idx = { "自家": 0, "下家": 1, "対面": 2, "上家": 3 };
    const idx_pos = [];
    for (key in pos_idx) {
        idx_pos.push(key);
    }

    const column = idx_label.length;

    // 1 : 金の間, 2 : 玉の間, 4 : 王座の間  
    let rank = 7;
    // 1 : 雀傑, 2 : 雀豪, 4 : 雀聖, 8 : 魂天
    let rating = 15;
    // 0 : 間, 1 : ランク
    let colormode = 0;

    playerdata_default = [...Array(column)].map((__) => "-1");
    playerdata_default[label_idx["name"]] = "";
    playerdata_default[label_idx["rank"]] = 0;
    data_currentplayer = [...Array(4)].map((_) => playerdata_default.slice());

    let preset_idx = 0;

    // default
    let xidx = label_idx["放銃率"];
    let yidx = label_idx["和了率"];

    const xScales = [...Array(column)].map((_) => d3.scaleLinear().domain([0, 0.35]).range([0, width]))
    const yScales = [...Array(column)].map((_) => d3.scaleLinear().domain([0, 0.35]).range([height, 0]))

    // ここにscaleを追加
    xScales[label_idx["副露率"]] = d3.scaleLinear().domain([0, 0.6]).range([0, width]);
    yScales[label_idx["副露率"]] = d3.scaleLinear().domain([0, 0.6]).range([height, 0]);

    xScales[label_idx["流局聴牌率"]] = d3.scaleLinear().domain([0, 1]).range([0, width]);
    yScales[label_idx["流局聴牌率"]] = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    xScales[label_idx["立直和了"]] = d3.scaleLinear().domain([0, 0.7]).range([0, width]);
    yScales[label_idx["立直和了"]] = d3.scaleLinear().domain([0, 0.7]).range([height, 0]);

    xScales[label_idx["立直収支"]] = d3.scaleLinear().domain([2000, 5000]).range([0, width]);
    yScales[label_idx["立直収支"]] = d3.scaleLinear().domain([2000, 5000]).range([height, 0]);

    xScales[label_idx["立直収入"]] = d3.scaleLinear().domain([5000, 10000]).range([0, width]);
    yScales[label_idx["立直収入"]] = d3.scaleLinear().domain([5000, 10000]).range([height, 0]);

    xScales[label_idx["立直支出"]] = d3.scaleLinear().domain([5000, 10000]).range([0, width]);
    yScales[label_idx["立直支出"]] = d3.scaleLinear().domain([5000, 10000]).range([height, 0]);

    xScales[label_idx["先制率"]] = d3.scaleLinear().domain([0.6, 1]).range([0, width]);
    yScales[label_idx["先制率"]] = d3.scaleLinear().domain([0.6, 1]).range([height, 0]);

    xScales[label_idx["和了巡数"]] = d3.scaleLinear().domain([10, 14]).range([0, width]);
    yScales[label_idx["和了巡数"]] = d3.scaleLinear().domain([10, 14]).range([height, 0]);

    xScales[label_idx["平均和了"]] = d3.scaleLinear().domain([5000, 9000]).range([0, width]);
    yScales[label_idx["平均和了"]] = d3.scaleLinear().domain([5000, 9000]).range([height, 0]);

    xScales[label_idx["和了時立直率"]] = d3.scaleLinear().domain([0.15, 0.8]).range([0, width]);
    yScales[label_idx["和了時立直率"]] = d3.scaleLinear().domain([0.15, 0.8]).range([height, 0]);

    xScales[label_idx["和了時副露率"]] = d3.scaleLinear().domain([0.15, 0.8]).range([0, width]);
    yScales[label_idx["和了時副露率"]] = d3.scaleLinear().domain([0.15, 0.8]).range([height, 0]);

    xScales[label_idx["和了時ダマ率"]] = d3.scaleLinear().domain([0, 0.5]).range([0, width]);
    yScales[label_idx["和了時ダマ率"]] = d3.scaleLinear().domain([0, 0.5]).range([height, 0]);

    xScales[label_idx["和了率"]] = d3.scaleLinear().domain([0.1, 0.35]).range([0, width]);
    yScales[label_idx["和了率"]] = d3.scaleLinear().domain([0.1, 0.35]).range([height, 0]);

    xScales[label_idx["放銃率"]] = d3.scaleLinear().domain([0.05, 0.25]).range([0, width]);
    yScales[label_idx["放銃率"]] = d3.scaleLinear().domain([0.05, 0.25]).range([height, 0]);

    xScales[label_idx["副露率"]] = d3.scaleLinear().domain([0, 0.8]).range([0, width]);
    yScales[label_idx["副露率"]] = d3.scaleLinear().domain([0, 0.8]).range([height, 0]);

    xScales[label_idx["追っかけ率"]] = d3.scaleLinear().domain([0, 0.4]).range([0, width]);
    yScales[label_idx["追っかけ率"]] = d3.scaleLinear().domain([0, 0.4]).range([height, 0]);

    xScales[label_idx["立直巡目"]] = d3.scaleLinear().domain([7, 12]).range([0, width]);
    yScales[label_idx["立直巡目"]] = d3.scaleLinear().domain([7, 12]).range([height, 0]);

    xScales[label_idx["立直良形"]] = d3.scaleLinear().domain([0.2, 0.7]).range([0, width]);
    yScales[label_idx["立直良形"]] = d3.scaleLinear().domain([0.2, 0.7]).range([height, 0]);

    xScales[label_idx["放銃時副露率"]] = d3.scaleLinear().domain([0, 1]).range([0, width]);
    yScales[label_idx["放銃時副露率"]] = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    xScales[label_idx["副露後和了率"]] = d3.scaleLinear().domain([0.2, 0.4]).range([0, width]);
    yScales[label_idx["副露後和了率"]] = d3.scaleLinear().domain([0.2, 0.4]).range([height, 0]);

    xScales[label_idx["銃点損失"]] = d3.scaleLinear().domain([300, 1700]).range([0, width]);
    yScales[label_idx["銃点損失"]] = d3.scaleLinear().domain([300, 1700]).range([height, 0]);

    xScales[label_idx["打点効率"]] = d3.scaleLinear().domain([900, 2000]).range([0, width]);
    yScales[label_idx["打点効率"]] = d3.scaleLinear().domain([900, 2000]).range([height, 0]);

    xScales[label_idx["平均放銃"]] = d3.scaleLinear().domain([4000, 7000]).range([0, width]);
    yScales[label_idx["平均放銃"]] = d3.scaleLinear().domain([4000, 7000]).range([height, 0]);

    xScales[label_idx["一発率"]] = d3.scaleLinear().domain([0.05, 0.4]).range([0, width]);
    yScales[label_idx["一発率"]] = d3.scaleLinear().domain([0.05, 0.4]).range([height, 0]);

    xScales[label_idx["裏ドラ率"]] = d3.scaleLinear().domain([0.18, 0.5]).range([0, width]);
    yScales[label_idx["裏ドラ率"]] = d3.scaleLinear().domain([0.18, 0.5]).range([height, 0]);

    xScales[label_idx["副露後和了率"]] = d3.scaleLinear().domain([0.15, 0.45]).range([0, width]);
    yScales[label_idx["副露後和了率"]] = d3.scaleLinear().domain([0.15, 0.8]).range([height, 0]);

    let timerId;
    let draw_mode = 0;

    const svg = d3
        .select("body")
        .append("svg")
        .attr("width", width * 2)
        .attr("height", height * 2);

    const position = (p) => {
        p.attr("cx", (d) => {
            // console.log(d, i) // debug
            return xScales[xidx](d[xidx]) + offset_x
        })
            .attr("cy", (d) => yScales[yidx](d[yidx]) + offset_y)
            .attr("r", 3);
    };

    // let xAxis = d3.axisBottom(xScales[xidx]);
    // let yAxis = d3.axisLeft(yScales[yidx]);

    const drawGraph = () => {
        svg.selectAll("text").remove();
        svg.selectAll(".circle").remove();
        svg.selectAll("g").remove();
        svg.selectAll("line").remove();
        svg.selectAll("rect").remove();

        let xAxis = d3.axisBottom(xScales[xidx]);
        let yAxis = d3.axisLeft(yScales[yidx]);

        svg.append("g")
            .attr("class", "xAxis")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("transform", `translate(${offset_x},${height + offset_y})`)
            .call(xAxis);
        svg.append("g")
            .attr("class", "yAxis")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("transform", `translate(${offset_x},${offset_y})`)
            .call(yAxis);

        svg.selectAll("g")
            .selectAll("text")
            .attr("fill", "black")
            .attr("stroke", "none");

        let xGrid = d3.axisBottom(xScales[xidx]).tickSize(-height).tickFormat("");
        let yGrid = d3.axisLeft(yScales[yidx]).tickSize(-width).tickFormat("");

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(${offset_x},${height + offset_y})`)
            .call(xGrid);
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(${offset_x},${offset_y})`)
            .call(yGrid);

        let offset_x_ave = (colormode === 0) ? xScales[xidx](data_rank_ave[rank][xidx]) : xScales[xidx](data_rating_ave[rating][xidx]);
        let offset_y_ave = (colormode === 0) ? yScales[yidx](data_rank_ave[rank][yidx]) : yScales[yidx](data_rating_ave[rating][yidx]);

        let xAveValue = (colormode === 0) ? data_rank_ave[rank][xidx] : data_rating_ave[rating][xidx];
        let yAveValue = (colormode === 0) ? data_rank_ave[rank][yidx] : data_rating_ave[rating][yidx];

        // x軸に平行な直線
        svg.append("line")
            .attr("class", "grid-line")
            .attr("x1", offset_x)  // 直線の始点 x 座標
            .attr("y1", offset_y_ave + offset_y)  // 直線の始点 y 座標
            .attr("x2", width + offset_x)  // 直線の終点 x 座標
            .attr("y2", offset_y_ave + offset_y)  // 直線の終点 y 座標
            .attr("stroke", "magenta")
            .attr("stroke-width", 3)
            .attr("stroke-dasharray", "2");  // グリッド線を点線にする場合
        // y軸に平行な直線
        svg.append("line")
            .attr("class", "grid-line")
            .attr("x1", offset_x_ave + offset_x)  // 直線の始点 x 座標
            .attr("y1", offset_y)  // 直線の始点 y 座標
            .attr("x2", offset_x_ave + offset_x )  // 直線の終点 x 座標
            .attr("y2", height + offset_y)  // 直線の終点 y 座標
            .attr("stroke", "magenta")
            .attr("stroke-width", 3)
            .attr("stroke-dasharray", "2");  // グリッド線を点線にする場合

        if (draw_mode !== 1){
            svg.append("text")
                .attr("class", "ave_x")
                .attr("text-anchor", "end")
                .attr("x", offset_x_ave + 55 + offset_x)
                .attr("y", offset_y + 30)
                .attr("fill", "magenta")
                .text(`${Number(xAveValue).toPrecision(3)}`);
        
            svg.append("text")
                .attr("class", "ave_y")
                .attr("text-anchor", "end")
                .attr("x", width + offset_x)
                .attr("y", offset_y_ave + 25 + offset_y)
                .attr("fill", "magenta")
                .text(`${Number(yAveValue).toPrecision(3)}`);
        }
        
        if (preset_idx > 0 && draw_mode === 1){
            // 長方形の位置とサイズを指定
            rect_info = rect_information();

            let rectX0 = rect_info[0][0];
            let rectY0 = rect_info[0][1];
            let rectWidth0 = rect_info[0][2];
            let rectHeight0 = rect_info[0][3];

            let rectX1 = rect_info[1][0];
            let rectY1 = rect_info[1][1];
            let rectWidth1 = rect_info[1][2];
            let rectHeight1 = rect_info[1][3];

            createGradient(svg, "gra1", 0, 0);
            createGradient(svg, "gra2", 0, 1);
            createGradient(svg, "gra3", 1, 0);
            createGradient(svg, "gra4", 1, 1);
            createGradient(svg, "gra5", 2, 0);
            createGradient(svg, "gra6", 2, 1);
            createGradient(svg, "gra7", 3, 0);
            createGradient(svg, "gra8", 3, 1);

            preset_info_array = [
                null,
                [1,2,3,6],
                [1,2,3,6],
                [0,3,2,7],
                [0,3,2,7],
                [1,2,3,6],
                [0,3,2,7],
                [1,2,4,5],
                [0,3,1,8],
                [0,3,2,7]
            ];

            function createGradient(svg, id, p, c) {
                gradient_tmp = svg.append("defs")
                    .append("linearGradient")
                    .attr("id", id);
                if (p === 0){
                    gradient_tmp
                    // 左上濃い
                        .attr("x1", "100%")
                        .attr("y1", "100%")
                        .attr("x2", "0%")
                        .attr("y2", "0%");
                }else if (p === 1){
                    gradient_tmp
                    // 右上濃い
                        .attr("x1", "0%")
                        .attr("y1", "100%")
                        .attr("x2", "100%")
                        .attr("y2", "0%");
                }else if (p === 2){
                    gradient_tmp
                    //　左下濃い
                        .attr("x1", "100%")
                        .attr("y1", "0%")
                        .attr("x2", "0%")
                        .attr("y2", "100%");
                }else{
                    gradient_tmp
                    // 右下濃い
                        .attr("x1", "0%")
                        .attr("y1", "0%")
                        .attr("x2", "100%")
                        .attr("y2", "100%");
                }
                // グラデーションストップを追加
                gradient_tmp.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", "white")
                    .attr("stop-opacity", 0.2);
                
                if (c===0){
                    gradient_tmp.append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", "red")
                        .attr("stop-opacity", 0.4);
                } else if (c===1){
                    gradient_tmp.append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", "blue")
                        .attr("stop-opacity", 0.4);
                } else if (c===2){
                    gradient_tmp.append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", "yellow")
                        .attr("stop-opacity", 0.7);
                }
                return gradient_tmp
            }
            
            rectX0 = rect_info[preset_info_array[preset_idx][0]][0];
            rectY0 = rect_info[preset_info_array[preset_idx][0]][1];
            rectWidth0 = rect_info[preset_info_array[preset_idx][0]][2];
            rectHeight0 = rect_info[preset_info_array[preset_idx][0]][3];

            rectX1 = rect_info[preset_info_array[preset_idx][1]][0];
            rectY1 = rect_info[preset_info_array[preset_idx][1]][1];
            rectWidth1 = rect_info[preset_info_array[preset_idx][1]][2];
            rectHeight1 = rect_info[preset_info_array[preset_idx][1]][3];

            const rectX_leftup = rect_info[0][0];
            const rectY_leftup = rect_info[0][1];
            const rectWidth_leftup = rect_info[0][2];
            const rectHeight_leftup = rect_info[0][3];

            const rectX_rightup = rect_info[1][0];
            const rectY_rightup = rect_info[1][1];
            const rectWidth_rightup = rect_info[1][2];
            const rectHeight_rightup = rect_info[1][3];

            createGradient(svg, "gra9", 0, 2);
            createGradient(svg, "gra10", 1, 2);
                
            
            // 長方形を描画し、線形グラデーションを適用
            svg.append("rect")
                .attr("x", rectX0)
                .attr("y", rectY0)
                .attr("width", rectWidth0)
                .attr("height", rectHeight0)
                .attr("fill", "url(#gra" + preset_info_array[preset_idx][2] + ")");

            svg.append("rect")
                .attr("x", rectX1)
                .attr("y", rectY1)
                .attr("width", rectWidth1)
                .attr("height", rectHeight1)
                .attr("fill", "url(#gra" + preset_info_array[preset_idx][3] + ")");

            if (preset_idx===1 || preset_idx===2){
                svg.append("rect")
                    .attr("x", rectX_leftup)
                    .attr("y", rectY_leftup)
                    .attr("width", rectWidth_leftup)
                    .attr("height", rectHeight_leftup)
                    .attr("fill", "url(#gra9)");
                svg.append("text")
                    .attr("class", "rect_left_tuyo")
                    .attr("text-anchor", "start")
                    .attr("x", offset_x + 30)
                    .attr("y", offset_y + 60)
                    .attr("fill", "black")
                    .style("font-family", "Arial, sans-serif") 
                    .style("font-size", "36px")  
                    .style("font-weight", "bold")
                    .text("ツワモノ");
            }
            if (preset_idx===3 || preset_idx===4 || preset_idx===6 || preset_idx===8 || preset_idx===9){
                svg.append("rect")
                    .attr("x", rectX_rightup)
                    .attr("y", rectY_rightup)
                    .attr("width", rectWidth_rightup)
                    .attr("height", rectHeight_rightup)
                    .attr("fill", "url(#gra10)");
                svg.append("text")
                    .attr("class", "rect_rightup")
                    .attr("text-anchor", "end")
                    .attr("x", offset_x + width - 30)
                    .attr("y", offset_y + 60)
                    .attr("fill", "black")
                    .style("font-family", "Arial, sans-serif") 
                    .style("font-size", "36px")  
                    .style("font-weight", "bold")
                    .text("ツワモノ");
            }
            
            
            // 右上
            if (preset_info_array[preset_idx][0] === 1){
                svg.append("text")
                    .attr("class", "rect_rightup")
                    .attr("text-anchor", "end")
                    .attr("x", offset_x + width - 30)
                    .attr("y", offset_y + 60)
                    .attr("fill", "black")
                    .style("font-family", "Arial, sans-serif") 
                    .style("font-size", "36px")  
                    .style("font-weight", "bold")
                    .text(function() {
                        if (preset_idx===1 || preset_idx===2){
                            return "攻撃型";
                        }else if (preset_idx===5){
                            return "守備力低";
                        }else if (preset_idx===7){
                            return "豪運";
                        }
                    });
            }
            
            // 右下
            if (preset_info_array[preset_idx][1] === 3){
                svg.append("text")
                    .attr("class", "rect_rightdown")
                    .attr("text-anchor", "end")
                    .attr("x", offset_x + width - 30)
                    .attr("y", offset_y + height - 30)
                    .attr("fill", "black")
                    .style("font-family", "Arial, sans-serif") 
                    .style("font-size", "36px")  
                    .style("font-weight", "bold")
                    .text(function() {
                        if (preset_idx===3 || preset_idx===6){
                            return "鳴き多め";
                        }else if (preset_idx===4){
                            return "速度重視";
                        }else if (preset_idx===8){
                            return "鳴き注意";
                        }else if (preset_idx===9){
                            return "愚形即リー多";
                        }
                    });
            }
            
            // 左上
            if (preset_info_array[preset_idx][0] === 0){
                svg.append("text")
                    .attr("class", "rect_leftup")
                    .attr("text-anchor", "start")
                    .attr("x", offset_x + 30)
                    .attr("y", offset_y + 60)
                    .attr("fill", "black")
                    .style("font-family", "Arial, sans-serif") 
                    .style("font-size", "36px")  
                    .style("font-weight", "bold")
                    .text(function() {
                        if (preset_idx===3 || preset_idx===6){
                            return "門前多め";
                        }else if (preset_idx===4){
                            return "打点重視";
                        }else if (preset_idx===8){
                            return "遠い鳴き多";
                        }else if (preset_idx===9){
                            return "良形好き";
                        }
                    });
            }   
            // 左下
            if (preset_info_array[preset_idx][1] === 2){
                svg.append("text")
                    .attr("class", "rect_leftdown")
                    .attr("text-anchor", "start")
                    .attr("x", offset_x + 30)
                    .attr("y",  offset_y + height - 30)
                    .attr("fill", "black")
                    .style("font-family", "Arial, sans-serif") 
                    .style("font-size", "36px")  
                    .style("font-weight", "bold")
                    .text(function() {
                        if (preset_idx===1 || preset_idx===2){
                            return "守備型";
                        }else if (preset_idx===5){
                            return "守備力高";
                        }else if (preset_idx===7){
                            return "不幸";
                        }
                    });
            }
            
        }
        preset_idx = 0;
        
        function rect_information() {
            const rect_info = [];
            const x_tmp = [offset_x + 20, offset_x_ave + offset_x - 20, offset_x_ave + offset_x + 20, width + offset_x - 20];
            const y_tmp = [offset_y + 20, offset_y_ave + offset_y - 20, offset_y_ave + offset_y + 20, height + offset_y - 20];
            for (let i=0; i<4; i++){
                if (i%2 === 0){
                    rectX_tmp = x_tmp[0];
                    rectY_tmp = y_tmp[i];
                    rectWidth_tmp = x_tmp[1] - x_tmp[0];
                    rectHeight_tmp = y_tmp[i+1] - y_tmp[i];
                } else {
                    rectX_tmp = x_tmp[2];
                    rectY_tmp = y_tmp[i-1];
                    rectWidth_tmp = x_tmp[3] - x_tmp[2];
                    rectHeight_tmp = y_tmp[i] - y_tmp[i-1];
                }
                rect_info.push([rectX_tmp,rectY_tmp,rectWidth_tmp,rectHeight_tmp]);
            }
            return rect_info
        }  

        const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute");

        const circle = svg
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .style("opacity", (d) => {
                return (d[label_idx["rank"]] & rank) && (d[label_idx["rating"]] & rating) ? 1 : 0;
            })
            .style("fill", (d) => {
                if (colormode == 0) {
                    if (d[label_idx["rank"]] == 1) {
                        return "orange";
                    }
                    if (d[label_idx["rank"]] == 2) {
                        return "red";
                    }
                    if (d[label_idx["rank"]] == 4) {
                        return "cyan";
                    }
                }
                if (colormode == 1) {
                    if (d[label_idx["rating"]] == 1) {
                        return "yellow";
                    }
                    if (d[label_idx["rating"]] == 2) {
                        return "orange";
                    }
                    if (d[label_idx["rating"]] == 4) {
                        return "red";
                    }
                    if (d[label_idx["rating"]] == 8) {
                        return "cyan";
                    }
                }
            })
            .attr("stroke", "black")
            .call(position)
            .on("mouseover", (event, d) => {
                if ((d[label_idx["rank"]] & rank) && (d[label_idx["rating"]] & rating)) {
                    clearTimeout(timerId);
                    timerId = setTimeout(() => {
                        const [x, y] = d3.pointer(event);
                        tooltip.transition().duration(100).style("opacity", 0.9);
                        tooltip.html(`<strong>${idx_label[xidx]}: ${Number(d[xidx]).toPrecision(3)}<br>${idx_label[yidx]}: ${Number(d[yidx]).toPrecision(3)}</strong><br>`)
                            .style("left", "710px")
                            .style("top", "300px")
                            .style("background-color", "white");

                        circle.transition()
                            .style("fill-opacity", other => other === d ? 1.0 : 0.2)
                            .style("stroke-opacity", other => other === d ? 1.0 : 0)
                            .attr("r", other => other === d ? 10 : 3);
                        d3.select(event.currentTarget).raise();
                    }, 500);
                }
            })
            .on('mouseout', (event) => {
                clearTimeout(timerId);
                circle.attr("r", 3);
                tooltip.transition().duration(100).style('opacity', 0);
                if (draw_mode) {
                    circle.transition().style("fill-opacity", 0.5).style("stroke-opacity", 0);
                } else {
                    circle.transition().style("fill-opacity", 1.0).style("stroke-opacity", 1.0);
                }
            });
        circle
            .filter((d) => !(d[label_idx["rank"]] & rank) || !(d[label_idx["rating"]] & rating))
            .remove();

        if (draw_mode) {
            circle.transition()
                .style("fill", "gray")
                .style("fill-opacity", 0.3)
                .style("stroke-opacity", 0)
                .attr("r", 3);
            const circle_cur = svg
                .selectAll(".newCircle") // 以前に作成した新しい円のクラス名を指定
                .data(data_currentplayer)
                .enter()
                .append("circle")
                .attr("class", "circle newCircle"); // 新しいクラスを追加
            circle_cur
                .style("fill", 'blue')
                .attr("stroke", "black")
                .call(position)
                .attr("r", 15) // 新しい円の半径を設定
                .style("fill", (d, i) => getColor(i))
                .on("mouseover", (event, d, i) => {
                    clearTimeout(timerId);
                    timerId = setTimeout(() => {
                        // マウスが円に入ったときの処理
                        tooltip.transition().duration(100).style("opacity", 0.9);
                        tooltip.html(`<strong>名前: ${d[label_idx["name"]]}<br>${idx_label[xidx]}: ${Number(d[xidx]).toPrecision(3)}<br>${idx_label[yidx]}: ${Number(d[yidx]).toPrecision(3)}</strong><br>`)
                            .style("left", "710px")
                            .style("top", "300px")
                            .style("background-color", "white");

                        circle.transition()
                            .style("fill-opacity", 0.1)
                            .style("stroke-opacity", 0)
                            .attr("r", 3);
                    }, 500)
                })
                .on("mouseout", () => {
                    // マウスが円から出たときの処理
                    clearTimeout(timerId);
                    circle.attr("r", 3);
                    tooltip.transition().duration(100).style('opacity', 0);
                    circle.transition().style("fill-opacity", 0.3).style("stroke-opacity", 0);
                });

        }
        function getColor(i) {
            if (i === 0) {
                return "red";
            } else if (i === 1) {
                return "blue";
            } else if (i === 2) {
                return "green";
            } else if (i === 3) {
                return "yellow";
            }
        }
        // drawdata()
        // draw_data_cur()
    };

    drawGraph();

    // 軸設定用のDropdown //ここから
    const option_dropdown = [...Array(column - 4)].map((_, i) => idx_label[i + 4]);

    const colors_rank = {
        '金の間': 'orange',
        '玉の間': 'red',
        '王座の間': 'cyan'
    }

    const colors_rating = {
        '雀傑': 'yellow',
        '雀豪': 'orange',
        '雀聖': 'red',
        '魂天': 'cyan',
    }

    // 横軸
    const dropdown_x = d3.select("body")
        .append("select")
        .attr("id", "dropdown_x")

    dropdown_x.selectAll("option")
        .data(option_dropdown)
        .enter()
        .append("option")
        .text(function (d) { return d; });

    dropdown_x.style("position", "absolute")
        .style("left", `${offset_x + 475}px`)  // 左からの位置
        .style("top", `${offset_y + 580}px`);   // 上からの位置

    dropdown_x.on("change", function () {
        const selectedOption = d3.select(this).property("value");
        xidx = label_idx[selectedOption];
        xAxis = d3.axisBottom(xScales[xidx]);
        dropdown_preset.property('value', "選択してください");
        drawGraph();
    });

    // 縦軸
    const dropdown_y = d3.select("body")
        .append("select")
        .attr("id", "dropdown_y")

    dropdown_y.selectAll("option")
        .data(option_dropdown)
        .enter()
        .append("option")
        .text(function (d) { return d; });

    dropdown_y.style("position", "absolute")
        .style("left", `${offset_x + 10}px`)  // 左からの位置
        .style("top", `${offset_y + 5}px`);   // 上からの位置

    dropdown_y.on("change", function () {
        const selectedOption = d3.select(this).property("value");
        yidx = label_idx[selectedOption];
        yAxis = d3.axisLeft(yScales[yidx]);
        dropdown_preset.property('value', "選択してください");
        drawGraph();
    });

    // default
    dropdown_x.property('value', "放銃率");
    dropdown_y.property('value', "和了率");

    let data_preset = ["選択してください", "和了率-放銃率", "打点効率-銃点損失", "立直率-副露率", "平均和了-和了率", "平均放銃-放銃率", "和了時ダマ率-和了時副露率", "一発率-裏ドラ率", "副露率-副露後和了率", "立直良形-立直率"]; //ここにプリセットを追加

    // ドロップダウンとラベルを格納するdivを作成
    const dropdownContainer_preset = d3.select("body")
        .append("div")
        .attr("id", "dropdownContainer_preset");

    // ラベルを追加
    dropdownContainer_preset.append("label")
        .attr("for", "dropdown_preset")
        .text("プリセット:")
        .style("margin-right", "10px");

    // ドロップダウンを追加
    const dropdown_preset = dropdownContainer_preset.append("select")
        .attr("id", "dropdown_preset");

    dropdown_preset.selectAll("option")
        .data(data_preset)
        .enter()
        .append("option")
        .text(function (d) { return d; });

    dropdownContainer_preset.style("position", "absolute")
        .style("left", "675px")  // 左からの位置
        .style("top", `${offset_y + 575}px`);  // 上からの位置

    dropdown_preset.on("change", function () {
        const selectedOption = d3.select(this).property("value");
        switch (selectedOption) {
            case "和了率-放銃率":
                xidx = label_idx["放銃率"];
                yidx = label_idx["和了率"];
                dropdown_x.property('value', "放銃率");
                dropdown_y.property('value', "和了率");
                preset_idx = 1;
                break;
            case "打点効率-銃点損失":
                xidx = label_idx["銃点損失"];
                yidx = label_idx["打点効率"];
                dropdown_x.property('value', "銃点損失");
                dropdown_y.property('value', "打点効率");
                preset_idx = 2;
                break;
            case "立直率-副露率":
                xidx = label_idx["副露率"];
                yidx = label_idx["立直率"];
                dropdown_x.property('value', "副露率");
                dropdown_y.property('value', "立直率");
                preset_idx = 3;
                break;
            case "平均和了-和了率":
                xidx = label_idx["和了率"];
                yidx = label_idx["平均和了"];
                dropdown_x.property('value', "和了率");
                dropdown_y.property('value', "平均和了");
                preset_idx = 4;
                break;
            case "平均放銃-放銃率":
                xidx = label_idx["放銃率"];
                yidx = label_idx["平均放銃"];
                dropdown_x.property('value', "放銃率");
                dropdown_y.property('value', "平均放銃");
                preset_idx = 5;
                break;
            case "和了時ダマ率-和了時副露率":
                xidx = label_idx["和了時副露率"];
                yidx = label_idx["和了時ダマ率"];
                dropdown_x.property('value', "和了時副露率");
                dropdown_y.property('value', "和了時ダマ率");
                preset_idx = 6;
                break;
            case "一発率-裏ドラ率":
                xidx = label_idx["裏ドラ率"];
                yidx = label_idx["一発率"];
                dropdown_x.property('value', "裏ドラ率");
                dropdown_y.property('value', "一発率");
                preset_idx = 7;
                break;
            case "副露率-副露後和了率":
                xidx = label_idx["副露後和了率"];
                yidx = label_idx["副露率"];
                dropdown_x.property('value', "副露後和了率");
                dropdown_y.property('value', "副露率");
                preset_idx = 8;
                break;
            case "立直良形-立直率":
                xidx = label_idx["立直率"];
                yidx = label_idx["立直良形"];
                dropdown_x.property('value', "立直率");
                dropdown_y.property('value', "立直良形");
                preset_idx = 9;
                break;
            //　ここに追加
        }
        xAxis = d3.axisBottom(xScales[xidx]);
        yAxis = d3.axisLeft(yScales[yidx]);
        drawGraph();
    });
    // 軸設定用のDropdown // ここまで


    // 間を設定するボタン // ここから
    const checkboxDiv_color = d3.select("body")
        .append("div")
        .attr("class", "checkboxDiv_color")
        .style("position", "absolute")
        .style("top", "200px")
        .style("left", "790px")
        .style("transform", "translateX(-50%)")
        .style("display", "flex");


    let checkboxStates_color = {
        "間": true,
        "ランク": false,
    };

    ["間", "ランク"].forEach((dataType) => {
        let checkboxWrapper = checkboxDiv_color.append("div")
            .style("margin-right", "50px");  // チェックボックス同士の間隔を開ける

        checkboxWrapper.append("input")
            .attr("type", "radio")
            .attr("name", "room_type")
            .property("checked", checkboxStates_color[dataType])
            .on("change", function () {
                Object.keys(checkboxStates_color).forEach(key => {
                    checkboxStates_color[key] = false;
                });
                checkboxStates_color[dataType] = !checkboxStates_color[dataType];
                d3.select(this).property("checked", checkboxStates_color[dataType]);
                if (dataType === "間") {
                    colormode = 0;
                }
                else if (dataType === "ランク") {
                    colormode = 1;
                }
                let circles = d3.selectAll('circle');
                circles.each(function () {
                    const circle = d3.select(this);
                    const type = circle.attr('data-type');
                    if (draw_mode === 0){
                        if (type == "金の間" || type == "玉の間" || type == "王座の間") {
                            circle.style('fill', () => (colormode == 0) ? colors_rank[type] : "gray");
                        }                    
                        if (type == "雀傑" || type == "雀豪" || type == "雀聖" || type == "魂天") {
                            circle.style('fill', () => (colormode == 1) ? colors_rating[type] : "gray");
                        }
                    } else{
                        circle.style('fill',"gray");
                    }   
                });
                drawGraph();
            });
        checkboxWrapper.append("label").text(dataType);
    });

    const label_color = d3.select("body")
        .append("text")
        .attr("id", "label_color")

    label_color.style("position", "absolute")
        .style("left", "730px")
        .style("top", "170px")
        .style("font-size", "16px")
        .style("fill", "black")
        .style("text-anchor", "middle")
        .text("色分け設定");



    const checkboxDiv_rank = d3.select("body")
        .append("div")
        .attr("class", "checkboxes_rank")
        .style("position", "absolute")
        .style("top", "50px")
        .style("left", "725px")
        .style("transform", "translateX(-50%)");

    let checkboxStates_rank = {
        "金の間": true,
        "玉の間": true,
        "王座の間": true
    };

    ["金の間", "玉の間", "王座の間"].forEach((dataType) => {
        let checkboxWrapper = checkboxDiv_rank.append("div");

        checkboxWrapper.append("input")
            .attr("type", "checkbox")
            .property("checked", checkboxStates_rank[dataType])
            .on("change", function () {
                checkboxStates_rank[dataType] = !checkboxStates_rank[dataType];
                d3.select(this).property("checked", checkboxStates_rank[dataType]);
                if (dataType === "金の間") {
                    rank ^= 1;
                }
                else if (dataType === "玉の間") {
                    rank ^= 2;
                }
                else if (dataType === "王座の間") {
                    rank ^= 4;
                }
                drawGraph();
            });

        checkboxWrapper.append("label")
            .text(dataType);


        let svg = checkboxWrapper.append('svg')
            .attr('width', 60)
            .attr('height', 20);

        svg.append('circle')
            .attr('cx', () => {
                if (dataType === "王座の間") {
                    return 15;
                }
                else {
                    return 31;
                }
            })
            .attr('cy', 10)
            .attr('r', 4)
            .style('fill', () => (colormode == 0) ? colors_rank[dataType] : "gray")
            .attr('data-type', dataType)
            .attr("stroke", "black");
    });

    const checkboxDiv_rating = d3.select("body")
        .append("div")
        .attr("class", "checkboxes_rating")
        .style("position", "absolute")
        .style("top", "50px")
        .style("left", "825px")
        .style("transform", "translateX(-50%)");

    let checkboxStates_rating = {
        "雀傑": true,
        "雀豪": true,
        "雀聖": true,
        "魂天": true
    };

    ["雀傑", "雀豪", "雀聖", "魂天"].forEach((dataType) => {
        let checkboxWrapper = checkboxDiv_rating.append("div");

        checkboxWrapper.append("input")
            .attr("type", "checkbox")
            .property("checked", checkboxStates_rating[dataType])
            .on("change", function () {
                checkboxStates_rating[dataType] = !checkboxStates_rating[dataType];
                d3.select(this).property("checked", checkboxStates_rating[dataType]);
                if (dataType === "雀傑") {
                    rating ^= 1;
                }
                else if (dataType === "雀豪") {
                    rating ^= 2;
                }
                else if (dataType === "雀聖") {
                    rating ^= 4;
                }
                else if (dataType === "魂天") {
                    rating ^= 8;
                }
                drawGraph();
            });

        checkboxWrapper.append("label")
            .text(dataType);


        let svg = checkboxWrapper.append('svg')
            .attr('width', 60)
            .attr('height', 20);

        svg.append('circle')
            .attr('cx', 15)
            .attr('cy', 10)
            .attr('r', 4)
            .style('fill', () => (colormode == 1) ? colors_rating[dataType] : "gray")            
            .attr('data-type', dataType)
            .attr("stroke", "black");

    });

    const label_filter = d3.select("body")
        .append("text")
        .attr("id", "label_filter")

    label_filter.style("position", "absolute")
        .style("left", "740px")
        .style("top", "20px")
        .style("font-size", "16px")
        .style("fill", "black")
        .style("text-anchor", "middle")
        .text("フィルタ");


    // 右側
    const right_container = d3.select("#right-container")
        .style("position", "absolute")
        .style("top", `${1080 * 0.01}px`) // 35% of 1080px
        .style("left", `${1920 * 0.5}px`) // 1% of 1920px
        .style("width", `${1920 * 0.50}px`) // 50% of 1920px
        .style("height", `${1080 * 0.60}px`); // 60% of 1080px

    const width_right = right_container.node().getBoundingClientRect().width;
    const height_right = right_container.node().getBoundingClientRect().height;
    const imageWidth = 250;
    const imageHeight = 250;

    const svg_right = right_container.append("svg")
        .attr("width", width_right)
        .attr("height", height_right);

    const image = svg_right.append('image')
        .attr('xlink:href', 'images/jantaku.png') // update this with the path to your image
        .attr('width', imageWidth)
        .attr('height', imageHeight)
        // Position the image in the middle of the container
        .attr('transform', `translate(${(width_right - imageWidth) / 2 - 170}, ${(height_right - imageHeight) / 2})`);

    const positions_player = [
        { class: "対面", x: width_right / 2 - 240, y: height_right / 2 - 200 },
        { class: "自家", x: width_right / 2 - 240, y: height_right / 2 + 200 },
        { class: "上家", x: width_right / 2 - 500, y: height_right / 2 - 15 },
        { class: "下家", x: width_right / 2, y: height_right / 2 - 15 }
    ];

    const backgroundColors = {
        "対面": "green",
        "自家": "red",
        "上家": "yellow",
        "下家": "blue"
    };

    positions_player.forEach((position) => {
        // Add the input field
        right_container.append("input")
            .style("position", "absolute")
            .style("left", `${position.x}px`)
            .style("top", `${position.y}px`)
            .style("width", "150px")
            .style("height", "30px")
            .style("border-radius", "5px")
            .style("border", "3px solid black")
            .attr("class", `input-field ${position.class}`)
            .attr("placeholder", position.class);

        // Add the colored circle next to the input field
        right_container.append('div')
            .style("position", "absolute")
            .style("left", `${position.x - 30}px`) // adjust these values according to the placement of the circle
            .style("top", `${position.y + 2}px`) // adjust these values according to the placement of the circle
            .style("width", "25px")
            .style("height", "25px")
            .style("border-radius", "50%")
            .style("background-color", backgroundColors[position.class])
            .style("border", "2px solid black");
    });

    // データ入力欄
    const pos_x = width_right / 2 + 285;

    const dropdownContainer_position = right_container
        .append("div")
        .attr("id", "dropdownContainer_position")
        .style("position", "absolute")
        .style("left", `${pos_x - 70}px`)  // 左からの位置
        .style("top", "80px")  // 上からの位置
        .style("display", "none");

    dropdownContainer_position.append("label")
        .attr("for", "dropdown_position")
        .text("プレイヤー")
        .style("font-size", "12px")
        .style("margin-right", "15px")

    const dropdown_position = dropdownContainer_position.append("select")
        .attr("id", "dropdown_position")
        .selectAll("option")
        .data(idx_pos)
        .enter()
        .append("option")
        .text(function (d) { return d; });

    const positions_paramator = [
        { class: "和了率", x: pos_x, y: 130 },
        { class: "ツモ率", x: pos_x, y: 180 },
        { class: "放銃率", x: pos_x, y: 230 },
        { class: "副露率", x: pos_x, y: 280 },
        { class: "立直率", x: pos_x, y: 330 },
        { class: "平均和了", x: pos_x, y: 380 },
        { class: "和了巡数", x: pos_x, y: 430 },
    ];

    function addLabel(element, position, labelText) {
        element.append("label")
            .style("position", "absolute")
            .style("left", `${position.x - 70}px`)
            .style("top", `${position.y + 2}px`)
            .style("display", "none")
            .style("font-size", fontSize)
            .text(labelText)
            .attr("class", `label-input-field ${position.class}`);
    }

    const fontSize = "12px";
    positions_paramator.forEach((position) => {
        right_container.append("input")
            .style("position", "absolute")
            .style("left", `${position.x}px`)
            .style("top", `${position.y}px`)
            .style("width", "70px")
            .style("display", "none")
            .attr("class", `input-field ${position.class}`)
            .attr("placeholder", position.class);
        addLabel(right_container, position, position.class, fontSize);
    });

    const button_submit = right_container.append("button")
        .text("登録")
        .attr("id", "button_submit")
        .style("position", "absolute")
        .style("left", `${pos_x - 30}px`)
        .style("top", `${480}px`)
        .style("display", "none")
        .on("click", submit);

    function submit() {
        var dropdown = document.getElementById("dropdown_position");
        var pos = dropdown.value;
        var idx = pos_idx[pos];

        const positions_paramator = ["和了率", "ツモ率", "放銃率", "副露率", "立直率", "平均和了", "和了巡数"];
        positions_paramator.forEach((cls) => {
            var input = document.querySelector(`.input-field.${cls}`);
            if (input.value != "" && Number(input.value) != NaN) {
                val = Number(input.value);
                if (cls != "平均和了" && cls != "和了巡数") val /= 100;
                data_currentplayer[idx][label_idx[cls]] = val;
            }
            input.value = "";
        });
        dropdown.value = "自家";
        draw_mode = 1;
        drawGraph();
        show_button_allclear();

    }

    let allHidden = 1;

    const text_toggleTextbox = right_container.append("p")
        .text("▶ データ入力")
        .style("position", "absolute")
        .style("left", `${pos_x - 60}px`)
        .style("top", `${25}px`)
        .style("cursor", "pointer")
        .on("click", function () {
            allHidden = !allHidden;
            const positions_paramator = ["和了率", "ツモ率", "放銃率", "副露率", "立直率", "平均和了", "和了巡数"];
            positions_paramator.forEach((cls) => {
                var input = document.querySelector(`.input-field.${cls}`);
                input.style.display = allHidden ? 'none' : 'block';
                var label = document.querySelector(`.label-input-field.${cls}`);
                label.style.display = allHidden ? 'none' : 'block';
            });

            var dropdown = document.getElementById("dropdownContainer_position");
            dropdown.style.display = allHidden ? 'none' : 'block';

            var submitButton = document.getElementById("button_submit");
            submitButton.style.display = allHidden ? 'none' : 'block';
            this.textContent = (allHidden ? "▶" : "▼") + " データ入力";
        });


    const button_runPythonCode = right_container.append("button")
        .text("データ取得")
        .style("position", "absolute")
        .style("left", `${width_right / 2 - 205}px`)
        .style("top", `${height_right / 2 - 35}px`)
        .style("width", "70px")
        .style("height", "70px")
        .style("border-radius", "5px")
        .style("background-color", "lightgray")
        .style("border", "2px solid gray")
        .style("color", "black")
        .style("font-size", "14px")
        .style("box-shadow", "5px 5px 10px rgba(0, 0, 0, 0.5)")
        .on("mousedown", () => {
            button_runPythonCode
                .style("box-shadow", "2px 2px 5px rgba(0, 0, 0, 0.5)")
                .style("transform", "translate(2px, 2px)");
        })
        .on("mouseup", () => {
            button_runPythonCode
                .style("box-shadow", "5px 5px 10px rgba(0, 0, 0, 0.5)")
                .style("transform", "translate(0, 0)");
        })
        .on("click", () => {
            button_runPythonCode
                .text("読み込み中...")
                .style("background-color", "#999999"); // クリック時の色（少し濃いめの灰色）
            runPythonCode();
        });

    function show_button_runPythonCode() {
        button_runPythonCode.style("display", "block");
    }

    function hide_button_runPythonCode() {
        button_runPythonCode.style("display", "none");
    }

    let isButtonOn = false;
    const button_display = right_container.append("button")
        .text("表示")
        .style("position", "absolute")
        .style("left", `${width_right / 2 - 205}px`)
        .style("top", `${height_right / 2 - 35}px`)
        .style("width", "70px")
        .style("height", "70px")
        .style("border-radius", "5px")
        .style("background-color", "lightgray")
        .style("border", "2px solid gray")
        .style("color", "black")
        .style("font-size", "14px")
        .style("box-shadow", "5px 5px 10px rgba(0, 0, 0, 0.5)")
        .style("display", "none")
        .on("mousedown", () => {
            button_display
                .style("box-shadow", "2px 2px 5px rgba(0, 0, 0, 0.5)")
                .style("transform", "translate(2px, 2px)");
        })
        .on("mouseup", () => {
            button_display
                .style("box-shadow", "5px 5px 10px rgba(0, 0, 0, 0.5)")
                .style("transform", "translate(0, 0)");
        })
        .on("click", toggleButton_display);

    function toggleButton_display() {
        isButtonOn = !isButtonOn;

        if (isButtonOn) {
            button_display
                .text("非表示")
                .style("background-color", "lightgreen");
            draw_mode = 0;
        } else {
            button_display
                .text("表示")
                .style("background-color", "lightgray");
            draw_mode = 1;
        }
        drawGraph();
    }

    function show_button_display() {
        button_display.style("display", "block");
    }

    function hide_button_display() {
        button_display.style("display", "none");
    }

    const button_allclear = right_container.append("button")
        .text("AC")
        .style("position", "absolute")
        .style("left", `${width_right / 2}px`)
        .style("top", `${height_right / 2 + 100}px`)
        .style("border-radius", "5px")
        .style("background-color", "lightgray")
        .style("border", "2px solid gray")
        .style("color", "black")
        .style("font-size", "14px")
        .style("box-shadow", "2px 2px 5px rgba(0, 0, 0, 0.5)")
        .style("display", "none")
        .on("mousedown", () => {
            button_allclear
                .style("box-shadow", "1px 1px 3px rgba(0, 0, 0, 0.5)")
                .style("transform", "translate(2px, 2px)");
        })
        .on("mouseup", () => {
            button_allclear
                .style("box-shadow", "2px 2px 5px rgba(0, 0, 0, 0.5)")
                .style("transform", "translate(0, 0)");
        })
        .on("click", toggleButton_allclear);

    function toggleButton_allclear() {
        for (let i = 0; i < 4; i++) {
            data_currentplayer[i] = playerdata_default.slice();
        }
        console.log(data_currentplayer);
        draw_mode = 0;
        show_button_runPythonCode();
        hide_button_display();
        hide_button_allclear();
        drawGraph();
        button_runPythonCode
            .text("データ取得")
            .style("background-color", "lightgray");
        positions_player.forEach((position) => {
            const textboxValue = d3.select(`.${position.class}`).node().value;
            if (textboxValue !== undefined) {
                d3.select(`.${position.class}`).node().value = "";
            }
        });
    }

    function show_button_allclear() {
        button_allclear.style("display", "block");
    }

    function hide_button_allclear() {
        button_allclear.style("display", "none");
    }


    // ローディングアイコンの要素を作成
    const loadingIcon = right_container.append("svg")
        .style("position", "absolute")
        .style("left", `${width_right / 2 - 192}px`)
        .style("top", `${height_right / 2 - 17}px`)
        .style("display", "none")
        .attr("width", 40)
        .attr("height", 40);

    const gradient = loadingIcon.append("defs")
        .append("linearGradient")
        .attr("id", "stroke-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("style", "stop-color:white;stop-opacity:1");

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("style", "stop-color:blue;stop-opacity:1");

    const circle = loadingIcon.append("circle")
        .attr("cx", 20)
        .attr("cy", 20)
        .attr("r", 15)
        .attr("stroke", "url(#stroke-gradient)") // 円の外枠の色
        .attr("stroke-width", 3)
        .attr("fill", "none");

    const animationDuration = 20000; // アニメーションの期間（ミリ秒）
    let animationStartTime; // アニメーション開始時刻

    // ローディングアイコンを表示する関数
    function showLoadingIcon() {
        loadingIcon.style("display", "block");
        animateLoadingIcon();
    }

    // ローディングアイコンを非表示にする関数
    function hideLoadingIcon() {
        loadingIcon.style("display", "none");
    }

    // ローディングアイコンのアニメーション関数
    function animateLoadingIcon() {
        animationStartTime = Date.now();

        function animate() {
            const currentTime = Date.now();
            const elapsed = currentTime - animationStartTime;

            const progress = (elapsed % animationDuration) / animationDuration;

            const angle = 360 * progress * 8;

            circle.attr("transform", `rotate(${angle} 20 20)`);

            if (elapsed < animationDuration) {
                requestAnimationFrame(animate);
            }
        }

        animate();
    }

    function getData_tmp(data_new) {
        const ignore_column = ["名前", "記録対戦数", "記録点数", "流局率", "飛び率", "安定段位", "点数期待", "立直流局率", "最高段位", "最高点数", "最大連荘", "痛い親かぶり率", "痛い親かぶり平均", "局収支", "平均順位", "立直放銃A", "立直放銃B", "立直収支", "立直流局", "振聴率", "立直多面", "総計局数", "調整打点効率", "ダマ率", "ツモ率", "追っかけられ率"];
        let i = 0;
        data_new.forEach(function (dat) {
            let playerdata = [];
            playerdata.push(dat['名前']);
            playerdata.push(7);
            for (let key in dat) {
                let ok = 1;
                for (let _ in ignore_column) {
                    if (key == ignore_column[_]) {
                        ok = 0;
                    }
                }
                if (!ok) continue;
                if (key == "記録段位") {
                    playerdata.push(15);
                    playerdata.push(0);
                }
                else {
                    playerdata.push(dat[key]);
                }
            }
            playerdata.forEach((value, idx) => {
                data_currentplayer[i][idx] = value;
            })
            i++;
        });
    }

    // createBottomに必要
    const key_list = make_key_list();

    async function runPythonCode() {
        try {
            // テキストボックスの値を取得
            const inputValues = {};
            positions_player.forEach((position) => {
                var inputValue = right_container.select(`.${position.class}`).property("value");
                inputValues[position.class] = inputValue;
            });
            console.log("Input values:", inputValues);
            var inputValue1 = inputValues['自家'];
            var inputValue2 = inputValues['下家'];
            var inputValue3 = inputValues['対面'];
            var inputValue4 = inputValues['上家'];

            // JSON形式に変換
            var jsonData = {
                inputs: [inputValue1, inputValue2, inputValue3, inputValue4]
            };

            showLoadingIcon();

            // Pythonコードを実行するためにサーバーに送信
            const response = await fetch('http://127.0.0.1:5000/run_python_code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),  // JSON文字列に変換して送信
            });

            const new_data = await response.json();
            const new_data_processed = processNewData(new_data, key_list);
            createBottom_(data_label, data_rank_ave, data_rank_std)(new_data_processed);
            //console.log(new_data);
            //console.log(new_data_processed);

            hideLoadingIcon();
            hide_button_runPythonCode();
            show_button_display();
            show_button_allclear();

            getData_tmp(new_data);
            // data_tmp = getData_tmp(new_data);
            draw_mode = 1;
            //console.log(data_currentplayer);
            drawGraph();
        }
        catch (error) {
            console.error('エラー:', error);
        }
    }

    // 下側
    const createBottom = data_label => data_rank_ave => data_rank_std => data => {
        const {data_ave, data_std} = processAveStd(data_label, data_rank_ave, data_rank_std);
        //console.log(data_ave);
        //console.log(data_std);
        // セレクトコンテナ
        let bottom_container = d3.select('#bottom-container')
            .style("position", "absolute")
            .style("top", "650px")
            .style("width", "1920px")
            .style("height", "270px");

        const boxes = [1, 2, 3, 4];

        bottom_container.selectAll('div').remove();

        // データに基づいてdivを作成し、boxクラスを追加
        let divs = bottom_container.selectAll('div')
            .data(boxes)
            .enter()
            .append('div')
            .style("width", "450px")
            .attr('id', (d, i) => 'box-' + i)
            .style("height", "265px")
            .style("float", "left")
            .style("border", "2px solid gray")
            .style("border-radius", "10px")
            .style("box-sizing", "border-box")
            .style("padding", "10px")
            .style("margin-left", "9px")
            .style("margin-right", "5px")
            .style("margin-bottom", "9px");


        // 最後のdivの右マージンを0に設定
        divs.filter((d, i) => i === boxes.length - 1)
            .style("margin-right", "0");
        boxes.forEach((box, i) => {
            TransitionButton(data[i], data_ave, data_std, '#box-' + i);
        });
        boxes.forEach((box, i) => {
            createPage1(data[i], '#box-' + i);
        });
    };
    const createBottom_ = (data_label, data_rank_ave, data_rank_std) => {
        return createBottom(data_label)(data_rank_ave)(data_rank_std);
    }
    //d3.csv("./data/playerdata_tmp.csv").then(createBottom_(data_rank_ave, data_rank_std));
    createBottom_(data_label,data_rank_ave, data_rank_std)([{"名前": "undefined"}, {"名前": "undefined"}, {"名前": "undefined"}, {"名前": "undefined"}])
};

const TransitionButton = (data, data_ave, data_std, container) => {
    const transition = d3.select(container)
        .append('div')
        .style('display', 'flex')
        .style('justify-content', 'space-between');

    let page = 1;
    // 左側のボタン
    transition.append('button')
        .html('<')
        .on('click', function () {
            if (data["名前"] === "undefined") {
                // do nothing
            }
            else if (page === 1) {
                d3.select(container).selectAll('svg').remove();
                createPage1(data, container);
                page = 1;
            }
            else if (page === 2) {
                d3.select(container).selectAll('svg').remove();
                createPage1(data, container);
                page = 1;
            }
            else if (page === 3) {
                d3.select(container).selectAll('svg').remove();
                createPage2(data, data_ave, data_std, container);
                page = 2;
            }
            else if (page === 4) {
                d3.select(container).selectAll('svg').remove();
                createPage3(data, container);
                page = 3;
            }
        });

    // 右側のボタン
    transition.append('button')
        .html('>')
        .on('click', function () {
            if (data["名前"] === "undefined") {
                // do nothing
            }
            else if (page === 1) {
                d3.select(container).selectAll('svg').remove();
                createPage2(data, data_ave, data_std, container);
                page = 2;
            }
            else if (page === 2) {
                d3.select(container).selectAll('svg').remove();
                createPage3(data, container);
                page = 3;
            }
            else if (page === 3) {
                d3.select(container).selectAll('svg').remove();
                createPage4(data, container);
                page = 4;
            }
            else if (page === 4) {
                d3.select(container).selectAll('svg').remove();
                createPage4(data, container);
                page = 4;
            }
        });
}

const createPage1 = (data, container) => {
    createRadar(data, container);
    createFeature(data, container);
}

const createPage2 = (data, data_ave, data_std, container) => {
    const strong_point = {};
    const weak_point = {};
    const column_ordered = ["和了率", "放銃率", "平均和了","ダマ率", "立直良形", "追っかけ率", "副露率", "和了巡数", "立直率"];
    for (const i in column_ordered) {
        const key = column_ordered[i];
        if ((data[key] === "") || (data[key] === "undefined")) {
            continue;
        }
        if (data[key] > data_ave[key] + data_std[key]) {
            if (key === "放銃率" || key === "和了巡数") {
                weak_point[key] = data[key].substr(0,5);
            }
            else {
                strong_point[key] = data[key].substr(0,5);
            }
        } 
        else if (data[key] < data_ave[key] - data_std[key]) {
            if (key === "放銃率" || key === "和了巡数") {
                strong_point[key] = data[key].substr(0,5);
            }
            else {
                weak_point[key] = data[key].substr(0,5);
            }
        } 
    }
    const svg = d3.select(container)
        .append("svg")
        .attr("width", 440)
        .attr("height", 225);

    const column = svg.append("g");
    let color;
    if (container === "#box-0") {
        color = "red"
    }
    else if (container === "#box-1") {
        color = "blue"
    }
    else if (container === "#box-2") {
        color = "green"
    }
    else if (container === "#box-3") {
        color = "yellow"
    }

    column.append("circle")
        .attr("cx", 15)
        .attr("cy", 14)
        .attr("r", 7)
        .style("fill", color)
        .style("stroke", "black")
        .style("stroke-width", 1);

    const lackdata = (data["記録対戦数"] < 50);
    column.append("text")
        .attr("x", 30) 
        .attr("y", 20)
        .attr("color", lackdata ? "red" : "black")
        .text(lackdata ? data["名前"] + "  (データ不足)" : data["名前"]);

    const column1 = svg.append("g");
    const column2 = svg.append("g");
    const column3 = svg.append("g");
    const column4 = svg.append("g");
    
    svg.append("g")
        .append("text")
        .attr("x", 30)
        .attr("y", 55)
        .text("【長所】")
        .style("font-size", "18px");
    let index = 1
    for (const key in strong_point) {
        column1.append("text")
            .attr("x", 30)
            .attr("y", index * 25 + 60) // Adjust Y position as you need
            .text(key);
        column2.append("text")
            .attr("x", 130) // Adjust X position to create a second column
            .attr("y", index * 25 + 60) // Adjust Y position as you need
            .attr("color", "blue")
            //.text(strong_point[key] + " " + data_ave[key].substr(0,5));
            .text(strong_point[key]);
        index += 1;
    }

    svg.append("g")
        .append("text")
        .attr("x", 230)
        .attr("y", 55)
        .text("【短所】")
        .style("font-size", "18px");
    index = 1
    for (const key in weak_point) {
        column3.append("text")
            .attr("x", 230)
            .attr("y", index * 25 + 60) // Adjust Y position as you need
            .text(key);
        column4.append("text")
            .attr("x", 330) // Adjust X position to create a second column
            .attr("y", index * 25 + 60) // Adjust Y position as you need
            .attr("color", "red")
            //.text(weak_point[key] + " " + data_ave[key].substr(0,5));
            .text(weak_point[key]);
        index += 1;
    }
}

const createPage3 = (data, container) => {
    const svg = d3.select(container)
        .append("svg")
        .attr("width", 440)
        .attr("height", 225);

    const column = svg.append("g");
    let color;
    if (container === "#box-0") {
        color = "red"
    }
    else if (container === "#box-1") {
        color = "blue"
    }
    else if (container === "#box-2") {
        color = "green"
    }
    else if (container === "#box-3") {
        color = "yellow"
    }

    column.append("circle")
        .attr("cx", 15)
        .attr("cy", 14)
        .attr("r", 7)
        .style("fill", color)
        .style("stroke", "black")
        .style("stroke-width", 1);

    const lackdata = (data["記録対戦数"] < 50);
    column.append("text")
        .attr("x", 30) 
        .attr("y", 20)
        .attr("color", lackdata ? "red" : "black")
        .text(lackdata ? data["名前"] + "  (データ不足)" : data["名前"]);

    const column1 = svg.append("g");
    const column2 = svg.append("g");
    const column3 = svg.append("g");
    const column4 = svg.append("g");
    
    const key_select1 = ["記録対戦数", "和了率", "放銃率", "ツモ率", "ダマ率", "流局聴牌率", "副露率"]; 
    const key_select2 = ["立直率", "和了巡数","平均和了", "和了時立直率", "和了時副露率", "和了時ダマ率"]; 
    
    for (const i in key_select1) {
        const key = key_select1[i];
        column1.append("text")
            .attr("x", 30)
            .attr("y", i * 25 + 60)
            .text(key);
        column2.append("text")
            .attr("x", 150) // Adjust X position to create a second column
            .attr("y", i * 25 + 60) // Adjust Y position as you need
            .text(data[key].substr(0,5));
    }
    for (const i in key_select2) {
        const key = key_select2[i];
        column3.append("text")
            .attr("x", 230)
            .attr("y", i * 25 + 60)
            .text(key);
        column4.append("text")
            .attr("x", 350) // Adjust X position to create a second column
            .attr("y", i * 25 + 60) // Adjust Y position as you need
            .text(data[key].substr(0,5));
    }
}

const createPage4 = (data, container) => {
    const svg = d3.select(container)
        .append("svg")
        .attr("width", 440)
        .attr("height", 225);

    const column = svg.append("g");
    let color;
    if (container === "#box-0") {
        color = "red"
    }
    else if (container === "#box-1") {
        color = "blue"
    }
    else if (container === "#box-2") {
        color = "green"
    }
    else if (container === "#box-3") {
        color = "yellow"
    }

    column.append("circle")
        .attr("cx", 15)
        .attr("cy", 14)
        .attr("r", 7)
        .style("fill", color)
        .style("stroke", "black")
        .style("stroke-width", 1);

    const lackdata = (data["記録対戦数"] < 50);
    column.append("text")
        .attr("x", 30) 
        .attr("y", 20)
        .attr("color", lackdata ? "red" : "black")
        .text(lackdata ? data["名前"] + "  (データ不足)" : data["名前"]);

    const column1 = svg.append("g");
    const column2 = svg.append("g");
    const column3 = svg.append("g");
    const column4 = svg.append("g");
    
    const key_select1 = ["立直収入", "立直支出", "先制率", "追っかけ率", "追っかけられ率", "立直巡目", "立直良形"]; 
    const key_select2 = ["放銃時立直率", "放銃時副露率", "副露後放銃率", "副露後和了率", "副露後流局率"]; 
    
    for (const i in key_select1) {
        const key = key_select1[i];
        column1.append("text")
            .attr("x", 30)
            .attr("y", i * 25 + 60)
            .text(key);
        column2.append("text")
            .attr("x", 150) // Adjust X position to create a second column
            .attr("y", i * 25 + 60) // Adjust Y position as you need
            .text(data[key].substr(0,5));
    }
    for (const i in key_select2) {
        const key = key_select2[i];
        column3.append("text")
            .attr("x", 230)
            .attr("y", i * 25 + 60)
            .text(key);
        column4.append("text")
            .attr("x", 350) // Adjust X position to create a second column
            .attr("y", i * 25 + 60) // Adjust Y position as you need
            .text(data[key].substr(0,5));
    }
}

const createFeature = (data, container) => {
    const svg = d3.select(container)
        .append("svg")
        //.style("border", "1px solid red")
        .attr("width", 205)
        .attr("height", 225)
        .attr("transform", "translate(0 , -230)");

    const column = svg.append("g");
    let color;
    if (container === "#box-0") {
        color = "red"
    }
    else if (container === "#box-1") {
        color = "blue"
    }
    else if (container === "#box-2") {
        color = "green"
    }
    else if (container === "#box-3") {
        color = "yellow"
    }

    column.append("circle")
        .attr("cx", 15)
        .attr("cy", 14)
        .attr("r", 7)
        .style("fill", color)
        .style("stroke", "black")
        .style("stroke-width", 1);

    const lackdata = (data["記録対戦数"] < 50);
    column.append("text")
        .attr("x", 30)
        .attr("y", 20)
        .attr("color", lackdata ? "red" : "black")
        .text(data["名前"] === "undefined" ? "" : lackdata ? data["名前"] + "  (データ不足)" : data["名前"]);

    column.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .text("【タイプ】");

    column.append("text")
        .attr("x", 0)
        .attr("y", 75)
        .text(data["名前"] === "undefined" ? "・" : Number(data["放銃率"]) < 0.14 ? "・防御型" : "・攻撃型");

    column.append("text")
        .attr("x", 0)
        .attr("y", 95)
        .text(data["名前"] === "undefined" ? "・" : Number(data["立直率"]) < 0.195 ? "・鳴き多め" : "・門前多め");

    column.append("text")
        .attr("x", 0)
        .attr("y", 115)
        .text(data["名前"] === "undefined" ? "・" : Number(data["平均和了"]) < 6500 ? "・速度重視" : "・打点重視");

    column.append("text")
        .attr("x", 0)
        .attr("y", 140)
        .text("【アドバイス】");

    column.append("text")
        .attr("x", 0)
        .attr("y", 165)
        .text(data["名前"] === "undefined" ? "・" : Number(data["放銃率"]) < 0.14 ? "・積極的に攻めよう" : "・追っかけリーチに注意");

    column.append("text")
        .attr("x", 0)
        .attr("y", 185)
        .text(data["名前"] === "undefined" ? "・" : Number(data["立直率"]) < 0.195 ? "・絞りが有効" : "・早い手が有効");

    column.append("text")
        .attr("x", 0)
        .attr("y", 205)
        .text(data["名前"] === "undefined" ? "・" : Number(data["平均和了"]) < 6500 ? "・打点は低め" : "・リーチ時の高打点に注意");
};

const createRadar = (d, container) => {
    // レーダーチャートの半径を設定します
    const radius = 90;
    data = []
    const createRaderValue = (data, column, min, max) => {
        val = Number(data[column]);
        if (val > max) {
            return 1
        }
        else if (val < min) {
            return 0
        }
        else {
            return (val - min) / (max - min);
        }
    }
    data.push({ axis: "攻", value: createRaderValue(d, "平均和了", 5500, 7500) });
    data.push({ axis: "防", value: 1 - createRaderValue(d, "放銃率", 0.10, 0.19) });
    data.push({ axis: "門", value: createRaderValue(d, "立直率", 0.13, 0.25) });
    data.push({ axis: "鳴", value: createRaderValue(d, "副露率", 0.15, 0.5) });
    data.push({ axis: "速", value: createRaderValue(d, "和了率", 0.18, 0.28) });

    // SVG要素を作成します
    const svg = d3.select(container)
        .append("svg")
        //.style("border", "1px solid red")
        .attr("width", 225)
        .attr("height", 235)
        .attr("transform", "translate(210, 0)");

    // レーダーチャートの軸を描画します
    const radarChartGroup = svg.append("g")
        .attr("transform", "translate(110,115)");

    const angleSlice = Math.PI * 2 / data.length;

    radarChartGroup.selectAll(".line")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function (d, i) { return radius * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("y2", function (d, i) { return radius * Math.sin(angleSlice * i - Math.PI / 2); })
        .style("stroke", "black")
        .style("stroke-width", "1px");

    // 内部のグリッド線を描画します
    const gridLevels = 4;
    for (var level = 0; level < gridLevels; level++) {
        var gridGroup = radarChartGroup.append("g");
        gridGroup.selectAll(".line")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", function (d, i) { return (level + 1) / gridLevels * radius * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("y1", function (d, i) { return (level + 1) / gridLevels * radius * Math.sin(angleSlice * i - Math.PI / 2); })
            .attr("x2", function (d, i) { return (level + 1) / gridLevels * radius * Math.cos(angleSlice * ((i + 1) % data.length) - Math.PI / 2); })
            .attr("y2", function (d, i) { return (level + 1) / gridLevels * radius * Math.sin(angleSlice * ((i + 1) % data.length) - Math.PI / 2); })
            .style("stroke", "grey")
            .style("stroke-width", "0.5px");
    }

    // レーダーチャートの領域を描画します
    const radarArea = d3.line()
        .x(function (d, i) { return d.value * radius * Math.cos(angleSlice * i - Math.PI / 2); })
        .y(function (d, i) { return d.value * radius * Math.sin(angleSlice * i - Math.PI / 2); })
        .curve(d3.curveLinearClosed);

    const radarAreaInitial = d3.line()
        .x(function (d, i) { return 0; }) // 初期状態では中心点に集まっている
        .y(function (d, i) { return 0; }) // 初期状態では中心点に集まっている
        .curve(d3.curveLinearClosed);

    radarChartGroup.append("path")
        .datum(data)
        .attr("d", radarAreaInitial)
        .style("fill", "#69b3a2")
        .style("fill-opacity", 0.5)
        .attr("stroke-width", 0) // アニメーションの初期状態を設定
        .transition() // アニメーションを開始
        .duration(2000) // アニメーションの期間を2000ms（2秒）に設定
        .attr("d", radarArea); // アニメーションの終了状態を設定

    // 外枠の五角形を描画します
    const outerPath = d3.line()
        .x(function (d, i) { return radius * Math.cos(angleSlice * i - Math.PI / 2); })
        .y(function (d, i) { return radius * Math.sin(angleSlice * i - Math.PI / 2); })
        .curve(d3.curveLinearClosed);

    radarChartGroup.append("path")
        .datum(data)
        .attr("d", outerPath)
        .style("stroke", "black")
        .style("fill", "none");

    // 各データの名前を描画します
    radarChartGroup.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", function (d, i) { return (radius + (i===3 ? 35: i===1 ? 15 :10)) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("y", function (d, i) { return (radius + (i===3 ? 15: i===1 ? 15 :10)) * Math.sin(angleSlice * i - Math.PI / 2); })
        .text(function (d) { return d.axis; })
        .style("text-anchor", function (d, i) { return (angleSlice * i - Math.PI / 2 + Math.PI * 2) % (Math.PI * 2) < Math.PI ? "start" : "end"; })
        .attr("alignment-baseline", "middle");
}

const processAveStd = (labels, ave, std) => {
    const data_ave = {}
    const data_std = {}
    for (const key in labels) {
        data_ave[key] = ave[7][labels[key]];
        data_std[key] = std[7][labels[key]];
    }
    console.log(data_ave);
    return {data_ave, data_std}
}

const value_in_list = (value, list) => {
    for (const i in list) {
        item = list[i];
        if (value === item) {
            return true;
        }
    }
    return false;
}

const make_key_list = () => {
    const key_list = [];
    d3.csv("./data/playerdata_tmp.csv")
        .then((d) => {
            for (const key in d[0]) {
                key_list.push(key);
            }
        });
    return key_list
}

const processNewData = (new_data, key_list) => {
    const new_data_processed = [{}, {}, {} ,{}]
    for (const i in key_list) {
        const key = key_list[i];
        new_data_processed[0][key] = String(new_data[0][key]);
        new_data_processed[1][key] = String(new_data[1][key]);
        new_data_processed[2][key] = String(new_data[2][key]);
        new_data_processed[3][key] = String(new_data[3][key]);
    }
    return new_data_processed
}

const getData_statistics = async () => {
    const data_0 = await d3.csv("./data/playerdata_ave.csv");
    const data_1 = await d3.csv("./data/playerdata_std.csv");
    const data_raw = [data_0, data_1];
    const ignore_column = ["名前","記録対戦数", "記録点数", "流局率", "飛び率", "安定段位", "点数期待", "立直流局率", "最高段位", "最高点数", "最大連荘", "痛い親かぶり率", "痛い親かぶり平均", "局収支", "平均順位", "立直放銃A", "立直放銃B", "立直収支", "立直流局", "振聴率", "立直多面", "総計局数", "調整打点効率", "ダマ率", "ツモ率", "追っかけられ率"];
    const data_rank_ave = [100000];
    const data_rating_ave = [100000];
    const data_rank_std = [null];
    const data_rating_std = [null];

    for (let j = 0; j < 2; j++) {
        let i = 1;
        data_raw[j].forEach(function (dat) {
            let data_statistics = [];
            data_statistics.push(dat['名前']);
            data_statistics.push(7);
            for (let key in dat) {
                let ok = 1;
                for (let _ in ignore_column) {
                    if (key == ignore_column[_]) {
                        ok = 0;
                    }
                }
                if (!ok) continue;
                if (key == "記録段位") {
                    data_statistics.push(15);
                    data_statistics.push(0);
                }
                else {
                    data_statistics.push(dat[key]);
                }
            }
            if (j === 0) {
                if (i < 8) {
                    data_rank_ave.push(data_statistics);
                } else {
                    data_rating_ave.push(data_statistics);
                }
            }
            if (j === 1) {
                if (i < 8) {
                    data_rank_std.push(data_statistics);
                } else {
                    data_rating_std.push(data_statistics);
                }
            }
            i++;
        });
    }

    return { data_rank_ave, data_rating_ave, data_rank_std, data_rating_std };
};


const main = async () => {
    const { data, label } = await getData();
    console.log(data);
    const { data_rank_ave, data_rating_ave, data_rank_std, data_rating_std } = await getData_statistics();
    // console.log(data_rank_ave);
    // console.log(data_rating_ave);
    // console.log(data_rank_std);
    // console.log(data_rating_std);
    console.log(label);
    createSite(data, label, data_rank_ave, data_rating_ave, data_rank_std, data_rating_std);
};

main();
