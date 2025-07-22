/**
 * Google Apps Script สำหรับระบบยืมคืนอุปกรณ์
 * รองรับการบันทึกข้อมูลการยืม, คืน, และเพิ่มอุปกรณ์ใหม่
 */

// *** ตั้งค่าตรงนี้ ***
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // แทนที่ด้วย ID ของ Google Spreadsheet จริง

/**
 * ฟังก์ชันหลักสำหรับรับข้อมูลจาก Web App
 */
function doPost(e) {
  try {
    // ตรวจสอบว่ามีข้อมูลส่งมาหรือไม่
    if (!e.postData || !e.postData.contents) {
      return createErrorResponse('ไม่มีข้อมูลส่งมา');
    }

    // แปลงข้อมูล JSON
    const data = JSON.parse(e.postData.contents);
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!data.action || !data.id || !data.name) {
      return createErrorResponse('ข้อมูลไม่ครบถ้วน');
    }

    // เปิด Google Spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // บันทึกข้อมูลตาม action
    let result;
    switch (data.action) {
      case 'borrow':
        result = handleBorrowAction(spreadsheet, data);
        break;
      case 'return':
        result = handleReturnAction(spreadsheet, data);
        break;
      case 'add':
        result = handleAddAction(spreadsheet, data);
        break;
      default:
        return createErrorResponse('Action ไม่ถูกต้อง');
    }

    return createSuccessResponse(result);

  } catch (error) {
    console.error('Error in doPost:', error);
    return createErrorResponse(error.toString());
  }
}

/**
 * จัดการการยืมอุปกรณ์
 */
function handleBorrowAction(spreadsheet, data) {
  const logSheet = getOrCreateSheet(spreadsheet, 'บันทึกการใช้งาน');
  const deviceSheet = getOrCreateSheet(spreadsheet, 'รายการอุปกรณ์');
  
  // บันทึกในแผ่น Log
  const timestamp = new Date().toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  logSheet.appendRow([
    timestamp,
    'ยืมอุปกรณ์',
    data.id,
    data.name,
    data.category || '',
    'ถูกยืม',
    data.borrower || '',
    data.duedate || '',
    data.note || ''
  ]);

  // อัพเดทสถานะในแผ่นอุปกรณ์
  updateDeviceStatus(deviceSheet, data.id, 'ถูกยืม', data.borrower, data.duedate);

  return {
    message: 'บันทึกการยืมสำเร็จ',
    device: data.name,
    borrower: data.borrower
  };
}

/**
 * จัดการการคืนอุปกรณ์
 */
function handleReturnAction(spreadsheet, data) {
  const logSheet = getOrCreateSheet(spreadsheet, 'บันทึกการใช้งาน');
  const deviceSheet = getOrCreateSheet(spreadsheet, 'รายการอุปกรณ์');
  
  const timestamp = new Date().toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  logSheet.appendRow([
    timestamp,
    'คืนอุปกรณ์',
    data.id,
    data.name,
    data.category || '',
    'พร้อมใช้งาน',
    '', // ไม่มีผู้ยืม
    '', // ไม่มีวันที่คืน
    data.note || ''
  ]);

  // อัพเดทสถานะในแผ่นอุปกรณ์
  updateDeviceStatus(deviceSheet, data.id, 'พร้อมใช้งาน', '', '');

  return {
    message: 'บันทึกการคืนสำเร็จ',
    device: data.name
  };
}

/**
 * จัดการการเพิ่มอุปกรณ์ใหม่
 */
function handleAddAction(spreadsheet, data) {
  const logSheet = getOrCreateSheet(spreadsheet, 'บันทึกการใช้งาน');
  const deviceSheet = getOrCreateSheet(spreadsheet, 'รายการอุปกรณ์');
  
  const timestamp = new Date().toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // บันทึกในแผ่น Log
  logSheet.appendRow([
    timestamp,
    'เพิ่มอุปกรณ์ใหม่',
    data.id,
    data.name,
    data.category || '',
    'พร้อมใช้งาน',
    '',
    '',
    data.note || ''
  ]);

  // เพิ่มอุปกรณ์ใหม่ในแผ่นอุปกรณ์
  deviceSheet.appendRow([
    data.id,
    data.name,
    data.category || '',
    'พร้อมใช้งาน',
    data.img || '',
    data.note || '',
    '', // ผู้ยืม
    '', // วันที่คืน
    timestamp // วันที่เพิ่ม
  ]);

  return {
    message: 'เพิ่มอุปกรณ์ใหม่สำเร็จ',
    device: data.name,
    id: data.id
  };
}

/**
 * สร้างหรือเปิดแผ่นงาน
 */
function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    
    // ตั้งค่า header สำหรับแผ่นต่างๆ
    if (sheetName === 'บันทึกการใช้งาน') {
      sheet.getRange(1, 1, 1, 9).setValues([[
        'วันที่เวลา', 'การกระทำ', 'ID อุปกรณ์', 'ชื่ออุปกรณ์', 'หมวดหมู่', 
        'สถานะ', 'ผู้ยืม', 'วันที่คืน', 'หมายเหตุ'
      ]]);
      
      // จัดรูปแบบ header
      const headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setBackground('#4a90e2');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
      
    } else if (sheetName === 'รายการอุปกรณ์') {
      sheet.getRange(1, 1, 1, 9).setValues([[
        'ID อุปกรณ์', 'ชื่ออุปกรณ์', 'หมวดหมู่', 'สถานะ', 'รูปภาพ', 
        'หมายเหตุ', 'ผู้ยืม', 'วันที่คืน', 'วันที่เพิ่ม'
      ]]);
      
      // จัดรูปแบบ header
      const headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setBackground('#34a853');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
    }
    
    // ปรับขนาดคอลัมน์
    sheet.autoResizeColumns(1, sheet.getLastColumn());
  }
  
  return sheet;
}

/**
 * อัพเดทสถานะอุปกรณ์ในแผ่นรายการอุปกรณ์
 */
function updateDeviceStatus(deviceSheet, deviceId, status, borrower = '', dueDate = '') {
  const data = deviceSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) { // เริ่มจากแถวที่ 2 (ข้าม header)
    if (data[i][0] === deviceId) { // คอลัมน์ A คือ ID อุปกรณ์
      deviceSheet.getRange(i + 1, 4).setValue(status); // คอลัมน์ D คือสถานะ
      deviceSheet.getRange(i + 1, 7).setValue(borrower); // คอลัมน์ G คือผู้ยืม
      deviceSheet.getRange(i + 1, 8).setValue(dueDate); // คอลัมน์ H คือวันที่คืน
      
      // เปลี่ยนสีแถวตามสถานะ
      const rowRange = deviceSheet.getRange(i + 1, 1, 1, deviceSheet.getLastColumn());
      if (status === 'ถูกยืม') {
        rowRange.setBackground('#ffebee'); // สีแดงอ่อน
      } else {
        rowRange.setBackground('#e8f5e8'); // สีเขียวอ่อน
      }
      
      break;
    }
  }
}

/**
 * สร้าง response สำหรับความสำเร็จ
 */
function createSuccessResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * สร้าง response สำหรับข้อผิดพลาด
 */
function createErrorResponse(message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ฟังก์ชันทดสอบ (สำหรับ debug)
 */
function testScript() {
  const testData = {
    action: 'borrow',
    id: 'TEST001',
    name: 'อุปกรณ์ทดสอบ',
    category: 'ทดสอบ',
    borrower: 'ผู้ทดสอบ',
    duedate: '31/12/2024',
    note: 'ทดสอบระบบ'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test Result:', result.getContent());
}

/**
 * ฟังก์ชันสำหรับดูข้อมูลทั้งหมด
 */
function getAllDevices() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const deviceSheet = getOrCreateSheet(spreadsheet, 'รายการอุปกรณ์');
    const data = deviceSheet.getDataRange().getValues();
    
    console.log('All devices:', data);
    return data;
  } catch (error) {
    console.error('Error getting devices:', error);
    return [];
  }
}

/**
 * ฟังก์ชันสำหรับล้างข้อมูลทดสอบ (ใช้ระวัง!)
 */
function clearTestData() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const logSheet = spreadsheet.getSheetByName('บันทึกการใช้งาน');
  const deviceSheet = spreadsheet.getSheetByName('รายการอุปกรณ์');
  
  if (logSheet) {
    const lastRow = logSheet.getLastRow();
    if (lastRow > 1) {
      logSheet.getRange(2, 1, lastRow - 1, logSheet.getLastColumn()).clearContent();
    }
  }
  
  if (deviceSheet) {
    const lastRow = deviceSheet.getLastRow();
    if (lastRow > 1) {
      deviceSheet.getRange(2, 1, lastRow - 1, deviceSheet.getLastColumn()).clearContent();
    }
  }
  
  console.log('ล้างข้อมูลทดสอบเรียบร้อย');
}</parameter>