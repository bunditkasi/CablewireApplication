from __future__ import annotations

import sys

from tools import check_stock, find_product, get_price


class SimpleShopAgent:
    """A tiny rule-based agent used only for learning the agent flow."""

    def respond(self, user_message: str) -> str:
        product_name = self._extract_product_name(user_message)
        if not product_name:
            return "ผมยังจับชื่อสินค้าไม่ได้ ลองถามเช่น: SSD 1TB ราคาเท่าไร"

        steps = [f"[Agent] เข้าใจว่าผู้ใช้ถามเกี่ยวกับ: {product_name}"]
        answers: list[str] = []

        if "ราคา" in user_message:
            steps.append("[Agent] ตัดสินใจเรียก tool: get_price()")
            answers.append(get_price(product_name))

        if "สต็อก" in user_message or "มีของ" in user_message or "พร้อมส่ง" in user_message:
            steps.append("[Agent] ตัดสินใจเรียก tool: check_stock()")
            answers.append(check_stock(product_name))

        if not answers:
            steps.append("[Agent] ไม่มีคำสั่งเฉพาะ จึงสรุปข้อมูลสินค้าทั่วไป")
            product = find_product(product_name)
            if not product:
                answers.append(f"ไม่พบสินค้า: {product_name}")
            else:
                answers.append(
                    f'{product["name"]} ราคา {product["price_thb"]} บาท และมีสต็อก {product["stock"]} ชิ้น'
                )

        steps.append("[Agent] รวมผลลัพธ์จาก tools แล้วตอบกลับ")
        trace = "\n".join(steps)
        final_answer = "\n".join(answers)
        return f"{trace}\n\nคำตอบ:\n{final_answer}"

    def _extract_product_name(self, user_message: str) -> str | None:
        known_products = ["SSD 1TB", "RAM 16GB", "Mechanical Keyboard"]
        lowered = user_message.lower()
        for name in known_products:
            if name.lower() in lowered:
                return name
        return None


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    agent = SimpleShopAgent()
    demo_question = "SSD 1TB ราคาเท่าไร และมีของไหม"
    print("ตัวอย่างคำถาม:", demo_question)
    print()
    print(agent.respond(demo_question))
