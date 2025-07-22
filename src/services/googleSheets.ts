import { BorrowData } from '../types/Device';

// Google Apps Script URL - แทนที่ด้วย URL จริงจาก Google Apps Script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";

export const sendToGoogleSheet = async (data: BorrowData): Promise<void> => {
  try {
    // ตรวจสอบว่ามี URL จริงหรือไม่
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('YOUR_SCRIPT_ID_HERE')) {
      console.log('⚠️ Google Sheets URL ยังไม่ได้ตั้งค่า - กรุณาดูไฟล์ google-apps-script/README.md');
      return;
    }

    console.log('📤 ส่งข้อมูลไป Google Sheets:', data);

    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    console.log('✅ ส่งข้อมูลสำเร็จ');
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการส่งข้อมูลไป Google Sheets:", error);
  }
}