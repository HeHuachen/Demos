let x = 1;
let func = (y = () => x = 2) => {
    var x = 3;
    y();
    console.log(x);
}
func();
console.log(x);

/*==================================================*/

let z = 1;
let func2 = (y = () => z) => {
    let z = 2;
    console.log(y());
}
func2();