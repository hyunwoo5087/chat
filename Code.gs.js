/**
 * ============================================================
 *  AI-DOK 챗봇 데이터 로거 v3.1
 *  Google Apps Script (웹 앱으로 배포)
 * ============================================================
 *
 * 📋 배포 설정 안내
 * ─────────────────
 * 1. 구글 시트에 시트 탭 2개 준비
 *    - "Interactions" : 대화 로그
 *    - "Journals"     : 학습 일기 로그
 *    (탭 이름이 정확히 일치해야 합니다)
 *
 * 2. [확장 프로그램] → [Apps Script] 열기
 *    기존 코드를 모두 지우고 이 파일 전체를 붙여넣은 뒤 저장
 *
 * 3. [배포] → [새 배포] → 유형: 웹 앱
 *    - 다음 사용자로 실행 : 나
 *    - 액세스 권한       : 모든 사용자
 *    → [배포] 클릭 후 URL 복사
 *
 * 4. services/apiKey.ts 의 localGoogleSheetLoggerUrl 에 URL 붙여넣기
 *
 * 5. 정상 동작 확인: 복사한 URL을 브라우저에서 열어
 *    {"status":"ok"} 가 보이면 성공
 *
 * ⚠️ 기존 Interactions 시트가 있을 경우
 *    → 헤더 행(1행)이 새 컬럼과 다르면 자동으로 컬럼을 오른쪽에 추가합니다.
 *    → 데이터는 시트의 실제 컬럼 순서를 기준으로 기록되므로
 *       기존 데이터와 새 데이터가 일관되게 정렬됩니다.
 *
 * ============================================================
 */


// ── 시트별 최신 헤더 정의 (새 시트 생성 시 사용) ──────────────

var HEADERS = {
  Interactions: [
    'timestamp',            // KST 기준 로컬 시간
    'sessionId',            // 학교_학년_반_번호 고정 ID (종단 추적용)
    'school', 'grade', 'class', 'student_number', 'avatar',
    'turn_number',          // 세션 내 대화 순번
    'hint_used',            // 힌트 사용 여부 (Y/N)
    'response_time_ms',     // AI 응답 소요 시간(ms)
    'userMessage',          // 학생 발화 원문
    'modelResponse',        // AI 응답
    'question_dok_level',   // 학생 질문의 인지 복잡도 (1-4)
    'answer_dok_level',     // 학생 답변의 실제 사고 깊이 (1-4) ★핵심
    'dok_level',            // answer_dok_level 별칭 (하위 호환)
    'dok_reasoning',        // DOK 분류 근거
    'answer_quality_feedback', // 교사용 답변 품질 메모
    'keris_major',          // KERIS 대영역
    'keris_sub'             // KERIS 하위 요소
  ],
  Journals: [
    'timestamp',
    'sessionId',
    'school', 'grade', 'class', 'student_number', 'avatar',
    'learned',  // 배운 점
    'pledge'    // 실천 다짐
  ]
};


// ── doGet: 헬스체크 ─────────────────────────────────────────
/**
 * 배포 URL을 브라우저에서 열었을 때 호출됩니다.
 * {"status":"ok"} 가 반환되면 배포가 정상입니다.
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'AI-DOK 챗봇 로거 v3.1 정상 작동 중',
      sheets: Object.keys(HEADERS),
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}


// ── doPost: 데이터 수신 ─────────────────────────────────────
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);

    if (!e || !e.postData || !e.postData.contents) {
      return errorResponse('요청 본문이 비어있습니다.');
    }

    var data = JSON.parse(e.postData.contents);

    if (data.logType === 'interaction') {
      writeToSheet('Interactions', data);
    } else if (data.logType === 'journal') {
      writeToSheet('Journals', data);
    } else {
      return errorResponse('알 수 없는 logType: ' + data.logType);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error('doPost 오류:', err.toString());
    return errorResponse(err.toString());
  } finally {
    lock.releaseLock();
  }
}


// ── writeToSheet: 시트에 데이터 기록 ───────────────────────
function writeToSheet(sheetName, data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);

  // 시트가 없으면 새로 생성
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  var targetHeaders = HEADERS[sheetName];

  if (sheet.getLastRow() === 0) {
    // ── 새 시트: 최신 헤더로 초기화 ──
    sheet.appendRow(targetHeaders);
    applyHeaderStyle(sheet, targetHeaders.length);
    SpreadsheetApp.flush();
  } else {
    // ── 기존 시트: 누락 컬럼을 오른쪽에 추가 ──
    migrateHeaders(sheet, targetHeaders);
  }

  // ── 핵심: 시트의 실제 컬럼 순서를 읽어서 데이터 정렬 ──
  // targetHeaders 순서가 아닌, 시트에 실제로 있는 컬럼 순서를 기준으로 씀
  // → 기존 시트에 컬럼이 추가되었더라도 값이 올바른 열에 들어감
  var lastCol      = sheet.getLastColumn();
  var actualHeaders = sheet.getRange(1, 1, 1, lastCol)
                           .getValues()[0]
                           .map(function(h) { return String(h).trim(); });

  // ── 타임스탬프 KST 변환 ──
  var kstTime = data.timestamp
    ? formatKST(data.timestamp)
    : formatKST(new Date().toISOString());

  // ── 실제 헤더 순서에 맞게 행 데이터 구성 ──
  var rowData = actualHeaders.map(function(col) {
    if (col === 'timestamp') return kstTime;
    var val = data[col];
    if (val === undefined || val === null || col === '') return '';
    var str = String(val);
    // 셀 최대 길이 제한: 가독성을 위해 2,000자로 제한
    return str.length > 2000 ? str.substring(0, 2000) + '…' : str;
  });

  sheet.appendRow(rowData);
}


// ── migrateHeaders: 누락 컬럼을 오른쪽에 추가 ─────────────
/**
 * 기존 헤더에 없는 컬럼만 오른쪽 끝에 추가합니다.
 * 기존 데이터와 컬럼 순서는 그대로 유지됩니다.
 */
function migrateHeaders(sheet, targetHeaders) {
  var lastCol        = sheet.getLastColumn();
  var existingValues = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var existingSet    = {};
  existingValues.forEach(function(h) { existingSet[String(h).trim()] = true; });

  var added = false;
  targetHeaders.forEach(function(col) {
    if (!existingSet[col]) {
      var newColIdx = sheet.getLastColumn() + 1;
      var cell      = sheet.getRange(1, newColIdx);
      cell.setValue(col);
      // 새로 추가된 컬럼은 노란색으로 표시해 구분
      cell.setBackground('#FFF2CC').setFontWeight('bold');
      existingSet[col] = true;
      added = true;
      console.log('새 컬럼 추가: ' + col + ' (열 ' + newColIdx + ')');
    }
  });

  if (added) {
    SpreadsheetApp.flush();
  }
}


// ── applyHeaderStyle: 신규 시트 헤더 스타일 ────────────────
function applyHeaderStyle(sheet, colCount) {
  var range = sheet.getRange(1, 1, 1, colCount);
  range
    .setBackground('#1A2A6C')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
}


// ── formatKST: UTC ISO 문자열 → KST ────────────────────────
// ⚠️ 수동으로 +9시간을 더하면 스프레드시트 시간대 설정에 따라
//    중복 변환 또는 미변환 문제가 생깁니다.
//    Utilities.formatDate()에 시간대를 명시하면 항상 정확합니다.
function formatKST(isoString) {
  try {
    var date = new Date(isoString);
    return Utilities.formatDate(date, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
  } catch (e) {
    return isoString;
  }
}


// ── errorResponse ───────────────────────────────────────────
function errorResponse(message) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'error', message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}


// ── initializeSheets: 수동 초기화 함수 ─────────────────────
/**
 * Apps Script 편집기에서 직접 실행할 수 있는 초기화 함수입니다.
 *
 * 실행 방법:
 *   편집기 상단 함수 드롭다운에서 'initializeSheets' 선택 → ▶ 실행
 *
 * 수행 내용:
 *   - 시트 탭이 없으면 생성
 *   - 헤더 행이 없으면 작성 + 스타일 적용
 *   - 헤더가 있지만 새 컬럼이 누락된 경우 자동 추가
 */
function initializeSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  Object.keys(HEADERS).forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      console.log('[생성] ' + sheetName + ' 시트 생성됨');
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS[sheetName]);
      applyHeaderStyle(sheet, HEADERS[sheetName].length);
      console.log('[초기화] ' + sheetName + ' 헤더 작성 완료');
    } else {
      migrateHeaders(sheet, HEADERS[sheetName]);
      console.log('[마이그레이션] ' + sheetName + ' 헤더 확인 완료');
    }
  });

  SpreadsheetApp.flush();
  console.log('✅ 초기화 완료');
}