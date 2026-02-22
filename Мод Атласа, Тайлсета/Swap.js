var replacement = "https://raw.githubusercontent.com/AnthonyMANMAN/Scripts/refs/heads/main/atlas7.png";
var desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');

Object.defineProperty(HTMLImageElement.prototype, 'src', {
    set: function(val) {
        if (val && val.includes("atlas")) {
            desc.set.call(this, replacement);
        } else {
            desc.set.call(this, val);
        }
    },
    get: function() {
        return desc.get.call(this);
    }
});