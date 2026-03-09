const CATEGORY_CONFIG = {
    "handles": {
        "OVA 350": ["HARDWARE Black", "HARDWARE Brushed Gold", "HARDWARE Brushed Nickel", "HARDWARE Chrome"],
        "Wave Pull": ["HARDWARE Black", "HARDWARE Brushed Gold", "HARDWARE Brushed Nickel", "HARDWARE Chrome"]
    },
    "tops": {
        "Same as Cabinet": [],
        "SilkSurface": ["carrara_matte"]
    }
};

const PRODUCT_CONFIG = {
    // 这里的 KEY 是通过 URL ?id=XXX 传递的。如果没有传递，默认用这个。
    "SOB-B-500-602": {
        "mount": ["Floor Standing"],
        "size": ["500 mm"],
        "cabinet": ["boston_oak", "florentine_walnut", "PAINT Olive Satin", "PAINT Taubmans Saxby Blue", "PAINT New Penny", "PAINT White Satin"],
        "handleCategory": ["OVA 350", "Wave Pull"],
        "topCategory": ["Same as Cabinet"]
    }
};
