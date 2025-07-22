# วิธีการตั้งค่า Google Apps Script สำหรับระบบยืมคืนอุปกรณ์

## ขั้นตอนที่ 1: สร้าง Google Spreadsheet

1. เปิด [Google Sheets](https://sheets.google.com)
2. สร้าง Spreadsheet ใหม่
3. ตั้งชื่อ เช่น "ระบบยืมคืนอุปกรณ์"
4. คัดลอก ID ของ Spreadsheet จาก URL
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

## ขั้นตอนที่ 2: สร้าง Google Apps Script

1. เปิด [Google Apps Script](https://script.google.com)
2. คลิก "โปรเจคใหม่"
3. ลบโค้ดเดิมทั้งหมด
4. คัดลอกโค้ดจากไฟล์ `Code.gs` มาวาง
5. แทนที่ `YOUR_SPREADSHEET_ID_HERE` ด้วย ID จริงของ Spreadsheet
6. บันทึกโปรเจค (Ctrl+S)
7. ตั้งชื่อโปรเจค เช่น "Equipment Rental System"

## ขั้นตอนที่ 3: Deploy Web App

1. คลิก "Deploy" > "New deployment"
2. คลิกไอคอน "เฟือง" ข้าง "Type"
3. เลือก "Web app"
4. ตั้งค่าดังนี้:
   - **Execute as**: Me (อีเมลของคุณ)
   - **Who has access**: Anyone
5. คลิก "Deploy"
6. อนุญาตการเข้าถึงเมื่อระบบขอ
7. คัดลอก **Web app URL** ที่ได้

## ขั้นตอนที่ 4: อัพเดท React App

1. เปิดไฟล์ `src/services/googleSheets.ts`
2. แทนที่ URL ในตัวแปร `GOOGLE_SCRIPT_URL`:
   ```typescript
   const GOOGLE_SCRIPT_URL = "URL_ที่ได้จาก_Google_Apps_Script";
   ```

## ขั้นตอนที่ 5: ทดสอบระบบ

1. ลองเพิ่มอุปกรณ์ใหม่ในเว็บแอป
2. ตรวจสอบว่าข้อมูลปรากฏใน Google Sheets
3. ลองยืมและคืนอุปกรณ์
4. ตรวจสอบบันทึกการใช้งาน

## โครงสร้างข้อมูลใน Google Sheets

### แผ่น "บันทึกการใช้งาน"
| คอลัมน์ | ชื่อ | รายละเอียด |
|---------|------|------------|
| A | วันที่เวลา | Timestamp การทำรายการ |
| B | การกระทำ | ยืมอุปกรณ์/คืนอุปกรณ์/เพิ่มอุปกรณ์ใหม่ |
| C | ID อุปกรณ์ | รหัสอุปกรณ์ |
| D | ชื่ออุปกรณ์ | ชื่อของอุปกรณ์ |
| E | หมวดหมู่ | ประเภทของอุปกรณ์ |
| F | สถานะ | พร้อมใช้งาน/ถูกยืม |
| G | ผู้ยืม | ชื่อผู้ยืม (ถ้ามี) |
| H | วันที่คืน | วันที่กำหนดคืน (ถ้ามี) |
| I | หมายเหตุ | หมายเหตุเพิ่มเติม |

### แผ่น "รายการอุปกรณ์"
| คอลัมน์ | ชื่อ | รายละเอียด |
|---------|------|------------|
| A | ID อุปกรณ์ | รหัสอุปกรณ์ |
| B | ชื่ออุปกรณ์ | ชื่อของอุปกรณ์ |
| C | หมวดหมู่ | ประเภทของอุปกรณ์ |
| D | สถานะ | สถานะปัจจุบัน |
| E | รูปภาพ | URL รูปภาพ |
| F | หมายเหตุ | หมายเหตุเพิ่มเติม |
| G | ผู้ยืม | ชื่อผู้ยืมปัจจุบัน |
| H | วันที่คืน | วันที่กำหนดคืน |
| I | วันที่เพิ่ม | วันที่เพิ่มอุปกรณ์ |

## ฟีเจอร์พิเศษ

### 1. การจัดรูปแบบอัตโนมัติ
- แถวที่ถูกยืมจะมีพื้นหลังสีแดงอ่อน
- แถวที่พร้อมใช้งานจะมีพื้นหลังสีเขียวอ่อน
- Header มีสีพื้นหลังและตัวอักษรสีขาว

### 2. ฟังก์ชันสำหรับ Debug
- `testScript()`: ทดสอบการทำงานของระบบ
- `getAllDevices()`: ดูข้อมูลอุปกรณ์ทั้งหมด
- `clearTestData()`: ล้างข้อมูลทดสอบ (ใช้ระวัง!)

### 3. การจัดการข้อผิดพลาด
- ตรวจสอบข้อมูลที่ส่งมา
- จัดการ error และส่ง response ที่เหมาะสม
- บันทึก error log สำหรับ debugging

## การแก้ไขปัญหา

### ปัญหา: ข้อมูลไม่ถูกส่งไป Google Sheets
1. ตรวจสอบ URL ใน `googleSheets.ts`
2. ตรวจสอบ SPREADSHEET_ID ใน Google Apps Script
3. ตรวจสอบสิทธิ์การเข้าถึง (Who has access: Anyone)

### ปัญหา: Error "Script function not found"
1. ตรวจสอบว่าบันทึกโปรเจค Google Apps Script แล้ว
2. ตรวจสอบชื่อฟังก์ชัน `doPost`
3. ลอง Deploy ใหม่

### ปัญหา: ข้อมูลไม่อัพเดท
1. รอสักครู่ (อาจมี delay)
2. รีเฟรช Google Sheets
3. ตรวจสอบ Console ใน Browser สำหรับ error

## การปรับแต่งเพิ่มเติม

### เพิ่มการแจ้งเตือนทาง Email
```javascript
// เพิ่มในฟังก์ชัน handleBorrowAction
MailApp.sendEmail({
  to: 'admin@example.com',
  subject: 'มีการยืมอุปกรณ์ใหม่',
  body: `อุปกรณ์: ${data.name}\nผู้ยืม: ${data.borrower}\nวันที่คืน: ${data.duedate}`
});
```

### เพิ่มการสำรองข้อมูล
```javascript
// สร้างสำเนาข้อมูลในแผ่นแยก
function backupData() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const backupSheet = spreadsheet.insertSheet(`Backup_${new Date().toISOString().split('T')[0]}`);
  // คัดลอกข้อมูลจากแผ่นหลัก
}
```

## หมายเหตุสำคัญ

- ระบบใช้ `mode: "no-cors"` ใน fetch เพื่อหลีกเลี่ยงปัญหา CORS
- ข้อมูลจะถูกบันทึกแม้ว่าจะไม่ได้รับ response กลับ
- Google Apps Script มีข้อจำกัดเรื่องเวลาการทำงาน (6 นาที/request)
- ควรสำรองข้อมูลเป็นระยะ