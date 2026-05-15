# Mini AI Agent Demo

โปรเจกต์นี้ทำมาเพื่อให้เห็นภาพ 3 อย่างแบบง่าย ๆ:

- `AI Agent` คืออะไร
- `Agent SDK` คืออะไร
- `Skill` คืออะไรในเชิงแนวคิด

## โครงสร้างไฟล์

- [demo_agent.py](/C:/GPTcoding/demo_agent.py) = agent แบบจำลอง ไม่ต้องใช้ API key
- [sdk_agent.py](/C:/GPTcoding/sdk_agent.py) = agent ที่ใช้ OpenAI Agents SDK
- [tools.py](/C:/GPTcoding/tools.py) = tools ที่ agent เรียกใช้
- [data/products.json](/C:/GPTcoding/data/products.json) = ฐานข้อมูลสินค้าตัวอย่าง
- [flow.mmd](/C:/GPTcoding/flow.mmd) = Mermaid flow diagram
- [requirements.txt](/C:/GPTcoding/requirements.txt) = package ที่ต้องใช้

## ภาพรวม

ผู้ใช้ถาม:

`SSD 1TB ราคาเท่าไร และมีของไหม`

สิ่งที่ agent ทำ:

1. อ่านคำถาม
2. ตัดสินใจว่าต้องใช้ tool อะไร
3. เรียก tool เช่น `get_price()` และ `check_stock()`
4. นำผลลัพธ์มาสรุปเป็นคำตอบ

## ความหมายของคำสำคัญ

### 1) AI Agent

ตัวที่รับคำสั่ง คิด และเลือกว่าจะใช้ tool อะไร

ในโปรเจกต์นี้:

- [demo_agent.py](/C:/GPTcoding/demo_agent.py) มี `SimpleShopAgent`
- [sdk_agent.py](/C:/GPTcoding/sdk_agent.py) มี `Agent(...)` จาก SDK

### 2) Tool

ฟังก์ชันที่ agent ใช้ทำงานจริง

ในโปรเจกต์นี้ tools อยู่ใน [tools.py](/C:/GPTcoding/tools.py):

- `find_product()`
- `get_price()`
- `check_stock()`

### 3) Agent SDK

framework ที่ช่วยให้เราสร้าง agent ได้สะดวกขึ้น

ในโปรเจกต์นี้:

- [sdk_agent.py](/C:/GPTcoding/sdk_agent.py) ใช้ `openai-agents`

### 4) Skill

คำนี้มี 2 มุมที่คนมักสับสน:

- เชิงแนวคิด: skill คือความสามารถเฉพาะด้าน เช่น "ตอบเรื่องสินค้า"
- ใน Codex: skill คือชุด workflow/คำแนะนำเฉพาะทางที่ Codex ใช้ช่วยทำงาน

ในตัวอย่างนี้ ถ้ามองเชิงแนวคิด:

- skill ของ agent คือ "ช่วยตอบคำถามเรื่องสินค้าโดยใช้ tools"

## วิธีรันแบบง่ายที่สุด

### แบบไม่ใช้ API key

```powershell
python demo_agent.py
```

## IEC 01 Cable App

- [index.html](/C:/GPTcoding/index.html) = à¹€à¸§à¹‡à¸šà¹à¸­à¸›à¸„à¸³à¸™à¸§à¸“à¸‚à¸™à¸²à¸”à¸ªà¸²à¸¢à¹„à¸Ÿ IEC 01
- [styles.css](/C:/GPTcoding/styles.css) = à¹„à¸Ÿà¸¥à¹Œà¸•à¸à¹à¸•à¹ˆà¸‡à¸«à¸™à¹‰à¸²à¸ˆà¸­
- [app.js](/C:/GPTcoding/app.js) = à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸à¸£à¸°à¹à¸ªà¹à¸¥à¸° logic à¸„à¸³à¸™à¸§à¸“

à¸§à¸´à¸˜à¸µà¹ƒà¸Šà¹‰à¸‡à¸²à¸™:

1. à¹€à¸›à¸´à¸” [index.html](/C:/GPTcoding/index.html) à¸”à¹‰à¸§à¸¢ browser
2. à¸à¸£à¸­à¸à¸„à¹ˆà¸²à¸à¸£à¸°à¹à¸ªà¹„à¸Ÿà¸Ÿà¹‰à¸² `I`
3. à¹€à¸¥à¸·à¸­à¸à¸‚à¸™à¸²à¸”à¸ªà¸²à¸¢à¹„à¸Ÿà¹€à¸›à¹‡à¸™ `sq.mm.`
4. à¸£à¸°à¸šà¸šà¸ˆà¸°à¹à¸ªà¸”à¸‡à¸ªà¸–à¸²à¸™à¸°à¸ªà¸²à¸¢à¸—à¸µà¹ˆà¹€à¸¥à¸·à¸­à¸ à¹à¸¥à¸°à¸‚à¸™à¸²à¸”à¸ªà¸²à¸¢à¸‚à¸±à¹‰à¸™à¸•à¹ˆà¸³à¸—à¸µà¹ˆà¹à¸™à¸°à¸™à¸³

ตัวนี้เหมาะที่สุดสำหรับเริ่มเข้าใจ flow

### แบบใช้ OpenAI Agents SDK

1. ติดตั้งแพ็กเกจ

```powershell
pip install -r requirements.txt
```

2. ตั้งค่า API key ใน PowerShell

```powershell
$env:OPENAI_API_KEY="sk-..."
```

3. รัน

```powershell
python sdk_agent.py
```

## ลองแก้เล่นเพื่อเข้าใจเร็วขึ้น

- เปลี่ยนข้อมูลใน [data/products.json](/C:/GPTcoding/data/products.json)
- เปลี่ยนคำถามใน [demo_agent.py](/C:/GPTcoding/demo_agent.py)
- เพิ่ม tool ใหม่ใน [tools.py](/C:/GPTcoding/tools.py) เช่น `recommend_product()`

## Mermaid Flow

ถ้า editor ของคุณรองรับ Mermaid ให้เปิด [flow.mmd](/C:/GPTcoding/flow.mmd)

หรือดูโค้ดด้านล่าง:

```mermaid
flowchart TD
    A["ผู้ใช้ถาม: SSD 1TB ราคาเท่าไร และมีของไหม"] --> B["Agent อ่านคำถาม"]
    B --> C{"ต้องใช้ tool ไหม"}
    C -- "ใช่" --> D["เรียก get_price(product_name)"]
    D --> E["เรียก check_stock(product_name)"]
    E --> F["Agent รวมผลลัพธ์"]
    F --> G["ตอบกลับผู้ใช้"]
    C -- "ไม่ใช่" --> G
```
