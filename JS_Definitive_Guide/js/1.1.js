window.onload = function(){
    // 事件绑定
    var btn = $("submit");
    var inputs = document.getElementsByTagName("input");
    for ( var i = 0; i < inputs.length; i++ ){
        inputs[i].onchange = calculate;
    }
    btn.onclick = calculate;
    // 取本地存储
    if (window.localStorage && localStorage.loan_amount) {
        $("amount").value = localStorage.loan_amount;
        $("apr").value = localStorage.loan_apr;
        $("years").value = localStorage.loan_years;
    }
};

function $(id) {
    return document.getElementById(id);
}

// 获取数据 计算 保存 绘制
function calculate() {
    // init var 
    var amount = $("amount"),
        apr = $("apr"),
        years = $("years"),
        payment = $("payment"),
        total = $("total"),
        totalinterest = $("totalinterest");
    // 基本数据转换计算
    var principal = parseFloat(amount.value) || 0,
        interest = parseFloat(apr.value) / 100 / 12 || 0,
        payments = parseFloat(years.value) * 12 || 0;
    // 月赔付
    var x = Math.pow(1 + interest, payments); //1+interest 的 payments 次方
    var monthly = (principal * x * interest) / (x - 1) ; //每月还本付息金额 公式
    // 展现
    if (isFinite(monthly)) {
        // 数据填充
        payment.innerHTML = monthly.toFixed(2);
        total.innerHTML = (monthly * payments).toFixed(2);
        totalinterest.innerHTML = ((monthly * payments) - principal).toFixed(2);
        // localStorage
        save(amount.value, apr.value, years.value);
        // 绘图
        chart(principal, interest, monthly, payments);
    }else{
        // 清楚图表
        chart();
    }
} 

// 保存数据
function save(amount, apr, years) {
    if (window.localStorage) {
        localStorage.loan_amount = amount;
        localStorage.loan_apr = apr;
        localStorage.loan_years = years;
    }
}

// canvas绘图
function chart(principal, interest, monthly, payments) {
    var graph = $("graph");
    graph.width = graph.offsetWidth;
    graph.height = graph.offsetHeight;

    if (arguments.length == 0 || !graph.getContext) return false;

    var g = graph.getContext("2d"), // get 画布对象
        width = graph.width,
        height = graph.height; // 画布大小
    console.log(width+"|"+height);
    
    // return 坐标
    function paymentToX (n) {
        return n * width / payments;
    }
    function amountToY (a) {
        return height - (a * height / (monthly * payments * 1.05));
    }
    // 付款线
    g.moveTo(paymentToX(0),amountToY(0)); // 起点
    g.lineTo(paymentToX(payments), amountToY(monthly * payments)); // 终点
    g.lineTo(paymentToX(payments), amountToY(0)); // 与x轴垂直
    g.closePath(); // 闭合
    g.fillStyle = "#81c2d6"; // 8192d6,d9b3e6,dcf7a1,83fcd8
    g.fill(); //填充
    g.font = "bold 12px sans-serif";
    g.fillText("Total Interest Payments", 20, 20);

    var equity = 0;
    g.beginPath(); //开始新图形
    g.moveTo(paymentToX(0), amountToY(0));
    for (var p = 1; p <= payments; p++) {
        var thisMonthsInterest = (principal - equity) * interest;
        equity += (monthly - thisMonthsInterest); // 得到资产额
        g.lineTo(paymentToX(p), amountToY(equity));
    }
    g.lineTo(paymentToX(payments), amountToY(0)) // 垂线到x轴
    g.closePath();
    g.fillStyle = "#8192d6";
    g.fill();
    g.fillText("Total Equity", 20, 35);

    var bal = principal;
    g.beginPath();
    g.moveTo(paymentToX(0), amountToY(bal));
    for (var p = 1; p <= payments; p++) { 
        var thisMonthsInterest = bal * interest;
        bal -= (monthly - thisMonthsInterest);
        g.lineTo(paymentToX(p), amountToY(bal));
    }
    g.strokeStyle = "#d9b3e6";
    g.stroke();
    g.fillStyle = "#d9b3e6";
    g.fillText("Loan Balance", 20, 50);

    g.fillStyle = "#666";    
    g.textAlign = "center";
    var y = amountToY(0);
    for (var year = 1; year * 12 <= payments; year++) { 
        var x = paymentToX(year * 12);
        g.fillRect(x - 0.5, y - 3, 1, 3);
        if (year == 1) g.fillText("Year", x, y - 5);
        if (year % 5 == 0 && year * 12 !== payments)
            g.fillText(String(year), x, y - 5);
    }
    
    g.textAlign = "right";
    g.textBaseline = "middle";
    var ticks = [monthly * payments, principal];
    var rightEdge = paymentToX(payments);
    for (var i = 0; i < ticks.length; i++) {
        var y = amountToY(ticks[i]);
        g.fillRect(rightEdge - 3, y - 0.5, 3, 1);
        g.fillText(String(ticks[i].toFixed(0)), rightEdge - 5, y);
    }
}