export const API_KEY = 'AIzaSyC9FpXEOz-47OYH0yT0WBzq9B2IybkzYqk';

export const value_converter = (value) => {
    if(value >= 1000000){
        return Math.floor(value/1000000) + "M";
    }
    else if(value >= 1000){
        return Math.floor(value/1000) + "K";
    }
    else{
        return value;
    }
}