/**
 * 사회성숙도 검사 웹앱 - Google Apps Script 연동 코드
 *
 * 사용 방법:
 * 1. https://script.google.com 에서 새 프로젝트 생성
 * 2. 아래 코드 전체를 붙여넣기
 * 3. 배포 → 새 배포 → 웹앱
 *    - 다음 사용자로 실행: 나
 *    - 액세스 권한: 모든 사용자 (익명 포함)
 * 4. 배포 → 첫 실행 시 "사회성숙도 검사 결과" 스프레드시트가 자동 생성됨
 *
 * ※ 기존 스프레드시트를 사용하려면 아래 SPREADSHEET_ID에 ID를 입력
 *    (비워두면 자동 생성)
 */

const SPREADSHEET_ID = '';  // 비워두면 첫 실행 시 자동 생성
const SHEET_NAME = '검사결과';

function getOrCreateSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  let ssId = SPREADSHEET_ID || props.getProperty('SPREADSHEET_ID');

  if (ssId) {
    try {
      return SpreadsheetApp.openById(ssId);
    } catch (e) {
      // ID가 잘못된 경우 새로 생성
    }
  }

  const ss = SpreadsheetApp.create('사회성숙도 검사 결과');
  props.setProperty('SPREADSHEET_ID', ss.getId());

  // 기본 Sheet1 제거 후 검사결과 시트 생성
  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('시트1');
  const resultSheet = ss.insertSheet(SHEET_NAME);
  if (defaultSheet) ss.deleteSheet(defaultSheet);

  return ss;
}

function doPost(e) {
  try {
    // text/plain으로 전송되므로 e.postData.contents 직접 파싱
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('요청 본문이 비어있습니다. postData: ' + JSON.stringify(e?.postData));
    }

    const data = JSON.parse(e.postData.contents);
    const ss = getOrCreateSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    // 첫 행: 헤더
    if (sheet.getLastRow() === 0) {
      const headers = Object.keys(data);
      sheet.appendRow(headers);
      const hr = sheet.getRange(1, 1, 1, headers.length);
      hr.setBackground('#1e40af');
      hr.setFontColor('#ffffff');
      hr.setFontWeight('bold');
      hr.setFontSize(10);
      sheet.setFrozenRows(1);

      // 열 너비 자동 조정
      for (let i = 1; i <= headers.length; i++) {
        sheet.setColumnWidth(i, 100);
      }
    }

    // 헤더 순서에 맞게 데이터 정렬
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = headers.map(h => (data[h] !== undefined ? data[h] : ''));
    sheet.appendRow(row);

    // 짝수 행 배경색
    const lastRow = sheet.getLastRow();
    if (lastRow % 2 === 0) {
      sheet.getRange(lastRow, 1, 1, headers.length).setBackground('#f0f9ff');
    }

    const ssUrl = ss.getUrl();
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', row: lastRow, url: ssUrl }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 오류를 실행 로그에 기록
    console.error('doPost 오류:', error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    // ?data=... 파라미터가 있으면 시트에 저장
    if (e && e.parameter && e.parameter.data) {
      const data = JSON.parse(decodeURIComponent(e.parameter.data));
      return handleSave(data);
    }

    // 파라미터 없으면 연결 테스트
    const ss = getOrCreateSpreadsheet();
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', spreadsheetUrl: ss.getUrl() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('doGet 오류:', error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleSave(data) {
  const ss = getOrCreateSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    const headers = Object.keys(data);
    sheet.appendRow(headers);
    const hr = sheet.getRange(1, 1, 1, headers.length);
    hr.setBackground('#1e40af');
    hr.setFontColor('#ffffff');
    hr.setFontWeight('bold');
    hr.setFontSize(10);
    sheet.setFrozenRows(1);
    for (let i = 1; i <= headers.length; i++) sheet.setColumnWidth(i, 100);
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => (data[h] !== undefined ? data[h] : ''));
  sheet.appendRow(row);

  const lastRow = sheet.getLastRow();
  if (lastRow % 2 === 0) {
    sheet.getRange(lastRow, 1, 1, headers.length).setBackground('#f0f9ff');
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', row: lastRow, url: ss.getUrl() }))
    .setMimeType(ContentService.MimeType.JSON);
}
