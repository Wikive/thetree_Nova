## Nova Skin v2

Version: v2

Nova는 the tree용 위키 스킨입니다. Liberty 계열 스킨의 문서 도구, 검색, 최근 활동, 설정 흐름을 유지하면서 Nova 전용 레이아웃과 반응형 UI를 적용합니다.

본문 영역은 위키 문서 CSS를 우선 사용하고, 스킨은 내비게이션, 문서 제목, 문서 도구, 사이드바, 푸터 같은 외곽 UI를 담당합니다. 폰트와 아이콘은 CDN을 쓰지 않고 스킨 내부 자산으로 처리합니다.

## 설정

Nova의 설정은 위키 설정에서 관리합니다. 새로 설정할 때는 `skin.nova.*`와 `nova.*` 키를 사용하면 됩니다.

예를 들어 기본 브랜드 색상, 로고, 푸터를 지정하려면 위키 설정에 다음처럼 넣습니다.

```js
skin.nova.brand_color = "#006cf0"
skin.nova.navbar_logo_text = "Nova Wiki"
skin.nova.navbar_logo_image = "https://example.com/logo.png"
skin.nova.footer_html = "<li><a href=\"/Policy\">정책</a></li>"
```

사용자 설정/로컬 설정으로 관리되는 항목은 다음처럼 사용합니다.

```js
nova.sidebar = "right"
nova.fixed_navbar = true
nova.reset_search_on_move = true
nova.admin_convenience = true
```

`nova.sidebar`는 `"right"`, `"fix"`, `"hide"`, `"footer"` 중 하나를 사용합니다. 목차는 별도 설정 없이 문서 본문에 `h2`, `h3`, `h4` 제목이 있으면 사이드바에 자동으로 표시됩니다.

### 기본

- `skin.nova.brand_color`: 스킨의 메인 컬러입니다. 상단바, 문서 제목 카드, 강조색, 다크모드 파생색이 이 값을 기준으로 계산됩니다.
- `skin.nova.footer_html`: 푸터에 추가로 넣을 HTML입니다. 값이 없으면 `wiki.footer_text`를 사용합니다.

### 로고

- `skin.nova.navbar_logo_text`: 상단 로고 텍스트입니다.
- `skin.nova.navbar_logo_image`: 상단 로고 이미지 URL입니다. Nova 전용 설정만 읽으며, 값이 없으면 텍스트 로고를 표시합니다.
- `skin.nova.navbar_logo_width`: 로고 박스 너비입니다. 세로 크기는 스킨이 고정하고 이미지는 중앙에 `contain`으로 맞춥니다.

### 사용자 설정

- `nova.sidebar`: 사이드바 표시 방식입니다. `hide`로 설정하면 사이드바를 숨깁니다.
- `nova.fixed_navbar`: 상단바를 고정합니다.
- `nova.reset_search_on_move`: 검색 바로가기 후 검색창을 비웁니다. 기본값은 `true`입니다.
- `nova.admin_convenience`: 관리 편의 도구를 켭니다. 기본값은 `true`입니다.

## 색상 정책

공식 색상 설정은 `skin.nova.brand_color` 하나만 권장합니다. 배경, 표면, 테두리, 보조 텍스트, 다크모드 색상은 스킨 CSS에서 자동으로 파생합니다.

`skin.nova.brand_color`만 공식 색상 키로 읽습니다. Liberty 설정은 fallback으로 사용하지 않습니다.

## 구조

- `layout.vue`: 스킨 레이아웃, 설정 매핑, 문서 제목, 사이드바, 푸터를 담당합니다.
- `components/NovaIcon.vue`: 스킨에서 사용하는 인라인 SVG 아이콘 모음입니다.
- `components/settingModal.vue`: 사용자 설정 모달입니다.
- `layouts/searchForm.vue`: 검색, 랜덤 문서, 바로가기 버튼입니다.
- `layouts/contentTool.vue`: 문서 도구입니다.
- `layouts/recentCard.vue`: 최근 변경/최근 토론 목록입니다.
- `css/nova.css`: Nova 전용 디자인, 다크모드, 최소 base/compat 레이어입니다.
- `css/font/Pretendard.css`: 로컬 Pretendard 폰트 선언입니다.

## 라이선스

Nova v2는 Liberty Skin과 thetree-skin-liberty의 구조를 기반으로 제작되었습니다. 기반 프로젝트에서 유래한 코드와 자산은 각 원 프로젝트의 라이선스와 고지를 따릅니다.

Liberty Skin은 GPL 3.0 라이선스로 배포됩니다. Liberty 원본 및 그 파생 부분을 수정하여 배포하는 경우, GPL 3.0 조건에 따라 수정한 소스 코드도 같은 라이선스 조건으로 공개해야 합니다. Nova v2를 수정해 배포하는 경우에도 Liberty 계열 코드에서 비롯된 부분과 그 변경 사항에 대한 GPL 3.0 의무를 준수해야 합니다.

- [Liberty Skin](https://github.com/librewiki/liberty-skin)
- [thetree-skin-liberty](https://github.com/wjdgustn/thetree-skin-liberty)
