module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(product_id, image_id, item, size, quantity) {
        var id = image_id+size;
        var storedItem = this.items[id];
        //  console.log(product_id);
        //  console.log(image_id);
        //  console.log(size);
        //  console.log(image_id+size);
        //  console.log(price);
        
        if(!storedItem){
            storedItem = this.items[id] = { product_id: product_id, image_id: image_id, item: item, size: size, price: 0, qty: 0};
        }
        
        storedItem.qty += quantity;
        storedItem.price += storedItem.item.price*quantity;
        this.totalQty += quantity;
        this.totalPrice += storedItem.item.price*quantity;
    };

    this.reduceByOne = function(id){
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if(this.items[id].qty <= 0){
            delete this.items[id];
        }
    };

    this.removeItem = function(id){
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};