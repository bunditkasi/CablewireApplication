from __future__ import annotations

import json
from pathlib import Path


DATA_PATH = Path(__file__).parent / "data" / "products.json"


def load_products() -> list[dict]:
    with DATA_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def find_product(product_name: str) -> dict | None:
    query = product_name.strip().lower()
    for product in load_products():
        if product["name"].lower() == query:
            return product
    return None


def get_price(product_name: str) -> str:
    product = find_product(product_name)
    if not product:
        return f"ไม่พบสินค้า: {product_name}"
    return f'{product["name"]} ราคา {product["price_thb"]} บาท'


def check_stock(product_name: str) -> str:
    product = find_product(product_name)
    if not product:
        return f"ไม่พบสินค้า: {product_name}"

    stock = product["stock"]
    if stock > 0:
        return f'{product["name"]} มีสต็อก {stock} ชิ้น'
    return f'{product["name"]} หมดสต็อก'
