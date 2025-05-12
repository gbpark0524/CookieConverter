# CookieConverter
![Image](https://github.com/user-attachments/assets/d8298058-d759-4e93-b280-d633ac9dd573)

웹사이트의 쿠키를 저장, 관리 및 복원할 수 있게 해주는 Chrome 확장 프로그램입니다.

A Chrome extension that allows you to save, manage, and restore cookies for websites.

## Features

- **현재 쿠키 저장**: 현재 사이트의 모든 쿠키를 사용자 지정 제목으로 저장
- **쿠키 복원**: 이전에 저장한 쿠키를 한 번의 클릭으로 현재 사이트에 적용
- **쿠키 만료일 관리**: 쿠키 만료 시간 연장 (일 및 시간 단위로 구성 가능)
- **간편한 쿠키 관리**: 직관적인 인터페이스를 통해 저장된 쿠키 세트의 이름 변경 및 삭제

## Installation

1. 이 저장소를 다운로드하거나 복제합니다
2. Chrome을 열고 `chrome://extensions/`로 이동합니다
3. 오른쪽 상단 모서리의 스위치를 토글하여 "개발자 모드"를 활성화합니다
4. "압축해제된 확장 프로그램을 로드합니다"를 클릭하고 이 확장 프로그램이 포함된 디렉토리를 선택합니다
5. Cookie Converter 확장 프로그램이 이제 확장 프로그램 목록에 나타납니다

## Usage

### Saving Cookies

1. 쿠키를 저장하고 싶은 웹사이트로 이동합니다
2. 브라우저 툴바에서 Cookie Converter 확장 프로그램 아이콘을 클릭합니다
3. 이 쿠키 세트의 제목을 입력합니다
4. "Save Cookies" 버튼을 클릭합니다

### Restoring Cookies

1. 쿠키를 복원하고 싶은 웹사이트로 이동합니다
2. Cookie Converter 확장 프로그램 아이콘을 클릭합니다
3. 목록에서 이전에 저장한 쿠키 세트를 클릭합니다
4. 쿠키가 자동으로 현재 사이트에 적용됩니다

### Managing Cookie Sets

1. 확장 프로그램 아이콘을 마우스 오른쪽 버튼으로 클릭하고 "옵션"을 선택하여 확장 프로그램 옵션 페이지를 엽니다
2. 저장된 모든 쿠키 세트를 볼 수 있습니다
3. 쿠키 세트를 클릭하여 이름을 변경합니다
4. 삭제 아이콘을 클릭하여 쿠키 세트를 제거합니다

### Configuring Expiration Extension

1. 확장 프로그램 옵션 페이지를 엽니다
2. "Extend Cookie Expiration"을 체크하여 쿠키 만료 시간 자동 연장을 활성화합니다
3. 일 및 시간 단위로 원하는 연장 기간을 구성합니다
4. "save" 버튼을 클릭하여 설정을 적용합니다

## Privacy

Cookie Converter는 모든 쿠키 데이터를 사용자의 기기에 로컬로 저장합니다. 데이터는 외부 서버나 제3자에게 전송되지 않습니다.

## File Structure

- `popup.html` & `popup.js`: 쿠키 저장 및 적용을 위한 확장 프로그램 팝업 인터페이스
- `options.html` & `option.js`: 구성 및 관리를 위한 확장 프로그램 옵션 페이지
- `manifest.json`: 확장 프로그램 구성 및 권한
- `common.css`: 공유 스타일

## Permissions

이 확장 프로그램은 다음 권한을 필요로 합니다:

- `cookies`: 웹사이트 쿠키를 읽고 수정하기 위함
- `storage`: 쿠키 데이터를 로컬에 저장하기 위함
- `<all_urls>`: 모든 웹사이트의 쿠키에 접근하기 위함

## Contact

- Email: gbpark0524@gmail.com
- GitHub: https://github.com/gbpark0524/CookieConverter

## License

This project is open source and available under the [MIT License](LICENSE).
