// forreach

let arr=[1,2,3,4,5,6,7,8,9,10];
arr.forEach(function(val){
    console.log(val+" hello");
});


// Using map to create a new array with all elements set to 13
let newarr=arr.map(function(val){
    return 13;
})
console.log(newarr);

// Using filter to create a new array with elements greater than 5
let narr=arr.filter(function(val){
    if(val>3){
        return true;
    }
});
console.log(narr);

// finding an element in the array
let find=arr.find(function(val){
    if(val===5){
        return true;
    }
});
console.log(find);



//  object
 var obj={
    name: "tushar",
    age: 20,
    city: "delhi"
 }

