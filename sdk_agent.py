from __future__ import annotations

import asyncio
import os
import sys

from agents import Agent, Runner, function_tool

from tools import check_stock, get_price


@function_tool
def get_price_tool(product_name: str) -> str:
    """Return the product price in Thai baht."""
    return get_price(product_name)


@function_tool
def check_stock_tool(product_name: str) -> str:
    """Return whether the product is in stock."""
    return check_stock(product_name)


agent = Agent(
    name="Shop Agent",
    instructions=(
        "คุณเป็นผู้ช่วยร้านค้าไอที ตอบสั้น ชัดเจน และใช้ tools เมื่อผู้ใช้ถามเรื่องราคา "
        "หรือสต็อกสินค้า"
    ),
    tools=[get_price_tool, check_stock_tool],
)


async def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("กรุณาตั้งค่า OPENAI_API_KEY ก่อนรัน sdk_agent.py")

    result = await Runner.run(agent, "SSD 1TB ราคาเท่าไร และมีของไหม")
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
