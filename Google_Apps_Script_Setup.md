# วิธีการตั้งค่า Google Apps Script สำหรับเชื่อมต่อ Google Sheets

## ขั้นตอนการตั้งค่า Google Sheets

1. สร้าง Google Spreadsheet ใหม่
2. ตั้งชื่อ columns ในแถวแรก:
   - A1: Timestamp
   - B1: Action
   - C1: Device_ID
   - D1: Device_Name
   - E1: Category
   - F1: Status
   - G1: Borrower
   - H1: Due_Date
   - I1: Note

## ขั้นตอนการตั้งค่า Google Apps Script

1. เปิด Google Apps Script (script.google.com)
2. สร้างโปรเจคใหม่
3. แทนที่โค้ดที่มีอยู่ด้วยโค้ดด้านล่าง:

```javascript
function doPost(e) {
  try {
    // แปลงข้อมูลที่ส่งมาจาก web app
    const data = JSON.parse(e.postData.contents);
    
    // เปิด Google Spreadsheet (แทนที่ YOUR_SPREADSHEET_ID ด้วย ID จริง)
    const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getActiveSheet();
    
    // สร้าง timestamp แบบไทย
    const timestamp = new Date().toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // เพิ่มข้อมูลในแถวใหม่
    sheet.appendRow([
      timestamp,
      data.action,
      data.id,
      data.name,
      data.category,
      data.status,
      data.borrower || '',
      data.duedate || '',
      data.note || ''
    ]);
    
    // ส่งผลลัพธ์กลับ
    return ContentService
      .createTextOutput(JSON.stringify({result: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // ส่งข้อผิดพลาดกลับ
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. บันทึกโปรเจค
5. กด "Deploy" > "New deployment"
6. เลือก type: "Web app"
7. Execute as: "Me"
8. Who has access: "Anyone"
9. กด "Deploy"
10. คัดลอก URL ที่ได้

## การใช้งาน

1. เปิดไฟล์ `src/services/googleSheets.ts`
2. แทนที่ `YOUR_SCRIPT_ID` ด้วย URL ที่ได้จาก Google Apps Script
3. ในไฟล์ Google Apps Script แทนที่ `YOUR_SPREADSHEET_ID` ด้วย ID ของ Google Spreadsheet

## หมายเหตุ

- ระบบจะบันทึกข้อมูลทุกครั้งที่มีการยืม, คืน, หรือเพิ่มอุปกรณ์
- ข้อมูลจะแสดง timestamp แบบเวลาไทย
- สามารถดูประวัติการใช้งานทั้งหมดใน Google Sheets